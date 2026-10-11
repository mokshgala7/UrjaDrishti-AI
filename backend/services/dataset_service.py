from pathlib import Path
import pandas as pd
import numpy as np
from utils.csv_loader import registry
from utils.error_handlers import AppError

def get_all_datasets():
    discovered = registry.discover_datasets()
    result = []
    for d_id in sorted(discovered.keys()):
        try:
            info = registry.get_dataset_info(d_id)
            result.append({
                "id": info["id"],
                "name": info["name"],
                "relative_path": info["relative_path"],
                "description": info["description"],
                "provenance": info["provenance"],
                "classification": info["classification"],
                "reporting_period": info["reporting_period"],
                "limitations": info["limitations"],
                "file_size_bytes": info["file_size_bytes"],
                "rows": info["rows"],
                "columns": info["columns"],
                "quality_status": info.get("quality", {}).get("status", "UNKNOWN")
            })
        except Exception:
            continue
    return result

def get_dataset_details(dataset_id: str):
    try:
        return registry.get_dataset_info(dataset_id)
    except FileNotFoundError:
        raise AppError(f"Dataset '{dataset_id}' not found.", error_code="DATASET_NOT_FOUND", status_code=404)

def get_dataset_preview(dataset_id: str, page: int = 1, page_size: int = 20):
    page = max(1, page)
    page_size = min(100, max(1, page_size))
    
    try:
        df = registry.load_dataframe(dataset_id, normalize=False)
    except FileNotFoundError:
        raise AppError(f"Dataset '{dataset_id}' not found.", error_code="DATASET_NOT_FOUND", status_code=404)
        
    total_items = len(df)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    
    subset = df.iloc[start_idx:end_idx]
    # Replace NaN with None for clean JSON serialization
    records = subset.replace({np.nan: None}).to_dict(orient='records')
    
    return {
        "dataset_id": dataset_id,
        "columns": list(df.columns),
        "items": records,
        "total_items": total_items,
        "page": page,
        "page_size": page_size
    }

def get_dataset_statistics(dataset_id: str):
    try:
        df = registry.load_dataframe(dataset_id, normalize=False)
    except FileNotFoundError:
        raise AppError(f"Dataset '{dataset_id}' not found.", error_code="DATASET_NOT_FOUND", status_code=404)
        
    stats = {}
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        series = df[col].dropna()
        if len(series) == 0:
            continue
        stats[col] = {
            "count": int(series.count()),
            "mean": round(float(series.mean()), 4),
            "std": round(float(series.std()), 4) if len(series) > 1 else 0.0,
            "min": round(float(series.min()), 4),
            "q25": round(float(series.quantile(0.25)), 4),
            "median": round(float(series.median()), 4),
            "q75": round(float(series.quantile(0.75)), 4),
            "max": round(float(series.max()), 4),
            "missing": int(df[col].isna().sum())
        }
        
    return {
        "dataset_id": dataset_id,
        "total_rows": len(df),
        "numeric_columns_count": len(numeric_cols),
        "statistics": stats
    }

def get_dataset_quality(dataset_id: str):
    info = get_dataset_details(dataset_id)
    return info.get("quality", {})

def refresh_datasets_cache():
    registry.clear_cache()
    discovered = registry.discover_datasets()
    return {
        "message": "Dataset registry and memory cache refreshed successfully.",
        "discovered_datasets": list(discovered.keys()),
        "count": len(discovered)
    }
