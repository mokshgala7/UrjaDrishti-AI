import pandas as pd
import numpy as np

# Canonical aliases for controlled schema normalization
COLUMN_ALIASES = {
    'timestamp': ['timestamp', 'datetime', 'date', 'Date', 'Time'],
    'consumption_kwh': ['consumption_kwh', 'global_active_power_kw', 'load_kwh', 'kwh', 'Global_active_power', 'Appliances'],
    'household_id': ['household_id', 'household', 'meter_id', 'consumer_id'],
    'temperature': ['temperature', 'temp', 'T_out', 'T1'],
    'humidity': ['humidity', 'rh', 'RH_out', 'RH_1'],
    'is_anomaly': ['is_anomaly', 'anomaly', 'anomaly_label', 'is_outlier']
}

def normalize_dataframe_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Standardize DataFrame column names using explicit alias mappings without
    destructively altering non-matching columns.
    """
    df_copy = df.copy()
    rename_map = {}
    
    # Check existing columns
    existing_cols = {c.lower().strip(): c for c in df_copy.columns}
    
    for canonical_name, aliases in COLUMN_ALIASES.items():
        if canonical_name in df_copy.columns:
            continue
        for alias in aliases:
            lower_alias = alias.lower()
            if lower_alias in existing_cols:
                original_col = existing_cols[lower_alias]
                rename_map[original_col] = canonical_name
                break
                
    if rename_map:
        df_copy.rename(columns=rename_map, inplace=True)
    return df_copy

def assess_data_quality(df: pd.DataFrame, dataset_id: str) -> dict:
    """
    Runs schema and quality diagnostics on a loaded DataFrame.
    """
    total_rows = len(df)
    total_cols = len(df.columns)
    
    null_counts = {col: int(df[col].isna().sum()) for col in df.columns}
    duplicate_rows = int(df.duplicated().sum())
    
    issues = []
    
    # Check for empty dataframe
    if total_rows == 0:
        issues.append("Dataset contains 0 rows (empty dataset).")
        
    # Check for excessive missing values (> 10%)
    for col, null_c in null_counts.items():
        if total_rows > 0 and (null_c / total_rows) > 0.1:
            issues.append(f"Column '{col}' has {null_c} missing values ({(null_c/total_rows)*100:.1f}%).")
            
    # Check duplicates
    if duplicate_rows > 0:
        issues.append(f"Found {duplicate_rows} duplicate rows.")
        
    return {
        "dataset_id": dataset_id,
        "total_rows": total_rows,
        "total_columns": total_cols,
        "columns": list(df.columns),
        "column_types": {col: str(dtype) for col, dtype in df.dtypes.items()},
        "null_counts": null_counts,
        "duplicate_rows": duplicate_rows,
        "quality_score": max(0, 100 - (len(issues) * 15)),
        "status": "HEALTHY" if len(issues) == 0 else "WARNING" if len(issues) <= 2 else "DEGRADED",
        "issues": issues
    }
