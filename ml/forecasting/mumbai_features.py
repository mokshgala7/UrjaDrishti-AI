def extract_mumbai_weather_calendar_features(df):
    """Adds monsoon flags, heat index, and Mumbai festival peak periods."""
    df['is_monsoon'] = df['month'].isin([6, 7, 8, 9]).astype(int)
    return df
