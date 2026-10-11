from sklearn.model_selection import KFold, cross_val_score

def evaluate_cv(model, X, y, cv=5):
    scores = cross_val_score(model, X, y, cv=cv, scoring='neg_mean_squared_error')
    return float(-scores.mean())
