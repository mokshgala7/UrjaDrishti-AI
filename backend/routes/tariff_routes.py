from flask import Blueprint, request
from services.tariff_service import (
    get_tariff_schedules,
    get_tariff_providers,
    get_tariff_history,
    get_fac_status
)
from utils.response_helpers import success_response

tariff_bp = Blueprint('tariffs', __name__)

@tariff_bp.route('/', methods=['GET'])
def list_tariffs_route():
    schedules = get_tariff_schedules()
    return success_response(schedules)

@tariff_bp.route('/providers', methods=['GET'])
def tariff_providers_route():
    providers = get_tariff_providers()
    return success_response(providers)

@tariff_bp.route('/history', methods=['GET'])
def tariff_history_route():
    history = get_tariff_history()
    return success_response(history)

@tariff_bp.route('/fac', methods=['GET'])
def tariff_fac_route():
    fac = get_fac_status()
    return success_response(fac)
