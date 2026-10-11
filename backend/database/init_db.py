"""
Database Initialization CLI Script for UrjaDrishti AI
Usage:
    cd backend && python -m database.init_db
    or
    python backend/database/init_db.py
"""

import sys
import logging
from pathlib import Path

# Add backend directory to path if running directly
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from config import Config
from database.connection import get_db_engine, Config
from database.models import Base
from sqlalchemy import inspect, text, create_engine
from sqlalchemy.engine import URL

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("init_db")

EXPECTED_TABLES = [
    "consumption_logs",
    "prediction_history",
    "billing_history",
    "anomaly_events"
]


def ensure_mysql_database_exists() -> bool:
    """
    Checks if target MySQL database exists. If not, attempts safe creation
    if credentials have privilege, or returns helpful guidance.
    """
    if not Config.DATABASE_URL.startswith("mysql"):
        return True

    logger.info("Connecting to MySQL host %s:%s...", Config.DB_HOST, Config.DB_PORT)
    
    # Try direct connection to target DB first
    try:
        engine = get_db_engine()
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Target database '%s' exists and is accessible.", Config.DB_NAME)
        return True
    except Exception as e:
        err_str = str(e)
        logger.warning("Could not directly access database '%s': %s", Config.DB_NAME, err_str)

        # Check if database does not exist (MySQL error 1049: Unknown database)
        if "1049" in err_str or "Unknown database" in err_str:
            logger.info("Attempting to automatically create database '%s'...", Config.DB_NAME)
            try:
                # Connect to server root without specifying database
                server_url = URL.create(
                    drivername="mysql+pymysql",
                    username=Config.DB_USER,
                    password=Config.DB_PASSWORD if Config.DB_PASSWORD else None,
                    host=Config.DB_HOST,
                    port=Config.DB_PORT
                )
                admin_engine = create_engine(server_url)
                with admin_engine.connect() as conn:
                    conn.execute(text(
                        f"CREATE DATABASE IF NOT EXISTS `{Config.DB_NAME}` "
                        "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
                    ))
                    conn.commit()
                admin_engine.dispose()
                logger.info("Successfully created database '%s'.", Config.DB_NAME)
                return True
            except Exception as create_err:
                logger.error(
                    "\n====================================================================\n"
                    "DATABASE CREATION REQUIRED IN MYSQL WORKBENCH\n"
                    "====================================================================\n"
                    "Could not automatically create database '%s': %s\n\n"
                    "Please follow these instructions in MySQL Workbench:\n"
                    "1. Open MySQL Workbench on your Mac and connect to Local MySQL.\n"
                    "2. Open and execute the provided SQL script at:\n"
                    "   backend/database/schema.sql\n"
                    "3. Or execute this SQL command in a Query tab:\n"
                    "   CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET utf8mb4;\n"
                    "====================================================================\n",
                    Config.DB_NAME,
                    str(create_err),
                    Config.DB_NAME
                )
                return False
        else:
            logger.error(
                "\n====================================================================\n"
                "MYSQL CONNECTION FAILURE\n"
                "====================================================================\n"
                "Failed to connect to MySQL Server at %s:%s.\n"
                "Details: %s\n\n"
                "Troubleshooting steps:\n"
                "1. Verify MySQL Server is running (macOS System Settings > MySQL, or Workbench).\n"
                "2. Check DB_USER, DB_PASSWORD, DB_HOST, and DB_PORT in backend/.env.\n"
                "====================================================================\n",
                Config.DB_HOST,
                Config.DB_PORT,
                err_str
            )
            return False


def initialize_tables() -> bool:
    """
    Creates tables safely from SQLAlchemy models and verifies their existence.
    """
    engine = get_db_engine()
    
    logger.info("Ensuring all application tables exist in '%s'...", Config.DB_NAME)
    Base.metadata.create_all(bind=engine, checkfirst=True)

    # Verify tables
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    logger.info("Database verification results:")
    all_ok = True
    for t in EXPECTED_TABLES:
        if t in existing_tables:
            cols = [col["name"] for col in inspector.get_columns(t)]
            logger.info("  [✓] Table '%s' present (%d columns)", t, len(cols))
        else:
            logger.error("  [✗] Table '%s' MISSING!", t)
            all_ok = False

    return all_ok


def main():
    print("=" * 65)
    print("  UrjaDrishti AI — Database Initialization Tool")
    print(f"  Target: {Config.get_database_url_masked()}")
    print("=" * 65)

    if not ensure_mysql_database_exists():
        sys.exit(1)

    if initialize_tables():
        print("\n[SUCCESS] UrjaDrishti AI database is ready!")
        print(f"You can now open MySQL Workbench, inspect '{Config.DB_NAME}', and run the app.\n")
        sys.exit(0)
    else:
        print("\n[ERROR] Database table verification failed.")
        sys.exit(1)


if __name__ == "__main__":
    main()
