import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

class Config:
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    PORT = int(os.getenv("PORT", 5000))
    HOST = os.getenv("HOST", "0.0.0.0")
    
    # Data & ML directories
    DATA_DIR = Path(os.getenv("DATA_DIR", PROJECT_ROOT / "ml" / "data"))
    ARTIFACTS_DIR = Path(os.getenv("ARTIFACTS_DIR", PROJECT_ROOT / "ml" / "artifacts"))
    
    # MySQL Database configuration (defaults for local laptop demonstration)
    DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
    DB_PORT = int(os.getenv("DB_PORT", 3306))
    DB_NAME = os.getenv("DB_NAME", "urjadrishti_ai")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    
    # Allow explicit DATABASE_URL override (e.g. for isolated unit tests: sqlite:///:memory:)
    _raw_database_url = os.getenv("DATABASE_URL")
    if _raw_database_url:
        DATABASE_URL = _raw_database_url
    else:
        from sqlalchemy.engine import URL
        DATABASE_URL = URL.create(
            drivername="mysql+pymysql",
            username=DB_USER,
            password=DB_PASSWORD if DB_PASSWORD else None,
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
        ).render_as_string(hide_password=False)
        
    # Legacy path reference (preserved for compatibility/migration checks only)
    DB_PATH = BASE_DIR / "database" / "urjadrishti.db"

    @classmethod
    def get_database_url_masked(cls) -> str:
        """Returns database URL with masked password for logs and health checks."""
        if cls.DATABASE_URL.startswith("mysql"):
            from sqlalchemy.engine import URL
            try:
                u = URL.create(
                    drivername="mysql+pymysql",
                    username=cls.DB_USER,
                    password=cls.DB_PASSWORD if cls.DB_PASSWORD else None,
                    host=cls.DB_HOST,
                    port=cls.DB_PORT,
                    database=cls.DB_NAME,
                )
                return u.render_as_string(hide_password=True)
            except Exception:
                return f"mysql+pymysql://{cls.DB_USER}:***@{cls.DB_HOST}:{cls.DB_PORT}/{cls.DB_NAME}"
        return "sqlite:///:memory:" if ":memory:" in cls.DATABASE_URL else "sqlite:///[local_file]"
    
    # Security and CORS
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
    SECRET_KEY = os.getenv("SECRET_KEY", "urjadrishti-mumbai-secret-key-2026")
    
    # Environmental constants
    # Central Electricity Authority (CEA) India CO2 baseline emission factor for Indian grid mix (~0.716 kg CO2/kWh)
    CEA_GRID_EMISSION_FACTOR = float(os.getenv("CEA_GRID_EMISSION_FACTOR", 0.716))
    
    # App info
    VERSION = "1.0.0"
    APP_NAME = "UrjaDrishti-AI"
