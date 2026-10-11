import unittest
import sys
import os
from pathlib import Path

# Ensure backend is on sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from app import create_app

class TestAPIEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()

    def test_health_v1_endpoint(self):
        res = self.client.get('/api/v1/health')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data.get("status"), "healthy")
        self.assertIn("version", data)
        self.assertIn("dataset_readiness", data)
        self.assertIn("model_readiness", data)

    def test_health_legacy_endpoint(self):
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data.get("status"), "healthy")

    def test_status_endpoint(self):
        res = self.client.get('/api/v1/status')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data.get("service"), "UrjaDrishti-AI")
        self.assertIn("datasets", data)
        self.assertIn("features_status", data)

    def test_cors_headers_present(self):
        res = self.client.get('/api/v1/health', headers={"Origin": "http://localhost:5173"})
        self.assertEqual(res.status_code, 200)
        self.assertIn("Access-Control-Allow-Origin", res.headers)

    def test_404_handling(self):
        res = self.client.get('/api/v1/non_existent_route')
        self.assertEqual(res.status_code, 404)
        data = res.get_json()
        self.assertEqual(data.get("status"), "error")

if __name__ == '__main__':
    unittest.main()
