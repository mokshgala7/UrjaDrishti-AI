import json

def compare_and_save(results_dict, filepath="ml/artifacts/evaluation_results/comparison.json"):
    with open(filepath, "w") as f:
        json.dump(results_dict, f, indent=2)
