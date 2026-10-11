from services.prediction_service import generate_horizon_forecast

def generate_forecast(horizon_hours=24, model_id="random_forest"):
    """
    Generates multi-step time series forecast for future power consumption.
    """
    res = generate_horizon_forecast(horizon_hours=horizon_hours, model_id=model_id)
    return res["forecast"]
