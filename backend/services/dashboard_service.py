import pandas as pd
import numpy as np
from utils.csv_loader import registry
from utils.date_helpers import parse_datetime, format_datetime, normalize_interval

def _get_household_dataframe():
    """
    Retrieves and normalizes the primary residential smart-meter dataset.
    Returns normalized DataFrame with canonical columns or empty DataFrame if unavailable.
    """
    for dataset_id in ["mumbai_household_data", "household_power"]:
        try:
            df = registry.load_dataframe(dataset_id, normalize=True)
            if len(df) > 0:
                if 'timestamp' in df.columns:
                    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
                return df
        except Exception:
            continue
    return pd.DataFrame()

def get_dashboard_summary():
    df = _get_household_dataframe()
    if len(df) == 0:
        return {
            "status": "no_data_available",
            "households_count": 0,
            "readings_count": 0,
            "date_range": {"start": None, "end": None},
            "consumption": {"total_kwh": 0.0, "avg_hourly_kwh": 0.0, "today_usage_kwh": 0.0},
            "peak_load": {"peak_kw": 0.0, "timestamp": None},
            "anomalies": {"count": 0, "status": "No records"},
            "models_available": ["RandomForestRegressor", "DecisionTreeRegressor", "LinearRegression"],
            "data_quality_status": "UNAVAILABLE"
        }

    # Timestamp stats
    valid_ts = df['timestamp'].dropna() if 'timestamp' in df.columns else pd.Series()
    start_dt = valid_ts.min() if len(valid_ts) > 0 else None
    end_dt = valid_ts.max() if len(valid_ts) > 0 else None

    # Load stats
    load_col = 'consumption_kwh' if 'consumption_kwh' in df.columns else df.select_dtypes(include=[np.number]).columns[0]
    total_consumption = float(df[load_col].sum())
    avg_load = float(df[load_col].mean())
    
    # Peak load
    peak_idx = df[load_col].idxmax() if len(df) > 0 else None
    peak_val = float(df[load_col].loc[peak_idx]) if peak_idx is not None else 0.0
    peak_ts = format_datetime(df['timestamp'].loc[peak_idx]) if (peak_idx is not None and 'timestamp' in df.columns) else None

    # Household count
    households = 1
    if 'household_id' in df.columns:
        households = int(df['household_id'].nunique())

    # Today's usage (most recent 24 readings)
    recent_24 = df.tail(24)
    today_usage = float(recent_24[load_col].sum()) if len(recent_24) > 0 else avg_load * 24

    # Anomaly count if labeled
    anomaly_count = int(df['is_anomaly'].sum()) if 'is_anomaly' in df.columns else 0

    return {
        "status": "ready",
        "households_count": households,
        "readings_count": len(df),
        "date_range": {
            "start": format_datetime(start_dt),
            "end": format_datetime(end_dt)
        },
        "consumption": {
            "total_kwh": round(total_consumption, 2),
            "avg_hourly_kwh": round(avg_load, 3),
            "today_usage_kwh": round(today_usage, 2)
        },
        "peak_load": {
            "peak_kw": round(peak_val, 3),
            "timestamp": peak_ts
        },
        "anomalies": {
            "count": anomaly_count,
            "status": "NORMAL" if anomaly_count == 0 else "ANOMALIES_DETECTED"
        },
        "data_provenance": "Synthetic Mumbai smart-meter telemetry",
        "data_quality_status": "HEALTHY"
    }

def get_consumption_timeseries(household=None, start_date=None, end_date=None, interval='hourly'):
    df = _get_household_dataframe()
    if len(df) == 0:
        return {"records": [], "count": 0, "unit": "kWh"}

    load_col = 'consumption_kwh' if 'consumption_kwh' in df.columns else df.select_dtypes(include=[np.number]).columns[0]

    # Filter by household if applicable
    if household and 'household_id' in df.columns:
        df = df[df['household_id'] == str(household)]

    # Filter by date range
    if 'timestamp' in df.columns and pd.api.types.is_datetime64_any_dtype(df['timestamp']):
        if start_date:
            parsed_start = parse_datetime(start_date)
            if parsed_start:
                df = df[df['timestamp'] >= parsed_start]
        if end_date:
            parsed_end = parse_datetime(end_date)
            if parsed_end:
                df = df[df['timestamp'] <= parsed_end]

    if len(df) == 0:
        return {"records": [], "count": 0, "unit": "kWh"}

    interval = normalize_interval(interval)
    
    # Aggregation if interval > hourly
    records = []
    if interval in ['daily', 'weekly', 'monthly'] and 'timestamp' in df.columns:
        df_ts = df.set_index('timestamp')
        freq = 'D' if interval == 'daily' else ('W' if interval == 'weekly' else 'ME')
        agg_df = df_ts[load_col].resample(freq).sum().reset_index()
        for _, row in agg_df.iterrows():
            records.append({
                "timestamp": format_datetime(row['timestamp']),
                "consumption_kwh": round(float(row[load_col]), 3)
            })
    else:
        # Hourly / raw
        # Cap to most recent 500 points for chart performance if no date filter specified
        display_df = df.tail(500) if (not start_date and not end_date) else df
        for _, row in display_df.iterrows():
            rec = {
                "timestamp": format_datetime(row['timestamp']) if 'timestamp' in row else None,
                "consumption_kwh": round(float(row[load_col]), 3)
            }
            if 'temperature' in row and pd.notna(row['temperature']):
                rec['temperature'] = round(float(row['temperature']), 1)
            if 'is_anomaly' in row and pd.notna(row['is_anomaly']):
                rec['is_anomaly'] = int(row['is_anomaly'])
            records.append(rec)

    return {
        "records": records,
        "count": len(records),
        "unit": "kWh",
        "interval": interval,
        "classification": "synthetic_smart_meter"
    }

def get_consumption_patterns():
    df = _get_household_dataframe()
    if len(df) == 0:
        return {"hourly_profile": [], "daily_profile": []}

    load_col = 'consumption_kwh' if 'consumption_kwh' in df.columns else df.select_dtypes(include=[np.number]).columns[0]

    # Ensure hour & day_of_week
    if 'hour' not in df.columns and 'timestamp' in df.columns:
        df['hour'] = df['timestamp'].dt.hour
    if 'day_of_week' not in df.columns and 'timestamp' in df.columns:
        df['day_of_week'] = df['timestamp'].dt.dayofweek

    hourly_profile = []
    if 'hour' in df.columns:
        hourly_grp = df.groupby('hour')[load_col].mean()
        for h, val in hourly_grp.items():
            hourly_profile.append({"hour": int(h), "avg_kwh": round(float(val), 3)})

    daily_profile = []
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    if 'day_of_week' in df.columns:
        daily_grp = df.groupby('day_of_week')[load_col].mean()
        for d, val in daily_grp.items():
            idx = int(d)
            daily_profile.append({
                "day_index": idx,
                "day_name": days[idx] if idx < len(days) else f"Day {idx}",
                "avg_kwh": round(float(val), 3)
            })

    return {
        "hourly_profile": hourly_profile,
        "daily_profile": daily_profile,
        "unit": "kWh",
        "provenance": "Aggregated from Mumbai load profile"
    }

def get_households_list():
    df = _get_household_dataframe()
    if len(df) == 0 or 'household_id' not in df.columns:
        return [{"id": "HH_01", "name": "Simulated Mumbai Household 01", "type": "Residential LT-I"}]
    
    unique_hh = df['household_id'].unique()
    return [{"id": str(hh), "name": f"Mumbai Household {hh}", "type": "Residential LT-I"} for hh in sorted(unique_hh)]
