import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def generate_mumbai_synthetic_data(num_days=365):
    start = datetime(2025, 1, 1)
    dates = [start + timedelta(hours=i) for i in range(num_days * 24)]
    
    records = []
    for dt in dates:
        temp = 26 + 8 * np.sin(np.pi * (dt.hour - 6) / 12) + np.random.normal(0, 1.5)
        humidity = 65 + 20 * np.cos(np.pi * (dt.hour - 6) / 12) + np.random.normal(0, 3)
        base_load = 0.8 + 0.04 * (temp - 24)
        if 19 <= dt.hour <= 23:
            base_load += 1.5  # Evening peak in Mumbai households
        if dt.weekday() >= 5:
            base_load *= 1.15 # Weekend uplift
        
        load = max(0.2, base_load + np.random.normal(0, 0.2))
        records.append({
            "datetime": dt.strftime('%Y-%m-%d %H:%M:%S'),
            "temperature": round(temp, 2),
            "humidity": round(humidity, 2),
            "global_active_power_kw": round(load, 3),
            "day_of_week": dt.weekday(),
            "hour": dt.hour,
            "is_weekend": int(dt.weekday() >= 5)
        })
    df = pd.DataFrame(records)
    df.to_csv("mumbai_household_data.csv", index=False)
    print(f"Generated {len(df)} records in mumbai_household_data.csv")

if __name__ == '__main__':
    generate_mumbai_synthetic_data()
