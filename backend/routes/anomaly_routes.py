from flask import Blueprint, request
from services.anomaly_service import (
    detect_anomalies,
    get_anomaly_summary,
    get_anomaly_by_id,
    persist_anomaly_events,
    get_persisted_anomalies
)
from utils.response_helpers import success_response

anomaly_bp = Blueprint('anomalies', __name__)

@anomaly_bp.route('/', methods=['GET'])
@anomaly_bp.route('/recent', methods=['GET'])
def list_anomalies_route():
    household = request.args.get('household')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    severity = request.args.get('severity')
    limit = int(request.args.get('limit', 50))

    results = detect_anomalies(
        household=household,
        start_date=start_date,
        end_date=end_date,
        severity=severity,
        limit=limit
    )
    return success_response(results, metadata={"count": len(results), "detector": "Isolation Forest"})

@anomaly_bp.route('/history', methods=['GET'])
def anomaly_history_route():
    limit = int(request.args.get('limit', 50))
    history = get_persisted_anomalies(limit=limit)
    return success_response(history, metadata={"count": len(history)})

@anomaly_bp.route('/summary', methods=['GET'])
def anomaly_summary_route():
    summary = get_anomaly_summary()
    return success_response(summary)

@anomaly_bp.route('/<anomaly_id>', methods=['GET'])
def anomaly_details_route(anomaly_id):
    anomaly = get_anomaly_by_id(anomaly_id)
    return success_response(anomaly)

@anomaly_bp.route('/detect', methods=['POST'])
def run_detection_route():
    data = request.get_json() or {}
    records = data.get('records', [])
    household = data.get('household')
    
    results = detect_anomalies(data=records, household=household)
    if results:
        persist_anomaly_events(results)
    return success_response(results, metadata={"anomalies_detected": len(results)})
