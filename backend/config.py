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
    
    # Database configuration
    DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'database' / 'urjadrishti.db'}")
    DB_PATH = BASE_DIR / "database" / "urjadrishti.db"
    
    # Security and CORS
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
    SECRET_KEY = os.getenv("SECRET_KEY", "urjadrishti-mumbai-secret-key-2026")
    
    # Environmental constants
    # Central Electricity Authority (CEA) India CO2 baseline emission factor for Indian grid mix (~0.716 kg CO2/kWh)
    CEA_GRID_EMISSION_FACTOR = float(os.getenv("CEA_GRID_EMISSION_FACTOR", 0.716))
    
    # App info
    VERSION = "1.0.0"
    APP_NAME = "UrjaDrishti-AI"
