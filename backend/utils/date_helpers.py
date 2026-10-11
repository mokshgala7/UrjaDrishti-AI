from datetime import datetime
import pandas as pd

def parse_datetime(dt_str):
    if not dt_str:
        return None
    if isinstance(dt_str, (datetime, pd.Timestamp)):
        return dt_str
    try:
        return pd.to_datetime(dt_str)
    except Exception:
        return None

def format_datetime(dt):
    if dt is None or pd.isna(dt):
        return None
    if hasattr(dt, 'strftime'):
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    return str(dt)

def normalize_interval(interval_str):
    if not interval_str:
        return 'hourly'
    interval_str = interval_str.lower().strip()
    mapping = {
        '1h': 'hourly', 'hour': 'hourly', 'hourly': 'hourly',
        '1d': 'daily', 'day': 'daily', 'daily': 'daily',
        '1w': 'weekly', 'week': 'weekly', 'weekly': 'weekly',
        '1m': 'monthly', 'month': 'monthly', 'monthly': 'monthly'
    }
    return mapping.get(interval_str, 'hourly')
