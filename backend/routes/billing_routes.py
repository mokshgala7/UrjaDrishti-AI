from flask import Blueprint, request
from services.billing_service import (
    calculate_mumbai_bill,
    get_billing_history,
    get_billing_tariffs,
    get_billing_providers
)
from utils.response_helpers import success_response

billing_bp = Blueprint('billing', __name__)

@billing_bp.route('/calculate', methods=['POST'])
@billing_bp.route('/simulate', methods=['POST'])
def calculate_bill_route():
    data = request.get_json() or {}
    provider = data.get('provider', 'Adani Electricity')
    units = data.get('units', 100)
    fy = data.get('financial_year', 'FY 2022-23')

    bill = calculate_mumbai_bill(provider=provider, units=units, financial_year=fy)
    return success_response(bill)

@billing_bp.route('/history', methods=['GET'])
def billing_history_route():
    limit = int(request.args.get('limit', 50))
    history = get_billing_history(limit=limit)
    return success_response(history, metadata={"count": len(history)})

@billing_bp.route('/tariffs', methods=['GET'])
def billing_tariffs_route():
    tariffs = get_billing_tariffs()
    return success_response(tariffs)

@billing_bp.route('/providers', methods=['GET'])
def billing_providers_route():
    providers = get_billing_providers()
    return success_response(providers)
