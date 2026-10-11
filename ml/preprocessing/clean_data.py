import pandas as pd

def clean_household_power_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.replace('?', pd.NA).dropna()
    numeric_cols = [c for c in df.columns if c not in ['Date', 'Time']]
    df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric)
    return df
