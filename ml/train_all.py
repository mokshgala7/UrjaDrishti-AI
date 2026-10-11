"""
Master training pipeline for UrjaDrishti-AI ML models
Trains Supervised Regression models and Unsupervised Anomaly Detection models,
saves trained artifacts to ml/artifacts/, and writes real evaluation benchmarks.
"""

import os
import json
from pathlib import Path
import numpy as np
import pandas as pd
import joblib

from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.cluster import KMeans
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

BASE_DIR = Path(__file__).resolve().parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"
REGRESSION_DIR = ARTIFACTS_DIR / "regression"
CLUSTERING_DIR = ARTIFACTS_DIR / "clustering"
EVAL_DIR = ARTIFACTS_DIR / "evaluation_results"
DATA_FILE = BASE_DIR / "data" / "synthetic" / "mumbai_household_data.csv"

def generate_training_data(num_days=365):
    """Generates synthetic hourly observations calibrated for Mumbai weather and residential diurnal cycle."""
    np.random.seed(42)
    start = pd.Timestamp("2024-01-01 00:00:00")
    dates = [start + pd.Timedelta(hours=i) for i in range(num_days * 24)]
    
    records = []
    for dt in dates:
        # Mumbai diurnal temperature curve
        temp = 26 + 8 * np.sin(np.pi * (dt.hour - 6) / 12) + np.random.normal(0, 1.2)
        humidity = 65 + 20 * np.cos(np.pi * (dt.hour - 6) / 12) + np.random.normal(0, 2.5)
        
        # Base household load
        base_load = 0.85 + 0.04 * (temp - 24)
        if 19 <= dt.hour <= 23:
            base_load += 1.4  # Evening Mumbai peak
        if dt.weekday() >= 5:
            base_load *= 1.15 # Weekend uplift
            
        load = max(0.2, base_load + np.random.normal(0, 0.15))
        
        records.append({
            "datetime": dt.strftime('%Y-%m-%d %H:%M:%S'),
            "temperature": round(float(temp), 2),
            "humidity": round(float(humidity), 2),
            "global_active_power_kw": round(float(load), 3),
            "day_of_week": int(dt.weekday()),
            "hour": int(dt.hour),
            "is_weekend": int(dt.weekday() >= 5)
        })
    df = pd.DataFrame(records)
    return df

def prepare_features(df):
    df_feat = df.copy()
    if 'hour_sin' not in df_feat.columns:
        df_feat['hour_sin'] = np.sin(2 * np.pi * df_feat['hour'] / 24.0)
        df_feat['hour_cos'] = np.cos(2 * np.pi * df_feat['hour'] / 24.0)
    if 'is_monsoon' not in df_feat.columns:
        if 'datetime' in df_feat.columns:
            months = pd.to_datetime(df_feat['datetime']).dt.month
            df_feat['is_monsoon'] = months.isin([6, 7, 8, 9]).astype(int)
        else:
            df_feat['is_monsoon'] = 0
            
    feature_cols = ['temperature', 'humidity', 'hour', 'day_of_week', 'is_weekend', 'hour_sin', 'hour_cos', 'is_monsoon']
    return df_feat[feature_cols], df_feat['global_active_power_kw']

def main():
    print("Initiating UrjaDrishti-AI model training...")
    REGRESSION_DIR.mkdir(parents=True, exist_ok=True)
    CLUSTERING_DIR.mkdir(parents=True, exist_ok=True)
    EVAL_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Load or generate training dataset
    if DATA_FILE.exists() and len(pd.read_csv(DATA_FILE)) > 50:
        print(f"Loading existing data from {DATA_FILE}...")
        df = pd.read_csv(DATA_FILE)
    else:
        print("Generating Mumbai 365-day calibrated synthetic dataset for model training...")
        df = generate_training_data(num_days=365)
        df.to_csv(DATA_FILE, index=False)
        print(f"Saved {len(df)} records to {DATA_FILE}")

    X, y = prepare_features(df)
    
    # Chronological train-test split (80% train, 20% test) to respect time series
    split_idx = int(len(X) * 0.8)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
    print(f"Training set: {len(X_train)} samples | Test set: {len(X_test)} samples")

    # 2. Train Regression Models
    print("Training Linear Regression...")
    lr = LinearRegression()
    lr.fit(X_train, y_train)
    joblib.dump(lr, REGRESSION_DIR / "linear_regression.joblib")
    y_pred_lr = lr.predict(X_test)

    print("Training Decision Tree Regressor...")
    dt = DecisionTreeRegressor(max_depth=10, random_state=42)
    dt.fit(X_train, y_train)
    joblib.dump(dt, REGRESSION_DIR / "decision_tree.joblib")
    y_pred_dt = dt.predict(X_test)

    print("Training Random Forest Regressor...")
    rf = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)
    joblib.dump(rf, REGRESSION_DIR / "random_forest.joblib")
    y_pred_rf = rf.predict(X_test)

    # 3. Train Anomaly Detection Models
    print("Training Isolation Forest...")
    iso = IsolationForest(contamination=0.03, random_state=42)
    iso.fit(X[['temperature', 'humidity', 'hour', 'day_of_week']])
    joblib.dump(iso, CLUSTERING_DIR / "isolation_forest.joblib")

    print("Training K-Means Cluster Detector...")
    kmeans = KMeans(n_clusters=4, random_state=42)
    kmeans.fit(X[['temperature', 'humidity', 'hour', 'day_of_week']])
    joblib.dump(kmeans, CLUSTERING_DIR / "kmeans_clusters.joblib")

    # 4. Evaluate Models & Record Metrics
    def compute_reg_metrics(y_true, y_pred):
        return {
            "mae": round(float(mean_absolute_error(y_true, y_pred)), 4),
            "rmse": round(float(np.sqrt(mean_squared_error(y_true, y_pred))), 4),
            "r2": round(float(r2_score(y_true, y_pred)), 4)
        }

    comparison_results = {
        "evaluation_dataset": "Mumbai Household Hourly Synthetic Load (Holdout Test Split 20%)",
        "evaluation_period": "Temporal chronological split",
        "models": [
            {
                "id": "random_forest",
                "name": "Random Forest Regressor",
                "algorithm": "Ensemble Bagging Trees",
                "status": "available",
                "metrics": compute_reg_metrics(y_test, y_pred_rf)
            },
            {
                "id": "decision_tree",
                "name": "Decision Tree Regressor",
                "algorithm": "CART Decision Tree",
                "status": "available",
                "metrics": compute_reg_metrics(y_test, y_pred_dt)
            },
            {
                "id": "linear_regression",
                "name": "Linear Regression",
                "algorithm": "Ordinary Least Squares",
                "status": "available",
                "metrics": compute_reg_metrics(y_test, y_pred_lr)
            },
            {
                "id": "chronos_forecaster",
                "name": "Chronos Forecaster",
                "algorithm": "Pre-trained Chronos T5 Transformer",
                "status": "unavailable",
                "status_reason": "PyTorch / Hugging Face chronos runtime not installed in environment.",
                "metrics": None
            }
        ]
    }

    comp_file = EVAL_DIR / "comparison.json"
    with open(comp_file, "w") as f:
        json.dump(comparison_results, f, indent=2)
    print(f"Model evaluation benchmarks saved to {comp_file}")
    print("Training pipeline finished successfully.")

if __name__ == '__main__':
    main()
