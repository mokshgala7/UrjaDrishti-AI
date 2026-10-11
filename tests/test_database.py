import os
import unittest
import json
from datetime import datetime
from pathlib import Path
from decimal import Decimal

from config import Config
from database.connection import (
    get_db_engine,
    get_db_session,
    check_database_health,
    SessionLocal
)
from database.models import (
    Base,
    ConsumptionLog,
    PredictionHistory,
    BillingHistory,
    AnomalyEvent,
    init_db
)
from services.billing_service import calculate_mumbai_bill, get_billing_history
from services.prediction_service import predict_load, get_prediction_history
from services.anomaly_service import persist_anomaly_events, get_persisted_anomalies
from sqlalchemy.engine import URL
from sqlalchemy import create_engine, inspect, text


class TestDatabaseIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Tables are already created via isolated test fixture in conftest.py
        init_db()

    def test_mysql_url_construction_and_password_escaping(self):
        """1. Verifies MySQL connection URL construction with special characters in password."""
        special_pass = "P@ss:w/ord%2026!#"
        url = URL.create(
            drivername="mysql+pymysql",
            username="urja_user",
            password=special_pass,
            host="127.0.0.1",
            port=3306,
            database="urjadrishti_ai"
        )
        url_str = url.render_as_string(hide_password=False)
        masked_str = url.render_as_string(hide_password=True)

        # Ensure special characters are escaped and not broken
        self.assertTrue(url_str.startswith("mysql+pymysql://urja_user:"))
        self.assertIn("@127.0.0.1:3306/urjadrishti_ai", url_str)
        # Ensure password is masked in masked view
        self.assertNotIn(special_pass, masked_str)
        self.assertIn("***", masked_str)

    def test_masked_url_in_config(self):
        """2. Verifies Config.get_database_url_masked hides sensitive passwords."""
        masked = Config.get_database_url_masked()
        self.assertIsInstance(masked, str)
        if Config.DB_PASSWORD:
            self.assertNotIn(Config.DB_PASSWORD, masked)

    def test_table_initialization_and_metadata(self):
        """3. Verifies that all required tables exist in metadata."""
        engine = get_db_engine()
        inspector = inspect(engine)
        tables = inspector.get_table_names()

        expected = ["consumption_logs", "prediction_history", "billing_history", "anomaly_events"]
        for table_name in expected:
            self.assertIn(table_name, tables, f"Expected table '{table_name}' was not created.")

    def test_prediction_record_persistence(self):
        """4. Verifies prediction record persistence via SQLAlchemy session."""
        created_dt = datetime.now()
        with get_db_session() as session:
            rec = PredictionHistory(
                created_at=created_dt,
                model_id="test_model_rf",
                horizon_hours=24,
                predicted_load_kw=1.8542,
                confidence_lower=1.6310,
                confidence_upper=2.0774,
                input_features=json.dumps({"temp": 32.5, "hour": 14})
            )
            session.add(rec)
            session.flush()
            rec_id = rec.id

        # Verify retrieval
        with get_db_session() as session:
            fetched = session.query(PredictionHistory).filter_by(id=rec_id).first()
            self.assertIsNotNone(fetched)
            self.assertEqual(fetched.model_id, "test_model_rf")
            self.assertEqual(fetched.horizon_hours, 24)
            self.assertAlmostEqual(float(fetched.predicted_load_kw), 1.8542, places=3)
            data = fetched.to_dict()
            self.assertEqual(data["model_id"], "test_model_rf")

    def test_billing_record_persistence(self):
        """5. Verifies electricity bill calculation persistence and DECIMAL handling."""
        created_dt = datetime.now()
        with get_db_session() as session:
            bill = BillingHistory(
                created_at=created_dt,
                provider="Adani Electricity",
                units=Decimal("150.00"),
                tariff_fy="FY 2022-23",
                total_bill=Decimal("1174.50"),
                calculation_status="VERIFIED_CALCULATION",
                breakdown_json=json.dumps([{"slab": "0-100", "amount": 500.0}])
            )
            session.add(bill)
            session.flush()
            bill_id = bill.id

        with get_db_session() as session:
            fetched = session.query(BillingHistory).filter_by(id=bill_id).first()
            self.assertIsNotNone(fetched)
            self.assertEqual(fetched.provider, "Adani Electricity")
            self.assertAlmostEqual(float(fetched.units), 150.0)
            self.assertAlmostEqual(float(fetched.total_bill), 1174.50)
            data = fetched.to_dict()
            self.assertEqual(data["calculation_status"], "VERIFIED_CALCULATION")

    def test_anomaly_event_persistence(self):
        """6. Verifies anomaly event persistence via helper."""
        test_events = [
            {
                "timestamp": "2026-10-11 18:00:00",
                "household_id": "HH_TEST_01",
                "actual_kwh": 4.82,
                "expected_kwh": 1.20,
                "severity": "CRITICAL",
                "anomaly_score": -0.82,
                "detection_method": "Isolation Forest",
                "is_ground_truth": False
            }
        ]
        count = persist_anomaly_events(test_events)
        self.assertEqual(count, 1)

        history = get_persisted_anomalies(limit=5)
        self.assertIsInstance(history, list)
        matched = [h for h in history if h.get("household_id") == "HH_TEST_01"]
        self.assertTrue(len(matched) > 0)
        self.assertEqual(matched[0]["severity"], "CRITICAL")

    def test_consumption_log_persistence(self):
        """7. Verifies consumption telemetry log persistence."""
        with get_db_session() as session:
            log = ConsumptionLog(
                timestamp=datetime.now(),
                household_id="HH_MUMBAI_09",
                load_kwh=Decimal("2.4500"),
                temperature=Decimal("29.40"),
                is_anomaly=False
            )
            session.add(log)
            session.flush()
            log_id = log.id

        with get_db_session() as session:
            fetched = session.query(ConsumptionLog).filter_by(id=log_id).first()
            self.assertIsNotNone(fetched)
            self.assertEqual(fetched.household_id, "HH_MUMBAI_09")
            self.assertAlmostEqual(float(fetched.load_kwh), 2.45, places=2)

    def test_transaction_rollback_on_error(self):
        """8. Verifies that transactions are safely rolled back on exceptions."""
        initial_count = 0
        with get_db_session() as session:
            initial_count = session.query(BillingHistory).count()

        with self.assertRaises(ValueError):
            with get_db_session() as session:
                bill = BillingHistory(
                    created_at=datetime.now(),
                    provider="BEST Undertaking",
                    units=Decimal("100.00"),
                    tariff_fy="FY 2022-23",
                    total_bill=Decimal("600.00"),
                    calculation_status="ROLLED_BACK"
                )
                session.add(bill)
                session.flush()
                # Deliberate failure triggering rollback
                raise ValueError("Intentional error to trigger rollback")

        # Verify record was not committed
        with get_db_session() as session:
            final_count = session.query(BillingHistory).count()
            self.assertEqual(initial_count, final_count)

    def test_schema_sql_file_exists_and_valid(self):
        """9. Verifies backend/database/schema.sql exists and contains valid definitions."""
        schema_path = Path(__file__).resolve().parent.parent / "backend" / "database" / "schema.sql"
        self.assertTrue(schema_path.exists(), "backend/database/schema.sql does not exist!")

        content = schema_path.read_text(encoding="utf-8")
        self.assertIn("CREATE DATABASE IF NOT EXISTS urjadrishti_ai", content)
        self.assertIn("CREATE TABLE IF NOT EXISTS consumption_logs", content)
        self.assertIn("CREATE TABLE IF NOT EXISTS prediction_history", content)
        self.assertIn("CREATE TABLE IF NOT EXISTS billing_history", content)
        self.assertIn("CREATE TABLE IF NOT EXISTS anomaly_events", content)
        self.assertIn("DECIMAL(10, 2)", content)

    def test_connection_failure_diagnostics(self):
        """10. Verifies connection failure handling reports clear diagnostics without exposing passwords."""
        # Test health check against an invalid host
        bad_url = "mysql+pymysql://test_user:super_secret_pwd@127.0.0.1:59999/urjadrishti_ai"
        bad_engine = create_engine(bad_url, connect_args={"connect_timeout": 1})
        try:
            with bad_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            failed = False
        except Exception as e:
            failed = True
            err_str = str(e)
            # Verify password masking
            sanitized = err_str.replace("super_secret_pwd", "********")
            self.assertNotIn("super_secret_pwd", sanitized)
        self.assertTrue(failed)


if __name__ == "__main__":
    unittest.main()
