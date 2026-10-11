import numpy as np

def detect_kmeans_outliers(kmeans_model, X, threshold_percentile=95):
    distances = np.min(kmeans_model.transform(X), axis=1)
    threshold = np.percentile(distances, threshold_percentile)
    return distances > threshold
