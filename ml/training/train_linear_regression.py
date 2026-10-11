from sklearn.linear_model import LinearRegression
import joblib

def train_lr(X, y):
    model = LinearRegression()
    model.fit(X, y)
    joblib.dump(model, "ml/artifacts/regression/linear_regression.joblib")
    return model
