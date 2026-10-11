import sys
import platform
from datetime import datetime
from flask import Blueprint, jsonify
from config import Config
from utils.csv_loader import registry
from services.model_service import get_model_registry
from database.connection import get_db_connection

health_bp = Blueprint('health', __name__)

def _check_db_status():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        conn.close()
        return "connected"
    except Exception:
        return "degraded_sqlite_fallback"

@health_bp.route('/health', methods=['GET'])
def health():
    discovered = registry.discover_datasets()
    models = get_model_registry()
    available_models = [m["name"] for m in models if m["status"] == "available"]
    
    return jsonify({
        "status": "healthy",
        "service": Config.APP_NAME,
        "version": Config.VERSION,
        "dataset_readiness": {
            "datasets_count": len(discovered),
            "status": "READY" if len(discovered) > 0 else "DEGRADED"
        },
        "model_readiness": {
            "models_available": available_models,
            "total_models": len(models),
            "status": "READY" if len(available_models) > 0 else "DEGRADED"
        },
        "database_status": _check_db_status(),
        "optional_dependencies": {
            "chronos_transformer": "UNAVAILABLE (PyTorch runtime not installed; tree-ensemble fallback active)"
        },
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }), 200

@health_bp.route('/status', methods=['GET'])
def operational_status():
    discovered = registry.discover_datasets()
    models = get_model_registry()
    
    datasets_detail = {d_id: meta["name"] for d_id, meta in discovered.items()}
    models_detail = {m["id"]: {"name": m["name"], "status": m["status"]} for m in models}

    return jsonify({
        "service": Config.APP_NAME,
        "environment": "development" if Config.DEBUG else "production",
        "python_version": sys.version.split()[0],
        "platform": platform.platform(),
        "database_status": _check_db_status(),
        "datasets": {
            "total": len(discovered),
            "registered": datasets_detail
        },
        "models": {
            "total": len(models),
            "status": models_detail
        },
        "features_status": {
            "dashboard_analytics": "OPERATIONAL",
            "consumption_forecasting": "OPERATIONAL",
            "anomaly_detection": "OPERATIONAL",
            "bill_simulator": "OPERATIONAL_FY_2022_23",
            "tariff_comparison": "OPERATIONAL",
            "dataset_explorer": "OPERATIONAL",
            "environmental_analysis": "OPERATIONAL",
            "chronos_deep_forecaster": "DEGRADED_DEPENDENCY_MISSING"
        },
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }), 200
