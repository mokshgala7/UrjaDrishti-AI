from flask import Blueprint, request
from services.environmental_service import (
    get_environmental_summary,
    calculate_environmental_impact,
    get_environmental_trends
)
from utils.response_helpers import success_response

environmental_bp = Blueprint('environmental', __name__)

@environmental_bp.route('/summary', methods=['GET'])
def environmental_summary_route():
    summary = get_environmental_summary()
    return success_response(summary)

@environmental_bp.route('/calculate', methods=['POST'])
def environmental_calculate_route():
    data = request.get_json() or {}
    units = data.get('units_kwh', data.get('units', 100))
    result = calculate_environmental_impact(units)
    return success_response(result)

@environmental_bp.route('/trends', methods=['GET'])
def environmental_trends_route():
    interval = request.args.get('interval', 'daily')
    trends = get_environmental_trends(interval=interval)
    return success_response(trends)
