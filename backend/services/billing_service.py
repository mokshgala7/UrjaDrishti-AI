import json
import logging
from datetime import datetime
from services.mumbai_tariff_service import calculate_mumbai_bill_detailed
from services.tariff_service import get_tariff_schedules, get_tariff_providers
from database.connection import get_db_connection

logger = logging.getLogger(__name__)

def calculate_mumbai_bill(provider: str, units: float, financial_year: str = "FY 2022-23") -> dict:
    result = calculate_mumbai_bill_detailed(provider=provider, units=units, financial_year=financial_year)
    
    # Persist simulation in database if total_bill is available
    if result.get("total_bill") is not None:
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO billing_history (created_at, provider, units, tariff_fy, total_bill, calculation_status, breakdown_json)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                result["provider"],
                units,
                result["financial_year"],
                result["total_bill"],
                result["calculation_status"],
                json.dumps(result.get("slab_breakdown", []))
            ))
            conn.commit()
            conn.close()
        except Exception as e:
            logger.warning("Could not persist bill calculation to database: %s", str(e))
            
    return result

def get_billing_history(limit: int = 50) -> list:
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, created_at, provider, units, tariff_fy, total_bill, calculation_status, breakdown_json
            FROM billing_history
            ORDER BY id DESC
            LIMIT ?
        ''', (limit,))
        rows = cursor.fetchall()
        conn.close()
        
        results = []
        for r in rows:
            results.append({
                "id": r["id"],
                "created_at": r["created_at"],
                "provider": r["provider"],
                "units": r["units"],
                "tariff_fy": r["tariff_fy"],
                "total_bill": r["total_bill"],
                "calculation_status": r["calculation_status"],
                "breakdown": json.loads(r["breakdown_json"]) if r["breakdown_json"] else []
            })
        return results
    except Exception as e:
        logger.warning("Could not query billing history: %s", str(e))
        return []

def get_billing_tariffs():
    return get_tariff_schedules()

def get_billing_providers():
    return get_tariff_providers()
