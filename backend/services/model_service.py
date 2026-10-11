import os
import json
from pathlib import Path
from config import Config
from utils.error_handlers import AppError

def _check_chronos_available():
    try:
        import torch
        import chronos
        return True
    except ImportError:
        return False

def get_model_registry():
    artifacts_dir = Config.ARTIFACTS_DIR
    regression_dir = artifacts_dir / "regression"
    clustering_dir = artifacts_dir / "clustering"
    
    rf_path = regression_dir / "random_forest.joblib"
    dt_path = regression_dir / "decision_tree.joblib"
    lr_path = regression_dir / "linear_regression.joblib"
    iso_path = clustering_dir / "isolation_forest.joblib"
    km_path = clustering_dir / "kmeans_clusters.joblib"
    
    chronos_avail = _check_chronos_available()
    
    models = [
        {
            "id": "random_forest",
            "name": "Random Forest Regressor",
            "algorithm": "Ensemble Random Forest (100 estimators)",
            "task": "electricity_consumption_prediction",
            "status": "available" if rf_path.exists() else "unavailable",
            "artifact_reference": "artifacts/regression/random_forest.joblib",
            "input_schema": ["temperature", "humidity", "hour", "day_of_week", "is_weekend", "hour_sin", "hour_cos", "is_monsoon"],
            "constraints": {"min_temp_c": 10.0, "max_temp_c": 50.0},
            "limitations": "Trained on Mumbai residential diurnal patterns. Performance may vary under severe grid anomalies."
        },
        {
            "id": "decision_tree",
            "name": "Decision Tree Regressor",
            "algorithm": "CART Decision Tree (max_depth=10)",
            "task": "electricity_consumption_prediction",
            "status": "available" if dt_path.exists() else "unavailable",
            "artifact_reference": "artifacts/regression/decision_tree.joblib",
            "input_schema": ["temperature", "humidity", "hour", "day_of_week", "is_weekend", "hour_sin", "hour_cos", "is_monsoon"],
            "constraints": {"min_temp_c": 10.0, "max_temp_c": 50.0},
            "limitations": "Faster inference, but higher variance than ensemble models."
        },
        {
            "id": "linear_regression",
            "name": "Linear Regression Baseline",
            "algorithm": "Ordinary Least Squares",
            "task": "electricity_consumption_prediction",
            "status": "available" if lr_path.exists() else "unavailable",
            "artifact_reference": "artifacts/regression/linear_regression.joblib",
            "input_schema": ["temperature", "humidity", "hour", "day_of_week", "is_weekend", "hour_sin", "hour_cos", "is_monsoon"],
            "constraints": {"min_temp_c": 10.0, "max_temp_c": 50.0},
            "limitations": "Linear relationship assumption; cannot capture complex nonlinear diurnal interactions."
        },
        {
            "id": "chronos_forecaster",
            "name": "Amazon Chronos Forecaster",
            "algorithm": "T5 Foundation Model for Time-Series (chronos-t5-small)",
            "task": "probabilistic_time_series_forecasting",
            "status": "available" if chronos_avail else "unavailable",
            "status_reason": "Chronos/PyTorch not installed in environment" if not chronos_avail else "Ready",
            "artifact_reference": "huggingface:amazon/chronos-t5-small",
            "input_schema": ["context_series_kwh"],
            "constraints": {"min_context_length": 24, "max_horizon_hours": 72},
            "limitations": "Deep foundation model requiring substantial compute/memory. Fallback to Random Forest Regressor recommended."
        },
        {
            "id": "isolation_forest",
            "name": "Isolation Forest Anomaly Detector",
            "algorithm": "Isolation Forest (contamination=0.03)",
            "task": "unsupervised_anomaly_detection",
            "status": "available" if iso_path.exists() else "unavailable",
            "artifact_reference": "artifacts/clustering/isolation_forest.joblib",
            "input_schema": ["temperature", "humidity", "hour", "day_of_week", "actual_kwh"],
            "constraints": {},
            "limitations": "Detects statistical outliers. Ground-truth issues should be verified against utility logs."
        },
        {
            "id": "kmeans_clusters",
            "name": "K-Means Consumption Profiler",
            "algorithm": "K-Means Clustering (k=4)",
            "task": "consumption_pattern_segmentation",
            "status": "available" if km_path.exists() else "unavailable",
            "artifact_reference": "artifacts/clustering/kmeans_clusters.joblib",
            "input_schema": ["temperature", "humidity", "hour", "day_of_week"],
            "constraints": {},
            "limitations": "Identifies 4 diurnal load clusters (Base, Morning Peak, Afternoon Medium, Evening High)."
        }
    ]
    return models

def get_model_by_id(model_id: str):
    models = get_model_registry()
    for m in models:
        if m["id"] == model_id:
            return m
    raise AppError(f"Model '{model_id}' not found in registry.", error_code="MODEL_NOT_FOUND", status_code=404)

def get_model_benchmarks():
    eval_file = Config.ARTIFACTS_DIR / "evaluation_results" / "comparison.json"
    if eval_file.exists():
        try:
            with open(eval_file, "r") as f:
                return json.load(f)
        except Exception:
            pass
            
    # Fallback to model registry summary if comparison.json not yet written
    registry_models = get_model_registry()
    return {
        "evaluation_dataset": "Holdout Test Split (Chronological 20%)",
        "evaluation_period": "Historical Holdout",
        "models": [
            {
                "id": m["id"],
                "name": m["name"],
                "algorithm": m["algorithm"],
                "status": m["status"],
                "metrics": None
            }
            for m in registry_models if m["task"] == "electricity_consumption_prediction"
        ]
    }
