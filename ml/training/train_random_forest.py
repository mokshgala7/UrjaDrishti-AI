from sklearn.ensemble import RandomForestRegressor
import joblib

def train_rf(X, y):
    model = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42)
    model.fit(X, y)
    joblib.dump(model, "ml/artifacts/regression/random_forest.joblib")
    return model
