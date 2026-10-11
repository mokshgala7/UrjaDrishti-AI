from flask import Blueprint
from services.model_service import get_model_registry, get_model_by_id, get_model_benchmarks
from utils.response_helpers import success_response

model_bp = Blueprint('models', __name__)

@model_bp.route('/', methods=['GET'])
def list_models_route():
    models = get_model_registry()
    return success_response(models, metadata={"total_models": len(models)})

@model_bp.route('/<model_id>', methods=['GET'])
def model_details_route(model_id):
    model = get_model_by_id(model_id)
    return success_response(model)

@model_bp.route('/comparison', methods=['GET'])
@model_bp.route('/compare', methods=['GET'])
def model_comparison_route():
    benchmarks = get_model_benchmarks()
    return success_response(benchmarks)

@model_bp.route('/metrics', methods=['GET'])
def model_metrics_route():
    benchmarks = get_model_benchmarks()
    return success_response(benchmarks.get("models", []))
