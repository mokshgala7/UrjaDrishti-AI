import pandas as pd
from config import Config
from utils.error_handlers import AppError
from services.dashboard_service import get_dashboard_summary, get_consumption_timeseries

# 1 mature tree absorbs ~21.77 kg CO2 annually (US EPA / India Forestry guidelines)
KG_CO2_PER_TREE_YEAR = 21.77

def get_environmental_summary():
    summary = get_dashboard_summary()
    total_kwh = summary.get("consumption", {}).get("total_kwh", 0.0)
    factor = Config.CEA_GRID_EMISSION_FACTOR

    co2_kg = round(total_kwh * factor, 2)
    trees_needed = round(co2_kg / KG_CO2_PER_TREE_YEAR, 1)

    return {
        "total_consumption_kwh": total_kwh,
        "co2_emissions_kg": co2_kg,
        "co2_emissions_tonnes": round(co2_kg / 1000.0, 3),
        "trees_equivalent_annual": trees_needed,
        "emission_factor_kg_per_kwh": factor,
        "emission_factor_source": "Central Electricity Authority (CEA) Baseline Database for the Indian Power Sector, User Guide Version 19.0",
        "assumptions": [
            "Baseline Indian Western Regional / Maharashtra grid mix factor of 0.716 kg CO2/kWh applied.",
            "Assumes 1 mature tree absorbs approximately 21.77 kg of CO2 annually.",
            "Synthetic household load profile serves as the consumption baseline."
        ],
        "reporting_period": summary.get("date_range", {})
    }

def calculate_environmental_impact(units_kwh: float):
    try:
        units = float(units_kwh)
    except (ValueError, TypeError):
        raise AppError("Units must be a non-negative number.", error_code="INVALID_UNITS", status_code=400)
        
    if units < 0:
        raise AppError("Units cannot be negative.", error_code="NEGATIVE_UNITS", status_code=400)

    factor = Config.CEA_GRID_EMISSION_FACTOR
    co2_kg = round(units * factor, 2)
    trees = round(co2_kg / KG_CO2_PER_TREE_YEAR, 2)

    return {
        "consumption_kwh": units,
        "co2_emissions_kg": co2_kg,
        "trees_offset_required": trees,
        "emission_factor_kg_per_kwh": factor,
        "methodology": "CEA Grid Emission Factor multiplication"
    }

def get_environmental_trends(interval='daily'):
    data = get_consumption_timeseries(interval=interval)
    factor = Config.CEA_GRID_EMISSION_FACTOR
    
    records = []
    for r in data.get("records", []):
        kwh = r.get("consumption_kwh", 0.0)
        records.append({
            "timestamp": r.get("timestamp"),
            "consumption_kwh": kwh,
            "co2_kg": round(kwh * factor, 3)
        })

    return {
        "interval": interval,
        "emission_factor": factor,
        "records": records,
        "unit": "kg CO2"
    }
