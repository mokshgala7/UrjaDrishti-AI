# UrjaDrishti-AI: Project Context & Scope

## 🎯 Objective
Build an AI-driven energy intelligence platform tailored for Indian urban residential consumers, with deep Mumbai tariff integration (Adani Electricity & BEST).

## 📊 Data Pipeline
1. **Raw Datasets**:
   - UCI Household Electric Power Consumption dataset
   - Appliances Energy Prediction dataset
2. **Synthetic Data**:
   - Mumbai-calibrated hourly household load generator incorporating Mumbai seasonal weather and festival spikes.
3. **Tariff Structures**:
   - Tiered residential consumption slabs (0-100, 101-300, 301-500, >500 kWh/units).
   - Fixed charges, Wheeling charges, Regulatory Asset charges (FAC/RAC), and Maharashtra State Electricity Duty.

## 🤖 Models & Methodologies
- **Supervised Regression**: Linear Regression, Decision Tree Regressor, Random Forest Regressor.
- **Time-Series Forecasting**: Chronos Forecaster with weather exogenous features.
- **Anomaly Detection**: Isolation Forest, DBSCAN, K-Means clustering.
