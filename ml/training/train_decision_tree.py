from sklearn.tree import DecisionTreeRegressor
import joblib

def train_dt(X, y):
    model = DecisionTreeRegressor(max_depth=10, random_state=42)
    model.fit(X, y)
    joblib.dump(model, "ml/artifacts/regression/decision_tree.joblib")
    return model
