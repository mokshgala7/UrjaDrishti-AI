class ChronosForecasterWrapper:
    """Wrapper interface for Amazon Chronos pre-trained time-series forecaster."""
    def __init__(self, model_name="amazon/chronos-t5-small"):
        self.model_name = model_name
        
    def forecast(self, context_series, prediction_length=24):
        # Stub wrapper for Chronos inference
        return [float(x) for x in context_series[-1:] * prediction_length]
