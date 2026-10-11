from sklearn.ensemble import IsolationForest
import joblib

def train_isolation_forest(X, contamination=0.03):
    model = IsolationForest(contamination=contamination, random_state=42)
    model.fit(X)
    joblib.dump(model, "ml/artifacts/clustering/isolation_forest.joblib")
    return model
