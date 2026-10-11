# UrjaDrishti-AI ⚡
> Intelligent Household Electricity Consumption Forecasting, Anomaly Detection & Mumbai Tariff Bill Simulation

## 📌 Overview
UrjaDrishti-AI is a specialized energy analytics and machine learning platform tailored for Mumbai residential consumers across **Adani Electricity (AEML-D)** and **BEST Undertaking** supply areas.

---

## 🏗️ Project Architecture
```text
UrjaDrishti-AI/
├── frontend/                              # React + Vite UI (Dashboard, Prediction, Model Lab, Anomalies, Bill Simulator, Dataset Explorer, Environmental)
├── backend/                               # Python + Flask REST API
│   ├── app.py                             # Flask application entry point & blueprint registration
│   ├── config.py                          # Unified environment configuration & paths
│   ├── routes/                            # Modular REST endpoints (/api/v1 and /api aliases)
│   ├── services/                          # Business logic, inference, tariff engine, data loaders
│   ├── utils/                             # Schema validator, CSV dynamic loader, error handlers
│   └── database/                          # SQLite / MySQL persistence (consumption, predictions, billing history)
├── ml/                                    # Machine learning training, pipelines, datasets & artifacts
│   ├── artifacts/                         # Serialized models (.joblib) & benchmark metrics (.json)
│   ├── data/                              # Official tariffs, synthetic Mumbai profiles, benchmark datasets
│   └── train_all.py                       # Master reproducible model training script
├── tests/                                 # Automated test suite (39 unit & integration tests)
└── docs/                                  # API documentation & project specifications
```

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
The backend starts at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The React + Vite platform runs at `http://localhost:5173`.

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
All 39 unit and integration tests validate startup, CSV loading, dynamic schema normalization, dashboard aggregations, model inference, horizon rollouts, anomaly detection, tariff slab boundaries, and environmental calculations.

---

## 🔄 Refreshing Datasets (When Claude Generates or Updates CSVs)
UrjaDrishti-AI includes dynamic schema discovery and an in-memory hot-reload cache:
1. **Via UI**: In the **Dataset Explorer** tab, click `🔄 Rescan & Refresh Datasets`.
2. **Via API**: Run:
```bash
curl -X POST http://localhost:5000/api/v1/datasets/refresh
```
New or modified files placed into `ml/data/` (such as the 36-household 631k smart-meter readings) are immediately detected without restarting the Flask server.
