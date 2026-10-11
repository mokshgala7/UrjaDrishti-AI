# UrjaDrishti-AI REST API Specification (v1.0.0)

## Overview
UrjaDrishti-AI is a Mumbai-tailored electricity analytics, machine learning, and tariff simulation API.
The API surface is organized under `/api/v1` with legacy backward-compatible aliases under `/api`.

---

## 1. Health & Operational Status

### `GET /api/v1/health` (Legacy: `GET /api/health`)
Returns general service health, model readiness, dataset readiness, and database connection.

**Response:**
```json
{
  "database_status": "connected",
  "dataset_readiness": {
    "datasets_count": 6,
    "status": "READY"
  },
  "model_readiness": {
    "models_available": [
      "Random Forest Regressor",
      "Decision Tree Regressor",
      "Linear Regression Baseline",
      "Isolation Forest Anomaly Detector",
      "K-Means Consumption Profiler"
    ],
    "status": "READY",
    "total_models": 6
  },
  "optional_dependencies": {
    "chronos_transformer": "UNAVAILABLE (PyTorch runtime not installed; tree-ensemble fallback active)"
  },
  "service": "UrjaDrishti-AI",
  "status": "healthy",
  "version": "1.0.0"
}
```

### `GET /api/v1/status`
Detailed operational status, feature degradation matrix, platform, and registered dataset IDs.

---

## 2. Dashboard Analytics

### `GET /api/v1/dashboard/summary`
Returns aggregate values required by operations KPI cards.

### `GET /api/v1/dashboard/consumption`
Returns ordered time-series load readings.
- **Query Parameters**:
  - `household`: Filter by household ID (e.g. `HH_01`)
  - `start_date`: e.g. `2025-01-01`
  - `end_date`: e.g. `2025-01-07`
  - `interval`: `hourly` (default), `daily`, `weekly`, `monthly`

### `GET /api/v1/dashboard/consumption-patterns`
Returns 24-hour diurnal profile and weekly load distribution averages for Mumbai.

### `GET /api/v1/dashboard/households`
Returns list of discovered households and metering classifications.

---

## 3. Electricity Consumption Prediction

### `POST /api/v1/predictions/predict` (Legacy: `POST /api/predict`)
Runs supervised model inference for a single time step.

**Request Body:**
```json
{
  "temperature": 32.5,
  "humidity": 75.0,
  "hour": 20,
  "day_of_week": 2,
  "model_id": "random_forest"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "confidence_interval": [2.399, 2.933],
    "features_evaluated": {
      "day_of_week": 2,
      "hour": 20,
      "humidity": 75.0,
      "temperature": 32.5
    },
    "model_used": "random_forest",
    "predicted_load_kw": 2.666,
    "unit": "kW"
  }
}
```

### `GET /api/v1/predictions/forecast`
Generates multi-step time-series horizon rollout.
- **Query Parameters**:
  - `horizon_hours`: `12`, `24`, `48`, or `72`
  - `model_id`: `random_forest`, `decision_tree`, `linear_regression`

### `GET /api/v1/predictions/history`
Returns SQLite/MySQL persisted inference log.

---

## 4. Model Lab & Benchmarking

### `GET /api/v1/models`
List of registered models, tasks, input schemas, constraints, and limitations.

### `GET /api/v1/models/compare` (Legacy: `GET /api/models/comparison`)
Returns chronological holdout test set evaluation benchmarks (MAE, RMSE, R²).

---

## 5. Anomaly Monitor

### `GET /api/v1/anomalies` (Legacy: `GET /api/anomalies/recent`)
Returns list of detected anomaly incidents.
- **Query Parameters**:
  - `severity`: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`
  - `limit`: Default `50`
  - `household`: Optional household filter

### `GET /api/v1/anomalies/summary`
Severity breakdown and 24-hour diurnal anomaly distribution.

### `POST /api/v1/anomalies/detect`
Executes Isolation Forest detection on batch uploaded records.

---

## 6. Electricity Bill Simulator & Tariffs

### `POST /api/v1/billing/calculate` (Legacy: `POST /api/billing/simulate`)
Computes tiered residential bill for Adani Electricity or BEST Undertaking.

**Request Body:**
```json
{
  "provider": "Adani Electricity",
  "units": 250,
  "financial_year": "FY 2022-23"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "calculation_status": "incomplete_estimate_missing_fac",
    "electricity_duty": 333.2,
    "energy_charges": 1530.0,
    "excluded_components": [
      "Fuel Adjustment Charge (FAC / PPCA) - Monthly variable rates not extracted in current dataset",
      "Regulatory Asset Charge (RAC)"
    ],
    "financial_year": "FY 2022-23",
    "fixed_charges": 140.0,
    "provider": "Adani Electricity Mumbai Limited (AEML-D)",
    "slab_breakdown": [
      { "amount_rs": 450.0, "rate_per_kwh": 4.5, "slab_name": "0-100 kWh", "units_in_slab": 100.0 },
      { "amount_rs": 1080.0, "rate_per_kwh": 7.2, "slab_name": "101-300 kWh", "units_in_slab": 150.0 },
      { "amount_rs": 0.0, "rate_per_kwh": 9.1, "slab_name": "301-500 kWh", "units_in_slab": 0.0 },
      { "amount_rs": 0.0, "rate_per_kwh": 11.5, "slab_name": ">500 kWh", "units_in_slab": 0.0 }
    ],
    "subtotal": 2082.5,
    "total_bill": 2415.7,
    "units": 250.0,
    "wheeling_charges": 412.5
  }
}
```

### `GET /api/v1/tariffs`
Returns verified official schedules and lists unverified financial years with reasons.

### `GET /api/v1/tariffs/providers`
Returns provider list and licensed distribution zones.

### `GET /api/v1/tariffs/fac`
FAC / PPCA transparency report.

---

## 7. Dataset Explorer

### `GET /api/v1/datasets` (Legacy: `GET /api/datasets/list`)
List of all discovered datasets in `ml/data/`.

### `GET /api/v1/datasets/<dataset_id>/preview?page=1&page_size=20`
Paginated preview table with column metadata.

### `GET /api/v1/datasets/<dataset_id>/statistics`
Numeric column summary statistics (count, mean, std, min, median, max, missing).

### `GET /api/v1/datasets/<dataset_id>/quality`
Data quality score, missing value percentages, duplicate counts.

### `GET /api/v1/datasets/<dataset_id>/download`
Safe file download restricted to registered datasets.

### `POST /api/v1/datasets/refresh`
Rescans filesystem and flushes in-memory DataFrame cache.

---

## 8. Environmental Intelligence

### `GET /api/v1/environmental/summary`
Calculates Scope 2 CO2 footprint using official CEA baseline factor (~0.716 kg CO2/kWh) and tree offsets.

### `POST /api/v1/environmental/calculate`
Calculates emissions for arbitrary consumption input.

### `GET /api/v1/environmental/trends?interval=daily`
Daily or monthly CO2 emissions time series.
