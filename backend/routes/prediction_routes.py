from flask import Blueprint, request
from services.prediction_service import predict_load, generate_horizon_forecast, get_prediction_history
from utils.response_helpers import success_response

prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route('/', methods=['POST'])
@prediction_bp.route('/predict', methods=['POST'])
def predict_route():
    data = request.get_json() or {}
    result = predict_load(data)
    return success_response(result)

@prediction_bp.route('/forecast', methods=['GET', 'POST'])
def forecast_route():
    if request.method == 'POST':
        data = request.get_json() or {}
        horizon = int(data.get('horizon_hours', 24))
        model_id = data.get('model_id', 'random_forest')
    else:
        horizon = int(request.args.get('horizon_hours', 24))
        model_id = request.args.get('model_id', 'random_forest')

    result = generate_horizon_forecast(horizon_hours=horizon, model_id=model_id)
    return success_response(result)

@prediction_bp.route('/history', methods=['GET'])
def prediction_history_route():
    limit = int(request.args.get('limit', 50))
    history = get_prediction_history(limit=limit)
    return success_response(history, metadata={"count": len(history)})
