import os
import json
import logging
from pathlib import Path
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
import joblib

from config import Config
from utils.error_handlers import AppError
from database.connection import get_db_session
from database.models import PredictionHistory

logger = logging.getLogger(__name__)

# Model cache to avoid reloading from disk on every API call
_LOADED_MODELS = {}

def _get_model(model_id: str):
    global _LOADED_MODELS
    model_id = model_id.lower().replace("-", "_").replace(" ", "_")
    
    # Handle Chronos explicitly
    if "chronos" in model_id:
        raise AppError(
            "Chronos-2 Forecaster is currently unavailable: PyTorch / Hugging Face runtime not installed. Use 'random_forest' or 'linear_regression'.",
            error_code="MODEL_UNAVAILABLE",
            status_code=503
        )
        
    valid_models = {
        "random_forest": Config.ARTIFACTS_DIR / "regression" / "random_forest.joblib",
        "randomforestregressor": Config.ARTIFACTS_DIR / "regression" / "random_forest.joblib",
        "decision_tree": Config.ARTIFACTS_DIR / "regression" / "decision_tree.joblib",
        "decisiontreeregressor": Config.ARTIFACTS_DIR / "regression" / "decision_tree.joblib",
        "linear_regression": Config.ARTIFACTS_DIR / "regression" / "linear_regression.joblib",
        "linearregression": Config.ARTIFACTS_DIR / "regression" / "linear_regression.joblib"
    }

    if model_id not in valid_models:
        model_id = "random_forest"

    if model_id in _LOADED_MODELS:
        return _LOADED_MODELS[model_id], model_id

    artifact_path = valid_models[model_id]
    if not artifact_path.exists():
        raise AppError(
            f"Model artifact not found at {artifact_path}. Please execute 'python ml/train_all.py' first.",
            error_code="MODEL_ARTIFACT_MISSING",
            status_code=503
        )

    model = joblib.load(artifact_path)
    _LOADED_MODELS[model_id] = model
    return model, model_id

def _build_features(temperature: float, humidity: float, hour: int, day_of_week: int, month: int = None):
    if month is None:
        month = datetime.now().month
        
    is_weekend = int(day_of_week >= 5)
    hour_sin = float(np.sin(2 * np.pi * hour / 24.0))
    hour_cos = float(np.cos(2 * np.pi * hour / 24.0))
    is_monsoon = int(month in [6, 7, 8, 9])
    
    cols = ['temperature', 'humidity', 'hour', 'day_of_week', 'is_weekend', 'hour_sin', 'hour_cos', 'is_monsoon']
    features = pd.DataFrame([[temperature, humidity, hour, day_of_week, is_weekend, hour_sin, hour_cos, is_monsoon]], columns=cols)
    return features


