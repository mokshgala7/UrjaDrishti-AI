def calculate_anomaly_severity(score):
    if score < -0.7:
        return "CRITICAL"
    elif score < -0.4:
        return "HIGH"
    elif score < 0.0:
        return "MEDIUM"
    return "LOW"
