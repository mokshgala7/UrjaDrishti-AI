import logging
from contextlib import contextmanager
from typing import Dict, Any, Optional

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker, scoped_session, Session
from sqlalchemy.exc import SQLAlchemyError, OperationalError

from config import Config

logger = logging.getLogger(__name__)

_engine: Optional[Engine] = None
_SessionFactory = None
SessionLocal = None


def get_db_engine() -> Engine:
    """
    Initializes and returns the singleton SQLAlchemy engine configured for MySQL.
    Uses connection pooling and pool_pre_ping to detect stale connections.
    """
    global _engine, _SessionFactory, SessionLocal
    if _engine is not None:
        return _engine

    db_url = Config.DATABASE_URL
    masked_url = Config.get_database_url_masked()

    try:
        if db_url.startswith("sqlite"):
            from sqlalchemy.pool import StaticPool
            # Isolated test environment support
            _engine = create_engine(
                db_url,
                connect_args={"check_same_thread": False},
                poolclass=StaticPool,
                echo=False
            )
        else:
            # Production MySQL configuration
            _engine = create_engine(
                db_url,
                pool_pre_ping=True,      # Tests connection liveness before checkout
                pool_recycle=3600,       # Recycles connections after 1 hour (avoids MySQL wait_timeout)
                pool_size=10,            # Main connection pool size
                max_overflow=20,         # Maximum overflow connections under burst load
                pool_timeout=30,         # Seconds to wait before giving up on acquiring connection
                echo=False
            )

        _SessionFactory = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
        SessionLocal = scoped_session(_SessionFactory)
        logger.info("SQLAlchemy engine initialized for: %s", masked_url)
        return _engine
    except Exception as e:
        logger.error(
            "Failed to initialize SQLAlchemy engine for %s: %s",
            masked_url,
            str(e)
        )
        raise


def get_session_factory():
    """Returns the scoped session factory, initializing engine if needed."""
    if SessionLocal is None:
        get_db_engine()
    return SessionLocal


@contextmanager
def get_db_session():
    """
    Context manager providing a transactional scope for SQLAlchemy ORM operations.
    Automatically commits on normal exit and rolls back on unhandled exceptions.
    Ensures sessions are closed properly in all conditions.
    """
    session_factory = get_session_factory()
    session: Session = session_factory()
    try:
        yield session
        session.commit()
    except Exception as exc:
        session.rollback()
        logger.error("Transaction rolled back due to error: %s", str(exc))
        raise
    finally:
        session.close()


def get_db_connection():
    """
    Backward-compatible connection provider for legacy queries.
    Returns a connection from the SQLAlchemy engine.
    """
    engine = get_db_engine()
    return engine.connect()


def check_database_health() -> Dict[str, Any]:
    """
    Tests database connectivity using a lightweight query (SELECT 1).
    Returns diagnostic details without exposing passwords or credentials.
    """
    masked_url = Config.get_database_url_masked()
    is_mysql = Config.DATABASE_URL.startswith("mysql")
    
    try:
        engine = get_db_engine()
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {
            "connected": True,
            "database_type": "mysql" if is_mysql else "sqlite",
            "database_name": Config.DB_NAME if is_mysql else "test_db",
            "host": f"{Config.DB_HOST}:{Config.DB_PORT}" if is_mysql else "local",
            "masked_url": masked_url,
            "error": None
        }
    except Exception as e:
        error_msg = str(e)
        # Avoid leaking any raw password strings that driver might output
        if Config.DB_PASSWORD and Config.DB_PASSWORD in error_msg:
            error_msg = error_msg.replace(Config.DB_PASSWORD, "********")

        logger.error("Database health check failed for %s: %s", masked_url, error_msg)
        return {
            "connected": False,
            "database_type": "mysql" if is_mysql else "sqlite",
            "database_name": Config.DB_NAME if is_mysql else "test_db",
            "host": f"{Config.DB_HOST}:{Config.DB_PORT}" if is_mysql else "local",
            "masked_url": masked_url,
            "error": error_msg,
            "troubleshooting": (
                "1. Verify local MySQL Server is running (macOS System Settings > MySQL, or 'mysql.server status').\n"
                "2. In MySQL Workbench, verify database 'urjadrishti_ai' exists or execute backend/database/schema.sql.\n"
                "3. Verify DB_USER, DB_PASSWORD, DB_HOST, and DB_PORT in backend/.env."
            ) if is_mysql else "Test database connection failed."
        }


def register_db_teardown(app):
    """Registers Flask teardown hook to clean up scoped sessions after each request."""
    @app.teardown_appcontext
    def shutdown_session(exception=None):
        if SessionLocal is not None:
            SessionLocal.remove()
