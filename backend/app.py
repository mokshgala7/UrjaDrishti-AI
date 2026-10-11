from flask import Flask
from flask_cors import CORS
from config import Config
from database.models import init_db
from database.connection import register_db_teardown
from utils.error_handlers import register_error_handlers

from routes.health_routes import health_bp
from routes.dashboard_routes import dashboard_bp
from routes.prediction_routes import prediction_bp
from routes.model_routes import model_bp
from routes.anomaly_routes import anomaly_bp
from routes.billing_routes import billing_bp
from routes.tariff_routes import tariff_bp
from routes.dataset_routes import dataset_bp
from routes.environmental_routes import environmental_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.url_map.strict_slashes = False

    # Enable CORS
    CORS(app, origins=config_class.CORS_ORIGINS)

    # Centralized Error Handlers
    register_error_handlers(app)

    # Scoped database session teardown hook
    register_db_teardown(app)

    # Initialize database schema (safe checkfirst)
    init_db()

    # Register Blueprints for /api/v1 (Canonical API surface)
    app.register_blueprint(health_bp, url_prefix='/api/v1')
    app.register_blueprint(dashboard_bp, url_prefix='/api/v1/dashboard')
    app.register_blueprint(prediction_bp, url_prefix='/api/v1/predictions')
    app.register_blueprint(model_bp, url_prefix='/api/v1/models')
    app.register_blueprint(anomaly_bp, url_prefix='/api/v1/anomalies')
    app.register_blueprint(billing_bp, url_prefix='/api/v1/billing')
    app.register_blueprint(tariff_bp, url_prefix='/api/v1/tariffs')
    app.register_blueprint(dataset_bp, url_prefix='/api/v1/datasets')
    app.register_blueprint(environmental_bp, url_prefix='/api/v1/environmental')

    # Register legacy / backward-compatible aliases for existing frontend
    app.register_blueprint(health_bp, url_prefix='/api', name='legacy_health')
    app.register_blueprint(prediction_bp, url_prefix='/api/predict', name='legacy_predict')
    app.register_blueprint(model_bp, url_prefix='/api/models', name='legacy_models')
    app.register_blueprint(anomaly_bp, url_prefix='/api/anomalies', name='legacy_anomalies')
    app.register_blueprint(billing_bp, url_prefix='/api/billing', name='legacy_billing')
    app.register_blueprint(dataset_bp, url_prefix='/api/datasets', name='legacy_datasets')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard', name='legacy_dashboard')
    app.register_blueprint(tariff_bp, url_prefix='/api/tariffs', name='legacy_tariffs')
    app.register_blueprint(environmental_bp, url_prefix='/api/environmental', name='legacy_environmental')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
