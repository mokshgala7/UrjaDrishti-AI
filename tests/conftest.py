import os
import sys
from pathlib import Path

# Add project root and backend to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"

for p in [str(PROJECT_ROOT), str(BACKEND_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Configure isolated in-memory test database so tests run offline without live MySQL credentials
os.environ["TESTING"] = "True"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from config import Config
Config.DATABASE_URL = "sqlite:///:memory:"

from database.models import init_db
init_db()
