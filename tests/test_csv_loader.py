import unittest
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from utils.csv_loader import registry
from services.dataset_service import get_all_datasets, get_dataset_preview, get_dataset_statistics, refresh_datasets_cache
from utils.error_handlers import AppError

class TestCSVLoaderAndRegistry(unittest.TestCase):
    def test_discover_datasets(self):
        datasets = registry.discover_datasets()
        self.assertGreaterEqual(len(datasets), 4)
        self.assertIn("mumbai_household_data", datasets)
        self.assertIn("mumbai_adani_residential_tariffs", datasets)
        self.assertIn("mumbai_best_residential_tariffs", datasets)

    def test_load_dataframe_caching(self):
        df1 = registry.load_dataframe("mumbai_household_data")
        df2 = registry.load_dataframe("mumbai_household_data")
        self.assertEqual(len(df1), len(df2))
        self.assertGreater(len(df1), 0)

    def test_paginated_preview(self):
        preview = get_dataset_preview("mumbai_household_data", page=1, page_size=10)
        self.assertEqual(preview["page"], 1)
        self.assertEqual(preview["page_size"], 10)
        self.assertLessEqual(len(preview["items"]), 10)
        self.assertIn("columns", preview)

    def test_dataset_statistics(self):
        stats = get_dataset_statistics("mumbai_household_data")
        self.assertIn("statistics", stats)
        self.assertIn("total_rows", stats)

    def test_safe_download_path(self):
        path = registry.get_safe_download_path("mumbai_household_data")
        self.assertTrue(path.exists())
        self.assertTrue(str(path).endswith(".csv"))

    def test_invalid_dataset_raises_error(self):
        with self.assertRaises(AppError):
            get_dataset_preview("non_existent_dataset_1234")

    def test_cache_refresh(self):
        res = refresh_datasets_cache()
        self.assertIn("discovered_datasets", res)
        self.assertGreaterEqual(res["count"], 4)

if __name__ == '__main__':
    unittest.main()
