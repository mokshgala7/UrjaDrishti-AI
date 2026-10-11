from sklearn.cluster import DBSCAN

def detect_dbscan(X, eps=0.5, min_samples=5):
    db = DBSCAN(eps=eps, min_samples=min_samples)
    labels = db.fit_predict(X)
    # -1 represents anomaly in DBSCAN
    return labels == -1
