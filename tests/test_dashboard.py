import unittest
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from services.dashboard_service import (
    get_dashboard_summary,
    get_consumption_timeseries,
    get_consumption_patterns,
    get_households_list
)

class TestDashboardAnalytics(unittest.TestCase):
    def test_summary_kpi_metrics(self):
        summary = get_dashboard_summary()
        self.assertEqual(summary["status"], "ready")
        self.assertGreater(summary["readings_count"], 0)
        self.assertIn("total_kwh", summary["consumption"])
        self.assertIn("peak_kw", summary["peak_load"])
        self.assertGreater(summary["peak_load"]["peak_kw"], 0)

    def test_consumption_timeseries(self):
        data = get_consumption_timeseries(interval="hourly")
        self.assertIn("records", data)
        self.assertGreater(len(data["records"]), 0)
        first = data["records"][0]
        self.assertIn("timestamp", first)
        self.assertIn("consumption_kwh", first)

    def test_consumption_patterns_diurnal(self):
        patterns = get_consumption_patterns()
        self.assertEqual(len(patterns["hourly_profile"]), 24)
        for p in patterns["hourly_profile"]:
            self.assertIn("hour", p)
            self.assertIn("avg_kwh", p)
            self.assertGreater(p["avg_kwh"], 0)

    def test_households_list(self):
        hh = get_households_list()
        self.assertIsInstance(hh, list)
        self.assertGreaterEqual(len(hh), 1)

if __name__ == '__main__':
    unittest.main()
