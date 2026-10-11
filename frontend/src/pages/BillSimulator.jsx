import React, { useState, useEffect } from 'react';
import ProviderSelector from '../components/ProviderSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import { calculateBill } from '../services/api';

export default function BillSimulator() {
  const [provider, setProvider] = useState('Adani Electricity');
  const [financialYear, setFinancialYear] = useState('FY 2022-23');
  const [units, setUnits] = useState(250);
  const [billResult, setBillResult] = useState(null);
  const [comparisonBill, setComparisonBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    runCalculation();
  }, [provider, units, financialYear]);

  const runCalculation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await calculateBill(provider, units, financialYear);
      setBillResult(res.data);

      // Run comparison against the other provider if verified FY
      if (financialYear === 'FY 2022-23') {
        const otherProvider = provider.includes('Adani') ? 'BEST Undertaking' : 'Adani Electricity';
        const otherRes = await calculateBill(otherProvider, units, financialYear);
        setComparisonBill(otherRes.data);
      } else {
        setComparisonBill(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isCalculable = billResult && billResult.calculation_status !== 'not_calculable_no_verified_tariff';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Mumbai Electricity Bill Simulator</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
          Simulate residential LT-I electricity bills based on official MERC tariff schedules for Adani Electricity & BEST.
        </p>
      </div>

      {/* Inputs Section */}
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Distribution Licensee:
            </label>
            <ProviderSelector selectedProvider={provider} onSelectProvider={setProvider} />
          </div>

          <div>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Tariff Schedule:
            </label>
            <select
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: '#fff',
                fontSize: '13px'
              }}
            >
              <option value="FY 2022-23">FY 2022-23 (MERC Verified Schedule)</option>
              <option value="FY 2024-25">FY 2024-25 (Unverified - Missing Official Record)</option>
            </select>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Monthly Consumption: {units} Units (kWh)</label>
            <input
              type="number"
              min="0"
              max="2000"
              value={units}
              onChange={(e) => setUnits(Math.max(0, parseInt(e.target.value) || 0))}
              style={{
                width: '90px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: '#fff',
                textAlign: 'right'
              }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={units}
            onChange={(e) => setUnits(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : !isCalculable ? (
        /* Status Banner for Unverified Tariffs */
        <div style={{
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid #f59e0b',
          borderRadius: '12px',
          padding: '24px',
          color: '#f59e0b'
        }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 8px 0' }}>⚠️ Calculation Status: Not Calculable (No Verified Tariff)</h3>
          <p style={{ fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
            {billResult?.message || "Official tariff orders for this period have not yet been extracted. UrjaDrishti AI never invents current electricity prices or silently substitutes superseded tariffs."}
          </p>
        </div>
      ) : (
        /* Itemised Bill Results */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Main Bill Card */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '17px', color: '#fff', margin: 0 }}>{billResult.provider}</h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {billResult.financial_year} LT-I Residential • {billResult.units} Units
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  ₹ {billResult.total_bill?.toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estimated Total</div>
              </div>
            </div>

            {/* Incomplete Estimate Warning */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '12px',
              color: '#f59e0b',
              marginBottom: '16px'
            }}>
              <strong>Status: incomplete_estimate_missing_fac</strong>
              <div style={{ marginTop: '2px', color: 'rgba(255,255,255,0.8)' }}>
                Excludes variable monthly FAC (Fuel Adjustment Charge) as official circular rates have not been extracted into datasets.
              </div>
            </div>

            {/* Itemised Breakdown */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '16px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>Fixed Charges:</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>₹ {billResult.fixed_charges}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>Wheeling Charges:</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>₹ {billResult.wheeling_charges}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>Energy Charges (Tiered):</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>₹ {billResult.energy_charges}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>Subtotal:</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>₹ {billResult.subtotal}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>Electricity Duty (16% Maha Act):</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: 'var(--accent-amber)' }}>₹ {billResult.electricity_duty}</td>
                </tr>
                <tr style={{ borderTop: '2px solid var(--border-color)', fontWeight: 700, fontSize: '14px' }}>
                  <td style={{ padding: '10px 0' }}>Total Estimated Bill:</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', color: 'var(--accent-cyan)' }}>₹ {billResult.total_bill}</td>
                </tr>
              </tbody>
            </table>

            {/* Tier Slabs Table */}
            <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Tiered Consumption Slabs</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '6px' }}>Slab</th>
                    <th style={{ padding: '6px' }}>Units</th>
                    <th style={{ padding: '6px' }}>Rate/kWh</th>
                    <th style={{ padding: '6px', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {billResult.slab_breakdown?.map(sb => (
                    <tr key={sb.slab_name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '6px' }}>{sb.slab_name}</td>
                      <td style={{ padding: '6px' }}>{sb.units_in_slab}</td>
                      <td style={{ padding: '6px' }}>₹ {sb.rate_per_kwh.toFixed(2)}</td>
                      <td style={{ padding: '6px', textAlign: 'right', fontWeight: 600 }}>₹ {sb.amount_rs.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cross-Provider Comparison Card */}
          {comparisonBill && (
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '12px' }}>AEML vs BEST Tariff Comparison</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                For {units} units in Mumbai, comparison shows relative cost between Suburbs (AEML) and Island City (BEST).
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Adani Electricity</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#00f2fe', marginTop: '4px' }}>
                    ₹ {provider.includes('Adani') ? billResult.total_bill : comparisonBill.total_bill}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Fixed ₹140 | Wheeling ₹1.65</div>
                </div>

                <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>BEST Undertaking</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#4facfe', marginTop: '4px' }}>
                    ₹ {provider.includes('BEST') ? billResult.total_bill : comparisonBill.total_bill}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Fixed ₹120 | Wheeling ₹1.45</div>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <strong>Tariff Authority:</strong> Maharashtra Electricity Regulatory Commission (MERC)<br />
                <strong>Applicable Schedule:</strong> FY 2022-23 LT-I Residential<br />
                <strong>Difference:</strong> BEST island city rates are generally lower due to higher urban load density and lower wheeling distribution charges.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
