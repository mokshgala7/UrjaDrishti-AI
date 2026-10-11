import logging
from datetime import datetime
from typing import Dict, Any, Optional

from sqlalchemy import (
    Column,
    Integer,
    BigInteger,
    String,
    DateTime,
    Numeric,
    Text,
    Boolean,
    Index
)
from sqlalchemy.orm import declarative_base

from .connection import get_db_engine, get_db_session

logger = logging.getLogger(__name__)

Base = declarative_base()


class ConsumptionLog(Base):
    """
    Persisted household power consumption readings and telemetry.
    """
    __tablename__ = 'consumption_logs'

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    household_id = Column(String(64), nullable=False, default='HH_01', index=True)
    load_kwh = Column(Numeric(10, 4), nullable=False)
    temperature = Column(Numeric(6, 2), nullable=True)
    is_anomaly = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S") if self.timestamp else None,
            "household_id": self.household_id,
            "load_kwh": float(self.load_kwh) if self.load_kwh is not None else 0.0,
            "temperature": float(self.temperature) if self.temperature is not None else None,
            "is_anomaly": bool(self.is_anomaly),
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None
        }


class PredictionHistory(Base):
    """
    Persisted machine learning model inference records and forecasts.
    """
    __tablename__ = 'prediction_history'

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    created_at = Column(DateTime, nullable=False, index=True, default=datetime.now)
    model_id = Column(String(64), nullable=False, index=True)
    horizon_hours = Column(Integer, nullable=False, default=24)
    predicted_load_kw = Column(Numeric(10, 4), nullable=False)
    confidence_lower = Column(Numeric(10, 4), nullable=True)
    confidence_upper = Column(Numeric(10, 4), nullable=True)
    input_features = Column(Text, nullable=True)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
            "model_id": self.model_id,
            "horizon_hours": self.horizon_hours,
            "predicted_load_kw": float(self.predicted_load_kw) if self.predicted_load_kw is not None else 0.0,
            "confidence_lower": float(self.confidence_lower) if self.confidence_lower is not None else None,
            "confidence_upper": float(self.confidence_upper) if self.confidence_upper is not None else None,
            "input_features": self.input_features
        }


class BillingHistory(Base):
    """
    Persisted electricity bill simulations calculated using verified Mumbai tariff rules.
    """
    __tablename__ = 'billing_history'

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    created_at = Column(DateTime, nullable=False, index=True, default=datetime.now)
    provider = Column(String(64), nullable=False, index=True)
    units = Column(Numeric(10, 2), nullable=False)
    tariff_fy = Column(String(32), nullable=False, default='FY 2022-23')
    total_bill = Column(Numeric(10, 2), nullable=True)
    calculation_status = Column(String(64), nullable=True)
    breakdown_json = Column(Text, nullable=True)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
            "provider": self.provider,
            "units": float(self.units) if self.units is not None else 0.0,
            "tariff_fy": self.tariff_fy,
            "total_bill": float(self.total_bill) if self.total_bill is not None else None,
            "calculation_status": self.calculation_status,
            "breakdown_json": self.breakdown_json
        }


class AnomalyEvent(Base):
    """
    Persisted anomaly events detected by Isolation Forest and statistical checks.
    """
    __tablename__ = 'anomaly_events'

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    household_id = Column(String(64), nullable=False, default='HH_01', index=True)
    actual_kwh = Column(Numeric(10, 4), nullable=False)
    expected_kwh = Column(Numeric(10, 4), nullable=True)
    severity = Column(String(32), nullable=False, index=True)
    score = Column(Numeric(8, 4), nullable=True)
    detector = Column(String(64), nullable=False)
    is_ground_truth = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S") if self.timestamp else None,
            "household_id": self.household_id,
            "actual_kwh": float(self.actual_kwh) if self.actual_kwh is not None else 0.0,
            "expected_kwh": float(self.expected_kwh) if self.expected_kwh is not None else None,
            "severity": self.severity,
            "score": float(self.score) if self.score is not None else None,
            "detector": self.detector,
            "is_ground_truth": bool(self.is_ground_truth),
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None
        }


def init_db(engine=None) -> bool:
    """
    Safely creates all database tables if they do not already exist.
    Does NOT drop tables, alter existing columns, or erase any data.
    """
    try:
        if engine is None:
            engine = get_db_engine()

        Base.metadata.create_all(bind=engine, checkfirst=True)
        logger.info("Database tables initialized successfully via SQLAlchemy Base.metadata.")
        return True
    except Exception as e:
        logger.warning(
            "Database table initialization notice: unable to verify/create tables on startup: %s. "
            "(The application continues running; verify MySQL connection and run backend/database/init_db.py)",
            str(e)
        )
        return False
