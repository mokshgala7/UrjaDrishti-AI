# UrjaDrishti-AI ⚡
> Intelligent Household Electricity Consumption Forecasting, Anomaly Detection & Mumbai Tariff Bill Simulation

## 📌 Overview
UrjaDrishti-AI is a specialized energy analytics and machine learning platform tailored for Mumbai residential consumers across **Adani Electricity (AEML-D)** and **BEST Undertaking** supply areas.

---

## 🏗️ Project Architecture
```text
UrjaDrishti-AI/
├── frontend/                              # React + Vite UI (Calculator, Forecasts, Anomalies, Explorer, Environmental)
├── backend/                               # Python + Flask REST API
│   ├── app.py                             # Flask application entry point & blueprint registration
│   ├── config.py                          # Unified environment configuration & MySQL URL generation
│   ├── routes/                            # Modular REST endpoints (/api/v1 and /api aliases)
│   ├── services/                          # Business logic, inference, tariff engine, data loaders
│   ├── utils/                             # Schema validator, CSV dynamic loader, error handlers
│   └── database/                          # MySQL persistence via SQLAlchemy & PyMySQL (schema.sql, init_db.py)
├── ml/                                    # Machine learning training, pipelines, datasets & artifacts
│   ├── artifacts/                         # Serialized models (.joblib) & benchmark metrics (.json)
│   ├── data/                              # Official tariffs, synthetic Mumbai profiles, benchmark datasets
│   └── train_all.py                       # Master reproducible model training script
├── tests/                                 # Automated test suite (49 unit, database & integration tests)
└── docs/                                  # Setup & API documentation (local_mysql_setup.md)
```

---

## 🗄️ Local MySQL Database & MySQL Workbench Setup

UrjaDrishti AI is configured for a 100% locally hosted MySQL database running on your laptop.

1. **Start MySQL Server:** Start MySQL from macOS **System Settings** > **MySQL**, or via terminal:
   ```bash
   sudo /usr/local/mysql/support-files/mysql.server start
   ```
2. **Import Schema via MySQL Workbench:**
   - Open MySQL Workbench and connect to your local MySQL Server (`127.0.0.1:3306`).
   - Open and execute `backend/database/schema.sql` (creates `urjadrishti_ai` and all required tables).
3. **Configure Credentials:** Set your credentials in `backend/.env`:
   ```dotenv
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=urjadrishti_ai
   DB_USER=root
   DB_PASSWORD=your_password
   ```
4. **Initialize Tables:** Run the safe initialization tool:
   ```bash
   cd backend && python -m database.init_db
   ```
5. **Full Guide:** See [docs/local_mysql_setup.md](docs/local_mysql_setup.md) for full instructions, macOS commands, and visual query verification.

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
python app.py
```
The backend starts at `http://127.0.0.1:5001`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The React + Vite platform runs at `http://localhost:3000`.

### 3. Machine Learning Training
To retrain regression models (Random Forest, Decision Tree, Linear Regression) and anomaly detectors (Isolation Forest, K-Means):
```bash
cd ml
python train_all.py
```
Artifacts and benchmarks are saved directly to `ml/artifacts/`.

---

## 🧪 Running Automated Tests
Run the comprehensive test suite with:
```bash
pytest tests/ -v
```
All 49 unit, integration, and database tests validate MySQL URL generation, schema safety, transaction rollbacks, CSV loading, dynamic schema normalization, dashboard aggregations, model inference, horizon rollouts, anomaly detection, tariff slab boundaries, and environmental calculations.

---

## 🔄 Refreshing Datasets (When Claude Generates or Updates CSVs)
UrjaDrishti-AI includes dynamic schema discovery and an in-memory hot-reload cache:
1. **Via UI**: In the **Dataset Explorer** tab, click `🔄 Rescan & Refresh Datasets`.
2. **Via API**: Run:
```bash
curl -X POST http://127.0.0.1:5001/api/v1/datasets/refresh
```
New or modified files placed into `ml/data/` (such as the 36-household 631k smart-meter readings) are immediately detected without restarting the Flask server.
