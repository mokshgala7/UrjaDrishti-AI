from sklearn.cluster import KMeans
import joblib

def train_kmeans(X, n_clusters=4):
    model = KMeans(n_clusters=n_clusters, random_state=42)
    model.fit(X)
    joblib.dump(model, "ml/artifacts/clustering/kmeans_clusters.joblib")
    return model