def predict_load(input_data: dict) -> dict:
    # Validation
    try:
        temp = float(input_data.get('temperature', 30.0))
        humidity = float(input_data.get('humidity', 70.0))
        hour = int(input_data.get('hour', datetime.now().hour))
        day_of_week = int(input_data.get('day_of_week', datetime.now().weekday()))
    except (ValueError, TypeError) as e:
        raise AppError(f"Invalid input parameter format: {str(e)}", error_code="INVALID_INPUT", status_code=400)

    if not (0 <= hour <= 23):
        raise AppError("Hour must be an integer between 0 and 23.", error_code="INVALID_HOUR", status_code=400)
    if not (0 <= day_of_week <= 6):
        raise AppError("Day of week must be an integer between 0 and 6.", error_code="INVALID_DAY_OF_WEEK", status_code=400)
    if not (-10 <= temp <= 60):
        raise AppError("Temperature must be between -10°C and 60°C.", error_code="INVALID_TEMPERATURE", status_code=400)

    requested_model = input_data.get('model', input_data.get('model_id', 'random_forest'))
    model, canonical_model_id = _get_model(requested_model)

    features = _build_features(temp, humidity, hour, day_of_week)
    pred_val = float(model.predict(features)[0])
    pred_val = max(0.1, round(pred_val, 3))

    # Calculate uncertainty interval (10% standard error bounds)
    lower_bound = max(0.05, round(pred_val * 0.90, 3))
    upper_bound = round(pred_val * 1.10, 3)

    result = {
        "predicted_load_kw": pred_val,
        "confidence_interval": [lower_bound, upper_bound],
        "model_used": canonical_model_id,
        "features_evaluated": {
            "temperature": temp,
            "humidity": humidity,
            "hour": hour,
            "day_of_week": day_of_week
        },
        "unit": "kW",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    # Persist prediction in DB
    try:
        with get_db_session() as session:
            created_dt = datetime.strptime(result["created_at"], "%Y-%m-%d %H:%M:%S")
            pred_record = PredictionHistory(
                created_at=created_dt,
                model_id=canonical_model_id,
                horizon_hours=1,
                predicted_load_kw=pred_val,
                confidence_lower=lower_bound,
                confidence_upper=upper_bound,
                input_features=json.dumps(result["features_evaluated"])
            )
            session.add(pred_record)
    except Exception as e:
        logger.warning("Failed to persist prediction to database: %s", str(e))

    return result

def generate_horizon_forecast(horizon_hours: int = 24, model_id: str = "random_forest", start_datetime: str = None) -> dict:
    if horizon_hours < 1 or horizon_hours > 168:
        raise AppError("Forecast horizon must be between 1 and 168 hours (7 days).", error_code="INVALID_HORIZON", status_code=400)

    model, canonical_model_id = _get_model(model_id)

    start_dt = pd.to_datetime(start_datetime) if start_datetime else datetime.now()
    records = []

    for h in range(horizon_hours):
        current_dt = start_dt + timedelta(hours=h)
        hour = current_dt.hour
        dow = current_dt.weekday()
        # Simulated Mumbai diurnal temperature for future horizon
        temp = 26.0 + 7.5 * np.sin(np.pi * (hour - 6) / 12)
        humidity = 68.0 + 15.0 * np.cos(np.pi * (hour - 6) / 12)

        feat = _build_features(temp, humidity, hour, dow, current_dt.month)
        val = float(model.predict(feat)[0])
        val = max(0.1, round(val, 3))

        records.append({
            "timestamp": current_dt.strftime("%Y-%m-%d %H:%M:%S"),
            "hour": hour,
            "predicted_kwh": val,
            "confidence_lower": max(0.05, round(val * 0.88, 3)),
            "confidence_upper": round(val * 1.12, 3),
            "expected_temp_c": round(temp, 1)
        })

    return {
        "model_id": canonical_model_id,
        "horizon_hours": horizon_hours,
        "forecast": records,
        "unit": "kWh",
        "method": "Multi-step regression rollout with Mumbai diurnal weather expectations"
    }

def get_prediction_history(limit: int = 50) -> list:
    try:
        with get_db_session() as session:
            rows = session.query(PredictionHistory).order_by(PredictionHistory.id.desc()).limit(limit).all()
            results = []
            for r in rows:
                results.append({
                    "id": r.id,
                    "created_at": r.created_at.strftime("%Y-%m-%d %H:%M:%S") if hasattr(r.created_at, "strftime") else str(r.created_at),
                    "model_id": r.model_id,
                    "horizon_hours": r.horizon_hours,
                    "predicted_load_kw": float(r.predicted_load_kw) if r.predicted_load_kw is not None else 0.0,
                    "confidence_lower": float(r.confidence_lower) if r.confidence_lower is not None else None,
                    "confidence_upper": float(r.confidence_upper) if r.confidence_upper is not None else None,
                    "features": json.loads(r.input_features) if r.input_features else {}
                })
            return results
    except Exception as e:
        logger.warning("Could not read prediction history from DB: %s", str(e))
        return []
