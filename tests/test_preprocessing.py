import unittest
import pandas as pd
import numpy as np
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from utils.schema_validator import normalize_dataframe_columns, assess_data_quality
from ml.preprocessing.feature_engineering import engineer_features

class TestPreprocessing(unittest.TestCase):
    def test_feature_engineering_cyclical_hours(self):
        df = pd.DataFrame({
            "datetime": ["2025-01-01 00:00:00", "2025-01-01 06:00:00", "2025-01-01 12:00:00"]
        })
        res = engineer_features(df)
        self.assertIn("hour", res.columns)
        self.assertIn("hour_sin", res.columns)
        self.assertIn("hour_cos", res.columns)
        self.assertIn("day_of_week", res.columns)
        self.assertIn("is_weekend", res.columns)
        
        # At hour 0, sin(0) = 0, cos(0) = 1
        self.assertAlmostEqual(res["hour_sin"].iloc[0], 0.0, places=4)
        self.assertAlmostEqual(res["hour_cos"].iloc[0], 1.0, places=4)

    def test_schema_normalization(self):
        df = pd.DataFrame({
            "datetime": ["2025-01-01 10:00:00"],
            "global_active_power_kw": [1.45],
            "T_out": [32.0]
        })
        normalized = normalize_dataframe_columns(df)
        self.assertIn("timestamp", normalized.columns)
        self.assertIn("consumption_kwh", normalized.columns)
        self.assertIn("temperature", normalized.columns)

    def test_data_quality_assessment(self):
        df = pd.DataFrame({
            "timestamp": ["2025-01-01 00:00:00", "2025-01-01 01:00:00"],
            "val": [1.0, 2.0]
        })
        quality = assess_data_quality(df, "test_dataset")
        self.assertEqual(quality["total_rows"], 2)
        self.assertEqual(quality["duplicate_rows"], 0)
        self.assertEqual(quality["status"], "HEALTHY")

if __name__ == '__main__':
    unittest.main()
