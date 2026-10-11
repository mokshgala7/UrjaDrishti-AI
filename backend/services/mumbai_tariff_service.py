from utils.error_handlers import AppError

def calculate_mumbai_bill_detailed(provider: str, units: float, financial_year: str = "FY 2022-23") -> dict:
    """
    Calculates Mumbai residential electricity bill based on official MERC LT-I tariffs.
    Strictly follows UrjaDrishti data integrity rules:
    - Verifies financial year availability
    - Computes itemised slab breakdown
    - Accounts for 16% Maharashtra Electricity Duty
    - Explicitly marks FAC as excluded rather than fabricating rates or assuming zero
    """
    try:
        units = float(units)
    except (ValueError, TypeError):
        raise AppError("Units must be a valid non-negative number.", error_code="INVALID_UNITS", status_code=400)

    if units < 0:
        raise AppError("Consumption units cannot be negative.", error_code="NEGATIVE_UNITS", status_code=400)

    provider_norm = provider.lower()
    is_adani = 'adani' in provider_norm or 'aeml' in provider_norm
    is_best = 'best' in provider_norm

    if not (is_adani or is_best):
        is_adani = True  # Default to Adani Electricity

    # Check financial year validity
    fy_norm = financial_year.strip().upper() if financial_year else "FY 2022-23"
    if fy_norm not in ["FY 2022-23", "2022-23", "FY22-23"]:
        return {
            "provider": "Adani Electricity Mumbai (AEML-D)" if is_adani else "BEST Undertaking Mumbai",
            "units": units,
            "financial_year": financial_year,
            "calculation_status": "not_calculable_no_verified_tariff",
            "message": f"Tariff schedule for {financial_year} is not verified in the dataset registry. UrjaDrishti AI strictly does not invent electricity tariffs or use superseded tariffs without explicit user selection.",
            "total_bill": None,
            "itemised_breakdown": None
        }

    if is_adani:
        provider_name = "Adani Electricity Mumbai Limited (AEML-D)"
        fixed_charge = 140.0
        wheeling_rate = 1.65
        slabs_def = [
            ("0-100 kWh", 0, 100, 4.50),
            ("101-300 kWh", 100, 300, 7.20),
            ("301-500 kWh", 300, 500, 9.10),
            (">500 kWh", 500, float('inf'), 11.50)
        ]
        source_order = "MERC Tariff Order in Case No. 325 of 2019 / Mid-Term Review (FY 2022-23)"
    else:
        provider_name = "BEST Undertaking Mumbai (Island City)"
        fixed_charge = 120.0
        wheeling_rate = 1.45
        slabs_def = [
            ("0-100 kWh", 0, 100, 3.90),
            ("101-300 kWh", 100, 300, 6.80),
            ("301-500 kWh", 300, 500, 8.90),
            (">500 kWh", 500, float('inf'), 10.80)
        ]
        source_order = "MERC Tariff Order in Case No. 324 of 2019 / Mid-Term Review (FY 2022-23)"

    wheeling_charge = round(units * wheeling_rate, 2)
    energy_charge = 0.0
    slab_breakdown = []

    for name, low, high, rate in slabs_def:
        if units > low:
            units_in_slab = min(units, high) - low
            cost = round(units_in_slab * rate, 2)
            energy_charge += cost
            slab_breakdown.append({
                "slab_name": name,
                "units_in_slab": round(units_in_slab, 2),
                "rate_per_kwh": rate,
                "amount_rs": cost
            })
        else:
            slab_breakdown.append({
                "slab_name": name,
                "units_in_slab": 0.0,
                "rate_per_kwh": rate,
                "amount_rs": 0.0
            })

    energy_charge = round(energy_charge, 2)
    subtotal = round(fixed_charge + wheeling_charge + energy_charge, 2)
    
    # Maharashtra State Electricity Duty (16%)
    electricity_duty = round(subtotal * 0.16, 2)
    total_bill = round(subtotal + electricity_duty, 2)

    return {
        "provider": provider_name,
        "units": units,
        "financial_year": "FY 2022-23",
        "calculation_status": "incomplete_estimate_missing_fac",
        "fixed_charges": fixed_charge,
        "wheeling_charges": wheeling_charge,
        "energy_charges": energy_charge,
        "electricity_duty": electricity_duty,
        "subtotal": subtotal,
        "total_bill": total_bill,
        "slab_breakdown": slab_breakdown,
        "excluded_components": [
            "Fuel Adjustment Charge (FAC / PPCA) - Monthly variable rates not extracted in current dataset",
            "Regulatory Asset Charge (RAC)"
        ],
        "assumptions": [
            "LT-I Residential consumer single phase tariff schedule applied",
            "Electricity duty calculated at 16% according to Maharashtra Electricity Duty Act",
            "FAC is not assumed to be zero; bill is marked incomplete_estimate_missing_fac"
        ],
        "tariff_source": source_order
    }
