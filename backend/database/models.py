import logging
from .connection import get_db_connection

logger = logging.getLogger(__name__)

def init_db():
    """Initializes SQLite database schemas for UrjaDrishti persistence."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 1. Consumption logs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS consumption_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                household_id TEXT DEFAULT 'HH_01',
                load_kwh REAL NOT NULL,
                temperature REAL,
                is_anomaly INTEGER DEFAULT 0
            )
        ''')
        
        # 2. Prediction history table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS prediction_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                model_id TEXT NOT NULL,
                horizon_hours INTEGER DEFAULT 24,
                predicted_load_kw REAL NOT NULL,
                confidence_lower REAL,
                confidence_upper REAL,
                input_features TEXT
            )
        ''')
        
        # 3. Billing simulation history table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS billing_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                provider TEXT NOT NULL,
                units REAL NOT NULL,
                tariff_fy TEXT DEFAULT 'FY 2022-23',
                total_bill REAL,
                calculation_status TEXT,
                breakdown_json TEXT
            )
        ''')
        
        # 4. Anomaly events table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS anomaly_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                household_id TEXT DEFAULT 'HH_01',
                actual_kwh REAL NOT NULL,
                expected_kwh REAL,
                severity TEXT NOT NULL,
                score REAL,
                detector TEXT NOT NULL,
                is_ground_truth INTEGER DEFAULT 0
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.warning("Optional database initialization failed (continuing in degraded mode): %s", str(e))
