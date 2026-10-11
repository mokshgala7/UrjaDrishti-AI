import unittest
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from services.prediction_service import predict_load, generate_horizon_forecast, get_prediction_history
from utils.error_handlers import AppError

class TestPredictions(unittest.TestCase):
    def test_random_forest_prediction_range(self):
        res = predict_load({
            "temperature": 32.0,
            "humidity": 75.0,
            "hour": 20,
            "day_of_week": 2,
            "model_id": "random_forest"
        })
        self.assertIn("predicted_load_kw", res)
        self.assertGreater(res["predicted_load_kw"], 0.2)
        self.assertLess(res["predicted_load_kw"], 10.0)
        self.assertIn("confidence_interval", res)
        self.assertEqual(len(res["confidence_interval"]), 2)
        self.assertLess(res["confidence_interval"][0], res["confidence_interval"][1])

    def test_decision_tree_prediction(self):
        res = predict_load({
            "temperature": 28.0,
            "humidity": 60.0,
            "hour": 14,
            "day_of_week": 0,
            "model_id": "decision_tree"
        })
        self.assertGreater(res["predicted_load_kw"], 0.1)

    def test_linear_regression_prediction(self):
        res = predict_load({
            "temperature": 25.0,
            "humidity": 65.0,
            "hour": 10,
            "day_of_week": 1,
            "model_id": "linear_regression"
        })
        self.assertGreater(res["predicted_load_kw"], 0.1)

    def test_chronos_unavailable_handling(self):
        # Chronos should report clear unavailability error
        with self.assertRaises(AppError) as ctx:
            predict_load({"temperature": 30.0, "hour": 12, "model_id": "chronos_forecaster"})
        self.assertEqual(ctx.exception.error_code, "MODEL_UNAVAILABLE")

    def test_invalid_hour_validation(self):
        with self.assertRaises(AppError) as ctx:
            predict_load({"temperature": 30.0, "hour": 25})
        self.assertEqual(ctx.exception.error_code, "INVALID_HOUR")

    def test_horizon_forecast(self):
        res = generate_horizon_forecast(horizon_hours=24, model_id="random_forest")
        self.assertEqual(res["horizon_hours"], 24)
        self.assertEqual(len(res["forecast"]), 24)
        for point in res["forecast"]:
            self.assertIn("timestamp", point)
            self.assertIn("predicted_kwh", point)
            self.assertGreater(point["predicted_kwh"], 0)

    def test_prediction_history(self):
        # Trigger prediction then check history
        predict_load({"temperature": 30.0, "hour": 15, "model_id": "random_forest"})
        history = get_prediction_history(limit=5)
        self.assertIsInstance(history, list)
        self.assertGreaterEqual(len(history), 1)

if __name__ == '__main__':
    unittest.main()
