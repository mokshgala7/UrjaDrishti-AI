import sqlite3
import os
import logging
from config import Config

logger = logging.getLogger(__name__)

def get_db_connection():
    """
    Returns a database connection. Defaults to SQLite at Config.DB_PATH.
    If database access fails, raises an exception for caller to handle gracefully.
    """
    try:
        os.makedirs(os.path.dirname(Config.DB_PATH), exist_ok=True)
        conn = sqlite3.connect(str(Config.DB_PATH), timeout=10.0)
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        logger.error("Failed to connect to database: %s", str(e))
        raise
