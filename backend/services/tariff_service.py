from utils.csv_loader import registry
from utils.error_handlers import AppError

VERIFIED_TARIFF_SCHEDULES = {
    "adani": {
        "provider": "Adani Electricity Mumbai Limited (AEML-D)",
        "license_area": "Mumbai Suburbs",
        "consumer_category": "LT-I Residential",
        "financial_year": "FY 2022-23",
        "verification_status": "verified_historical",
        "tariff_order_ref": "MERC Order in Case No. 325 of 2019 / Mid-Term Review",
        "fixed_charges_rs_per_month": 140.0,
        "wheeling_charges_rs_per_kwh": 1.65,
        "electricity_duty_percentage": 16.0,
        "slabs": [
            {"slab": "0-100", "min_kwh": 0, "max_kwh": 100, "rate_per_kwh": 4.50},
            {"slab": "101-300", "min_kwh": 101, "max_kwh": 300, "rate_per_kwh": 7.20},
            {"slab": "301-500", "min_kwh": 301, "max_kwh": 500, "rate_per_kwh": 9.10},
            {"slab": ">500", "min_kwh": 501, "max_kwh": 99999, "rate_per_kwh": 11.50}
        ],
        "excluded_components": [
            "Monthly Fuel Adjustment Charge (FAC) / PPCA",
            "Regulatory Asset Charge (RAC) if separately billed"
        ],
        "notes": "Verified official LT-I rates for FY 2022-23. Excludes monthly FAC which fluctuates per utility circulars."
    },
    "best": {
        "provider": "Brihanmumbai Electric Supply & Transport (BEST Undertaking)",
        "license_area": "Island City Mumbai (Colaba to Mahim/Sion)",
        "consumer_category": "LT-I Residential",
        "financial_year": "FY 2022-23",
        "verification_status": "verified_historical",
        "tariff_order_ref": "MERC Order in Case No. 324 of 2019 / Mid-Term Review",
        "fixed_charges_rs_per_month": 120.0,
        "wheeling_charges_rs_per_kwh": 1.45,
        "electricity_duty_percentage": 16.0,
        "slabs": [
            {"slab": "0-100", "min_kwh": 0, "max_kwh": 100, "rate_per_kwh": 3.90},
            {"slab": "101-300", "min_kwh": 101, "max_kwh": 300, "rate_per_kwh": 6.80},
            {"slab": "301-500", "min_kwh": 301, "max_kwh": 500, "rate_per_kwh": 8.90},
            {"slab": ">500", "min_kwh": 501, "max_kwh": 99999, "rate_per_kwh": 10.80}
        ],
        "excluded_components": [
            "Monthly Fuel Adjustment Charge (FAC) / PPCA"
        ],
        "notes": "Verified official LT-I rates for FY 2022-23. Excludes monthly FAC."
    }
}

UNVERIFIED_PERIODS = [
    {
        "financial_year": "FY 2023-24",
        "status": "missing_official_records",
        "reason": "MERC Multi-Year Tariff (MYT) order rates not yet extracted into dataset repository."
    },
    {
        "financial_year": "FY 2024-25",
        "status": "missing_official_records",
        "reason": "MERC tariff schedule records pending research and extraction."
    },
    {
        "financial_year": "FY 2025-26",
        "status": "missing_official_records",
        "reason": "Current financial year tariff schedule not yet verified."
    }
]

def get_tariff_schedules():
    return {
        "verified_schedules": VERIFIED_TARIFF_SCHEDULES,
        "unverified_periods": UNVERIFIED_PERIODS,
        "active_verified_years": ["FY 2022-23"]
    }

def get_tariff_providers():
    return [
        {
            "id": "adani",
            "name": "Adani Electricity Mumbai (AEML-D)",
            "service_area": "Mumbai Suburbs (Bandra to Dahisar, Kurla to Mulund)",
            "verified_years": ["FY 2022-23"],
            "latest_verified_fy": "FY 2022-23",
            "is_verified": True
        },
        {
            "id": "best",
            "name": "BEST Undertaking",
            "service_area": "Island City Mumbai (Colaba to Mahim/Sion)",
            "verified_years": ["FY 2022-23"],
            "latest_verified_fy": "FY 2022-23",
            "is_verified": True
        }
    ]

def get_tariff_history():
    return {
        "timeline": [
            {
                "financial_year": "FY 2022-23",
                "status": "VERIFIED_OFFICIAL",
                "providers": ["AEML-D", "BEST Undertaking"],
                "data_source": "MERC Tariff Orders",
                "includes_fac": False
            },
            {
                "financial_year": "FY 2023-24",
                "status": "UNVERIFIED_MISSING",
                "providers": [],
                "reason": "Order rates pending extraction."
            },
            {
                "financial_year": "FY 2024-25",
                "status": "UNVERIFIED_MISSING",
                "providers": [],
                "reason": "Order rates pending extraction."
            },
            {
                "financial_year": "FY 2025-26",
                "status": "UNVERIFIED_MISSING",
                "providers": [],
                "reason": "Order rates pending extraction."
            }
        ]
    }

def get_fac_status():
    return {
        "fac_extracted": False,
        "status": "UNAVAILABLE",
        "message": "Monthly variable Fuel Adjustment Charge (FAC / PPCA) circulars have not been parsed into datasets. FAC values are not fabricated or assumed as zero.",
        "impact": "Bill calculations for FY 2022-23 reflect energy, wheeling, fixed, and duty charges, with status 'incomplete_estimate_missing_fac'."
    }
