import unittest
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from services.environmental_service import (
    get_environmental_summary,
    calculate_environmental_impact,
    get_environmental_trends
)
from utils.error_handlers import AppError

class TestEnvironmentalIntelligence(unittest.TestCase):
    def test_environmental_summary(self):
        summary = get_environmental_summary()
        self.assertIn("co2_emissions_kg", summary)
        self.assertIn("trees_equivalent_annual", summary)
        self.assertEqual(summary["emission_factor_kg_per_kwh"], 0.716)

    def test_calculate_100_kwh(self):
        res = calculate_environmental_impact(100)
        # 100 kWh * 0.716 = 71.6 kg CO2
        self.assertEqual(res["co2_emissions_kg"], 71.6)
        self.assertGreater(res["trees_offset_required"], 3.0)

    def test_negative_units_raises_error(self):
        with self.assertRaises(AppError):
            calculate_environmental_impact(-50)

    def test_environmental_trends(self):
        trends = get_environmental_trends(interval="daily")
        self.assertIn("records", trends)
        self.assertGreater(len(trends["records"]), 0)

if __name__ == '__main__':
    unittest.main()
