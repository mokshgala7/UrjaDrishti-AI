from flask import Blueprint, request
from services.dashboard_service import (
    get_dashboard_summary,
    get_consumption_timeseries,
    get_consumption_patterns,
    get_households_list
)
from utils.response_helpers import success_response

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/summary', methods=['GET'])
def dashboard_summary_route():
    summary = get_dashboard_summary()
    return success_response(summary)

@dashboard_bp.route('/consumption', methods=['GET'])
def dashboard_consumption_route():
    household = request.args.get('household')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    interval = request.args.get('interval', 'hourly')
    
    data = get_consumption_timeseries(
        household=household,
        start_date=start_date,
        end_date=end_date,
        interval=interval
    )
    return success_response(data)

@dashboard_bp.route('/consumption-patterns', methods=['GET'])
def dashboard_patterns_route():
    patterns = get_consumption_patterns()
    return success_response(patterns)

@dashboard_bp.route('/households', methods=['GET'])
def dashboard_households_route():
    households = get_households_list()
    return success_response(households)
