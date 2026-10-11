import unittest
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from services.mumbai_tariff_service import calculate_mumbai_bill_detailed
from services.billing_service import calculate_mumbai_bill
from utils.error_handlers import AppError

class TestMumbaiBilling(unittest.TestCase):
    def test_adani_slab_boundaries_100_units(self):
        # 100 units: Fixed 140, Wheeling 165, Energy (100 * 4.50 = 450) -> Subtotal 755. Duty 16% = 120.8 -> Total 875.8
        bill = calculate_mumbai_bill_detailed("Adani Electricity", 100)
        self.assertEqual(bill["units"], 100)
        self.assertEqual(bill["fixed_charges"], 140.0)
        self.assertEqual(bill["wheeling_charges"], 165.0)
        self.assertEqual(bill["energy_charges"], 450.0)
        self.assertEqual(bill["subtotal"], 755.0)
        self.assertEqual(bill["electricity_duty"], 120.8)
        self.assertEqual(bill["total_bill"], 875.8)
        self.assertEqual(bill["calculation_status"], "incomplete_estimate_missing_fac")
        self.assertIn("Fuel Adjustment Charge (FAC / PPCA) - Monthly variable rates not extracted in current dataset", bill["excluded_components"])

    def test_adani_multi_slab_250_units(self):
        # 250 units:
        # Fixed 140, Wheeling 250 * 1.65 = 412.5
        # Slab 1 (100 * 4.5 = 450), Slab 2 (150 * 7.2 = 1080) -> Energy 1530
        # Subtotal 140 + 412.5 + 1530 = 2082.5
        # Duty 16% = 333.2 -> Total 2415.7
        bill = calculate_mumbai_bill_detailed("Adani Electricity", 250)
        self.assertEqual(bill["energy_charges"], 1530.0)
        self.assertEqual(bill["total_bill"], 2415.7)

    def test_best_slab_boundaries_100_units(self):
        # BEST 100 units:
        # Fixed 120, Wheeling 145, Energy (100 * 3.90 = 390) -> Subtotal 655
        # Duty 16% = 104.8 -> Total 759.8
        bill = calculate_mumbai_bill_detailed("BEST Undertaking", 100)
        self.assertEqual(bill["fixed_charges"], 120.0)
        self.assertEqual(bill["wheeling_charges"], 145.0)
        self.assertEqual(bill["energy_charges"], 390.0)
        self.assertEqual(bill["total_bill"], 759.8)

    def test_unverified_financial_year_rejection(self):
        # Should NOT fabricate bills for unverified periods
        bill = calculate_mumbai_bill_detailed("Adani Electricity", 250, financial_year="FY 2024-25")
        self.assertEqual(bill["calculation_status"], "not_calculable_no_verified_tariff")
        self.assertIsNone(bill["total_bill"])

    def test_negative_units_raises_error(self):
        with self.assertRaises(AppError):
            calculate_mumbai_bill_detailed("Adani Electricity", -50)

    def test_zero_units_bill(self):
        bill = calculate_mumbai_bill_detailed("Adani Electricity", 0)
        # Fixed 140, wheeling 0, energy 0, subtotal 140, duty 22.4 -> 162.4
        self.assertEqual(bill["fixed_charges"], 140.0)
        self.assertEqual(bill["total_bill"], 162.4)

if __name__ == '__main__':
    unittest.main()
