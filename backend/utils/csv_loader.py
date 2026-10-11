import os
import threading
from pathlib import Path
import pandas as pd
from config import Config
from utils.schema_validator import normalize_dataframe_columns, assess_data_quality

logger = None

# Central registry metadata for recognized UrjaDrishti datasets
KNOWN_DATASETS_METADATA = {
    "mumbai_household_data": {
        "id": "mumbai_household_data",
        "relative_path": "synthetic/mumbai_household_data.csv",
        "name": "Mumbai Synthetic Household Load Profiles",
        "description": "Hourly electricity consumption readings calibrated with Mumbai temperatures and diurnal residential patterns.",
        "provenance": "Calibrated synthetic hourly smart-meter simulator for Mumbai residential loads.",
        "classification": "synthetic",
        "reporting_period": "Calibrated 2022-2025 series",
        "limitations": "Synthetic simulation. Does not represent actual utility telemetry of specific consumers."
    },
    "mumbai_adani_residential_tariffs": {
        "id": "mumbai_adani_residential_tariffs",
        "relative_path": "tariffs/mumbai_adani_residential_tariffs.csv",
        "name": "Adani Electricity Mumbai Residential Tariffs",
        "description": "AEML-D residential tariff schedule with slab charges, fixed charges, and wheeling charges.",
        "provenance": "Official AEML-D Tariff Schedule (FY 2022-23 LT-I Residential).",
        "classification": "official_historical",
        "reporting_period": "FY 2022-23",
        "limitations": "Tariff records exclude FAC/PPCA. Subsequent FY 2023-24 to 2026-27 schedules not verified."
    },
    "mumbai_best_residential_tariffs": {
        "id": "mumbai_best_residential_tariffs",
        "relative_path": "tariffs/mumbai_best_residential_tariffs.csv",
        "name": "BEST Undertaking Mumbai Residential Tariffs",
        "description": "BEST Undertaking island city residential tariff schedule with slab rates and fixed charges.",
        "provenance": "Official BEST Tariff Schedule (FY 2022-23 Residential).",
        "classification": "official_historical",
        "reporting_period": "FY 2022-23",
        "limitations": "Tariff records exclude FAC/PPCA. Subsequent FY 2023-24 to 2026-27 schedules not verified."
    },
    "mumbai_residential_tariffs_combined": {
        "id": "mumbai_residential_tariffs_combined",
        "relative_path": "tariffs/mumbai_residential_tariffs_combined.csv",
        "name": "Mumbai Combined Residential Tariffs (AEML & BEST)",
        "description": "Cross-provider comparison table of residential electricity tariffs in Mumbai.",
        "provenance": "Aggregated from official MERC tariff orders for AEML and BEST.",
        "classification": "official_historical",
        "reporting_period": "FY 2022-23",
        "limitations": "Fixed and wheeling charges listed; excludes monthly variable FAC."
    },
    "household_power": {
        "id": "household_power",
        "relative_path": "raw/household_power.csv",
        "name": "UCI Individual Household Electric Power Consumption",
        "description": "Benchmark telemetry dataset measuring household active and reactive power.",
        "provenance": "UCI Machine Learning Repository.",
        "classification": "benchmark_real",
        "reporting_period": "Dec 2006 - Nov 2010",
        "limitations": "French household telemetry; used for algorithm benchmarking and transfer testing."
    },
    "appliances_energy": {
        "id": "appliances_energy",
        "relative_path": "raw/appliances_energy.csv",
        "name": "UCI Appliances Energy Prediction Dataset",
        "description": "Sub-metered appliance power consumption with weather and environmental telemetry.",
        "provenance": "UCI Machine Learning Repository.",
        "classification": "benchmark_real",
        "reporting_period": "Jan 2016 - May 2016",
        "limitations": "Laboratory test house; used for environmental feature correlations."
    }
}

class DatasetRegistry:
    def __init__(self, data_dir: Path):
        self.data_dir = Path(data_dir)
        self._cache = {}
        self._mtimes = {}
        self._lock = threading.Lock()

    def discover_datasets(self):
        """Scans the DATA_DIR and registers all discovered CSV files."""
        discovered = {}
        if not self.data_dir.exists():
            return discovered

        for path in self.data_dir.rglob("*.csv"):
            rel_path = path.relative_to(self.data_dir)
            dataset_id = path.stem
            
            meta = KNOWN_DATASETS_METADATA.get(dataset_id, {
                "id": dataset_id,
                "relative_path": str(rel_path),
                "name": dataset_id.replace("_", " ").title(),
                "description": f"Discovered dataset at {rel_path}",
                "provenance": "User or pipeline supplied dataset",
                "classification": "custom_or_generated",
                "reporting_period": "Unknown",
                "limitations": "Schema dynamically discovered."
            })
            meta["file_path"] = str(path)
            meta["file_size_bytes"] = path.stat().st_size
            discovered[dataset_id] = meta
            
        return discovered

    def clear_cache(self):
        """Clears cached dataframes to allow hot reloading of Claude-generated datasets."""
        with self._lock:
            self._cache.clear()
            self._mtimes.clear()

    def load_dataframe(self, dataset_id: str, normalize: bool = False) -> pd.DataFrame:
        """Loads a CSV file with automatic caching, delimiter sniffing, and schema mapping."""
        discovered = self.discover_datasets()
        if dataset_id not in discovered:
            raise FileNotFoundError(f"Dataset '{dataset_id}' not found in registry.")

        file_path = Path(discovered[dataset_id]["file_path"])
        current_mtime = file_path.stat().st_mtime

        with self._lock:
            if dataset_id in self._cache and self._mtimes.get(dataset_id) == current_mtime:
                df = self._cache[dataset_id]
                return normalize_dataframe_columns(df) if normalize else df

            # Detect delimiter (e.g., ';' in household_power vs ',' in standard CSVs)
            sep = ','
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    first_line = f.readline()
                    if ';' in first_line and ',' not in first_line:
                        sep = ';'
            except Exception:
                pass

            df = pd.read_csv(file_path, sep=sep, low_memory=False)
            self._cache[dataset_id] = df
            self._mtimes[dataset_id] = current_mtime
            
            return normalize_dataframe_columns(df) if normalize else df

    def get_dataset_info(self, dataset_id: str) -> dict:
        """Returns comprehensive metadata, shape, column list, and quality diagnostics."""
        discovered = self.discover_datasets()
        if dataset_id not in discovered:
            raise FileNotFoundError(f"Dataset '{dataset_id}' not found.")

        meta = dict(discovered[dataset_id])
        try:
            df = self.load_dataframe(dataset_id, normalize=False)
            meta["rows"] = len(df)
            meta["columns"] = list(df.columns)
            meta["column_count"] = len(df.columns)
            meta["quality"] = assess_data_quality(df, dataset_id)
        except Exception as e:
            meta["rows"] = 0
            meta["columns"] = []
            meta["column_count"] = 0
            meta["error"] = str(e)
            
        return meta

    def get_safe_download_path(self, dataset_id: str) -> Path:
        """Returns safe verified absolute path restricted to the data directory."""
        discovered = self.discover_datasets()
        if dataset_id not in discovered:
            raise FileNotFoundError(f"Dataset '{dataset_id}' is not registered.")
        p = Path(discovered[dataset_id]["file_path"]).resolve()
        data_dir_resolved = self.data_dir.resolve()
        if not str(p).startswith(str(data_dir_resolved)):
            raise PermissionError("Access denied: path is outside allowed directory.")
        return p

# Global singleton
registry = DatasetRegistry(Config.DATA_DIR)
