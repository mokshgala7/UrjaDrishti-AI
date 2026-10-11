import json
import logging
from datetime import datetime
from services.mumbai_tariff_service import calculate_mumbai_bill_detailed
from services.tariff_service import get_tariff_schedules, get_tariff_providers
from database.connection import get_db_session
from database.models import BillingHistory

logger = logging.getLogger(__name__)

def calculate_mumbai_bill(provider: str, units: float, financial_year: str = "FY 2022-23") -> dict:
    result = calculate_mumbai_bill_detailed(provider=provider, units=units, financial_year=financial_year)
    
    # Persist simulation in database if total_bill is available
    if result.get("total_bill") is not None:
        try:
            with get_db_session() as session:
                bill_record = BillingHistory(
                    created_at=datetime.now(),
                    provider=result["provider"],
                    units=units,
                    tariff_fy=result["financial_year"],
                    total_bill=result["total_bill"],
                    calculation_status=result.get("calculation_status", "CALCULATED"),
                    breakdown_json=json.dumps(result.get("slab_breakdown", []))
                )
                session.add(bill_record)
        except Exception as e:
            logger.warning("Could not persist bill calculation to database: %s", str(e))
            
    return result

def get_billing_history(limit: int = 50) -> list:
    try:
        with get_db_session() as session:
            rows = session.query(BillingHistory).order_by(BillingHistory.id.desc()).limit(limit).all()
            results = []
            for r in rows:
                results.append({
                    "id": r.id,
                    "created_at": r.created_at.strftime("%Y-%m-%d %H:%M:%S") if hasattr(r.created_at, "strftime") else str(r.created_at),
                    "provider": r.provider,
                    "units": float(r.units) if r.units is not None else 0.0,
                    "tariff_fy": r.tariff_fy,
                    "total_bill": float(r.total_bill) if r.total_bill is not None else None,
                    "calculation_status": r.calculation_status,
                    "breakdown": json.loads(r.breakdown_json) if r.breakdown_json else []
                })
            return results
    except Exception as e:
        logger.warning("Could not query billing history: %s", str(e))
        return []

def get_billing_tariffs():
    return get_tariff_schedules()

def get_billing_providers():
    return get_tariff_providers()
