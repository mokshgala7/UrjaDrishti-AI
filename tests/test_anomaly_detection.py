import unittest
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from services.anomaly_service import detect_anomalies, get_anomaly_summary

class TestAnomalyDetection(unittest.TestCase):
    def test_anomaly_detection_execution(self):
        anomalies = detect_anomalies(limit=20)
        self.assertIsInstance(anomalies, list)
        if len(anomalies) > 0:
            first = anomalies[0]
            self.assertIn("anomaly_id", first)
            self.assertIn("actual_kwh", first)
            self.assertIn("expected_kwh", first)
            self.assertIn("severity", first)
            self.assertIn("anomaly_type", first)
            self.assertIn("detection_method", first)
            # Rule: Ground-truth remains distinct from model inference
            self.assertEqual(first["is_ground_truth"], False)

    def test_severity_filter(self):
        critical_anomalies = detect_anomalies(severity="CRITICAL", limit=50)
        for a in critical_anomalies:
            self.assertEqual(a["severity"], "CRITICAL")

    def test_anomaly_summary(self):
        summary = get_anomaly_summary()
        self.assertIn("total_anomalies", summary)
        self.assertIn("severity_breakdown", summary)
        self.assertIn("hourly_distribution", summary)
        self.assertEqual(summary["ground_truth_events_available"], False)

if __name__ == '__main__':
    unittest.main()
