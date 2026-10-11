# ML Architecture & System Design

```
Raw Data (UCI / Appliances)
        │
        ▼
Feature Engineering (Cyclical hours, Temperature, Mumbai monsoon flags)
        │
   ┌────┴──────────────────────────┐
   ▼                               ▼
Regression & Forecasting      Anomaly Detection
- Linear Regression           - Isolation Forest
- Decision Tree               - DBSCAN
- Random Forest               - K-Means Outlier Distance
- Chronos T5
   │                               │
   └──────────────┬────────────────┘
                  ▼
          Flask REST Service
                  │
                  ▼
         React Vite Frontend
```
