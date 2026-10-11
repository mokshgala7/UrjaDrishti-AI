import React, { useState, useEffect } from 'react';
import { calculateBill, calculateEnvironmental } from '../services/api';
import {
  MeterCharacterHeader,
  LeafImpactMascot,
  SavingsCelebrationCard
} from '../components/illustrations/MascotComponents';

export default function Calculator() {
  // Calculator Inputs
  const [provider, setProvider] = useState('Adani Electricity');
  const [units, setUnits] = useState(350);
  const [financialYear, setFinancialYear] = useState('FY 2022-23');
  const [showEnvironmental, setShowEnvironmental] = useState(true);
  const [savingsPercent, setSavingsPercent] = useState(null); // null, 5, 10, or 20

  // Calculation Results
  const [billResult, setBillResult] = useState(null);
  const [savingsResult, setSavingsResult] = useState(null);
  const [envResult, setEnvResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch bill calculation whenever inputs change (debounced for smooth slider interaction)
  useEffect(() => {
    let isCancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        // Main bill calculation via backend
        const billResponse = await calculateBill(provider, units, financialYear);
        if (!isCancelled) {
          setBillResult(billResponse.data);
        }

        // Environmental calculation via backend if enabled
        if (showEnvironmental && units >= 0) {
          const envResponse = await calculateEnvironmental(units);
          if (!isCancelled) {
            setEnvResult(envResponse.data);
          }
        }

        // If savings reduction option is active, calculate the scenario
        if (savingsPercent && billResponse.data?.total_bill != null) {
          const reducedUnits = Math.max(0, Math.round(units * (1 - savingsPercent / 100)));
          const reducedBillResponse = await calculateBill(provider, reducedUnits, financialYear);
          if (!isCancelled) {
            setSavingsResult({
              reducedUnits,
              reducedBill: reducedBillResponse.data?.total_bill,
              unitReduction: units - reducedUnits
            });
          }
        } else {
          setSavingsResult(null);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Unable to connect to calculation service.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }, 120);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [provider, units, financialYear, showEnvironmental, savingsPercent]);

  // Handle savings button click
  const handleSavingsToggle = (percent) => {
    if (savingsPercent === percent) {
      setSavingsPercent(null);
    } else {
      setSavingsPercent(percent);
    }
  };

  const isCalculable = billResult && billResult.calculation_status !== 'not_calculable_no_verified_tariff';

  return (
    <div style={{ paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* PAGE HEADER */}
        <div style={{
          textAlign: 'center',
          maxWidth: '680px',
          margin: '32px auto 44px auto'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--soft-lime)',
            color: 'var(--primary-forest)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '14px'
          }}>
            ⚡ ELECTRICITY COST CALCULATOR
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--text-charcoal)',
            marginBottom: '12px'
          }}>
            Your electricity, made easier to understand.
          </h1>

          <p style={{
            fontSize: '17px',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            margin: 0
          }}>
            Estimate your monthly electricity bill and explore its environmental impact.
          </p>
        </div>

        {/* ERROR NOTICE */}
        {error && (
          <div style={{
            backgroundColor: 'var(--status-warning-bg)',
            border: '1px solid var(--status-warning-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '24px',
            color: 'var(--status-warning-text)',
            fontSize: '14px'
          }}>
            <strong>Notice:</strong> {error}
          </div>
        )}

        {/* 2-COLUMN CALCULATOR INTERFACE */}
        <div className="calculator-grid">
          {/* ==================================================== */}
          {/* LEFT COLUMN: CALCULATOR INPUT FORM */}
          {/* ==================================================== */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '36px 32px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 800,
              color: 'var(--primary-forest)',
              letterSpacing: '-0.01em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>Calculator Inputs</span>
            </h2>

            {/* INPUT 1: ELECTRICITY PROVIDER */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--text-charcoal)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '10px'
              }}>
                1. Electricity Provider
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                <button
                  type="button"
                  onClick={() => setProvider('Adani Electricity')}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: provider.includes('Adani')
                      ? '2px solid var(--primary-forest)'
                      : '1px solid var(--border-light)',
                    backgroundColor: provider.includes('Adani')
                      ? 'var(--bg-lime-soft)'
                      : '#FFFFFF',
                    color: provider.includes('Adani')
                      ? 'var(--primary-forest)'
                      : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '14px',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>⚡</span>
                    <div>
                      <div>Adani Electricity</div>
                      <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>
                        Mumbai Suburbs (AEML-D)
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('BEST Undertaking')}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: provider.includes('BEST')
                      ? '2px solid var(--primary-forest)'
                      : '1px solid var(--border-light)',
                    backgroundColor: provider.includes('BEST')
                      ? 'var(--bg-lime-soft)'
                      : '#FFFFFF',
                    color: provider.includes('BEST')
                      ? 'var(--primary-forest)'
                      : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '14px',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>💡</span>
                    <div>
                      <div>BEST Undertaking</div>
                      <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>
                        Island City
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* INPUT 2: MONTHLY ELECTRICITY CONSUMPTION */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <label style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--text-charcoal)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  2. Monthly Consumption
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  <input
                    type="number"
                    min="0"
                    max="1500"
                    step="1"
                    value={units}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setUnits(isNaN(val) ? 0 : Math.max(0, Math.min(1500, val)));
                    }}
                    style={{
                      width: '64px',
                      padding: '4px 0',
                      border: 'none',
                      backgroundColor: 'transparent',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: 'var(--primary-forest)',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)' }}>
                    kWh
                  </span>
                </div>
              </div>

              {/* Range Slider */}
              <div style={{ margin: '14px 0 8px 0' }}>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="5"
                  value={units}
                  onChange={(e) => setUnits(parseInt(e.target.value) || 0)}
                  aria-label="Monthly electricity consumption slider"
                />
              </div>

              {/* Slider scale ticks & helper */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'var(--text-muted)',
                fontWeight: 600
              }}>
                <span>0 kWh</span>
                <span>250</span>
                <span>500</span>
                <span>750</span>
                <span>1000+ kWh</span>
              </div>

              {/* Helper badge */}
              <div style={{
                marginTop: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-cream)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)'
              }}>
                <span>💡</span>
                <span>1 electricity unit = 1 kWh</span>
              </div>
            </div>

            {/* INPUT 3: BILLING PERIOD */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--text-charcoal)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '10px'
              }}>
                3. Billing Period & Verified Tariff
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setFinancialYear('FY 2022-23')}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: financialYear === 'FY 2022-23'
                      ? '2px solid var(--primary-forest)'
                      : '1px solid var(--border-light)',
                    backgroundColor: financialYear === 'FY 2022-23'
                      ? 'var(--bg-lime-soft)'
                      : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '14px',
                      color: financialYear === 'FY 2022-23' ? 'var(--primary-forest)' : 'var(--text-charcoal)'
                    }}>
                      FY 2022-23 Schedule
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      MERC Official LT-I Residential Tariff Order
                    </div>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: 'var(--fresh-green)',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    Verified
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFinancialYear('FY 2024-25')}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: financialYear === 'FY 2024-25'
                      ? '2px solid var(--status-warning-border)'
                      : '1px solid var(--border-light)',
                    backgroundColor: financialYear === 'FY 2024-25'
                      ? 'var(--status-warning-bg)'
                      : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '14px',
                      color: financialYear === 'FY 2024-25' ? 'var(--status-warning-text)' : 'var(--text-charcoal)'
                    }}>
                      FY 2024-25 Schedule
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Official order records not extracted into dataset
                    </div>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: 'var(--status-warning-bg)',
                    border: '1px solid var(--status-warning-border)',
                    color: 'var(--status-warning-text)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    Unavailable
                  </span>
                </button>
              </div>
            </div>

            {/* INPUT 4: OPTIONAL ENVIRONMENTAL TOGGLE */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '1px solid var(--border-light)'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-charcoal)' }}>
                  Include Environmental Impact
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Calculate associated CO₂ emissions and tree equivalence
                </div>
              </div>

              <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px' }}>
                <input
                  type="checkbox"
                  checked={showEnvironmental}
                  onChange={(e) => setShowEnvironmental(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                  aria-label="Toggle environmental calculation"
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: showEnvironmental ? 'var(--primary-forest)' : '#D1D5DB',
                  borderRadius: '26px',
                  transition: '0.2s'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '20px',
                    width: '20px',
                    left: showEnvironmental ? '24px' : '3px',
                    bottom: '3px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '50%',
                    transition: '0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </span>
              </label>
            </div>
          </div>

          {/* ==================================================== */}
          {/* RIGHT COLUMN: LIVE RESULTS PANEL */}
          {/* ==================================================== */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '36px 32px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Interactive Cute Meter Character Header */}
            <MeterCharacterHeader units={units} />

            {/* INITIAL LOADING STATE */}
            {loading && !billResult && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: 'var(--bg-cream)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-muted)'
              }}>
                <div style={{ fontSize: '28px', marginBottom: '8px', animation: 'swaySoft 1.5s ease-in-out infinite' }}>
                  ⚡
                </div>
                <div style={{ fontWeight: 700, color: 'var(--primary-forest)', fontSize: '15px' }}>
                  Loading Verified Tariff Engine...
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  Connecting to official MERC LT-I residential schedules
                </div>
              </div>
            )}

            {/* STATUS: UNVERIFIED TARIFF BANNER */}
            {!isCalculable && billResult && (
              <div style={{
                backgroundColor: 'var(--status-warning-bg)',
                border: '1px solid var(--status-warning-border)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                color: 'var(--status-warning-text)'
              }}>
                <div style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>⚠️</span>
                  <span>Calculation Unavailable for {financialYear}</span>
                </div>
                <p style={{ fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                  {billResult.message || 'Official tariff orders for this period have not been verified in the dataset registry. UrjaDrishti AI never presents unverified tariffs as official data.'}
                </p>
              </div>
            )}

            {/* RESULT 1: ESTIMATED MONTHLY ELECTRICITY BILL */}
            {isCalculable && (
              <div>
                <div style={{
                  backgroundColor: 'var(--bg-cream)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px 28px',
                  border: '1px solid var(--border-light)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '6px'
                  }}>
                    Estimated Monthly Bill
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(36px, 4.5vw, 48px)',
                    fontWeight: 800,
                    color: 'var(--primary-forest)',
                    lineHeight: 1.1
                  }}>
                    ₹{billResult.total_bill?.toLocaleString()}
                  </div>

                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginTop: '6px'
                  }}>
                    {billResult.provider} • {billResult.financial_year}
                  </div>

                  {/* Status Label explaining verified data & missing FAC */}
                  <div style={{
                    marginTop: '16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--status-warning-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: 'var(--status-warning-text)',
                    textAlign: 'left',
                    lineHeight: 1.4
                  }}>
                    <strong>Notice:</strong> Incomplete estimate. Excludes monthly Fuel Adjustment Charge (FAC) as variable rates are not in current dataset. 16% Maharashtra Electricity Duty is included.
                  </div>
                </div>

                {/* RESULT 2: COST BREAKDOWN */}
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    color: 'var(--text-charcoal)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    marginBottom: '14px'
                  }}>
                    Cost Breakdown
                  </h3>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    fontSize: '14px'
                  }}>
                    {/* Fixed Charge */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid var(--border-light)'
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Fixed Charge</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-charcoal)' }}>
                        ₹{billResult.fixed_charges?.toFixed(2)}
                      </span>
                    </div>

                    {/* Wheeling Charge */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid var(--border-light)'
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Wheeling Charge</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-charcoal)' }}>
                        ₹{billResult.wheeling_charges?.toFixed(2)}
                      </span>
                    </div>

                    {/* Energy Charge */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid var(--border-light)'
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Energy Charge (Tiered)</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-charcoal)' }}>
                        ₹{billResult.energy_charges?.toFixed(2)}
                      </span>
                    </div>

                    {/* Electricity Duty */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid var(--border-light)'
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Electricity Duty (16%)</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-charcoal)' }}>
                        ₹{billResult.electricity_duty?.toFixed(2)}
                      </span>
                    </div>

                    {/* FAC - Clearly disclosed as excluded */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid var(--border-light)',
                      color: 'var(--text-muted)',
                      fontSize: '13px'
                    }}>
                      <span>Fuel Adjustment Charge (FAC)</span>
                      <span style={{ fontStyle: 'italic', color: '#92400E' }}>
                        Excluded (Not in dataset)
                      </span>
                    </div>

                    {/* Total */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 0 4px 0',
                      fontWeight: 800,
                      fontSize: '16px',
                      color: 'var(--primary-forest)'
                    }}>
                      <span>Total Estimated Bill</span>
                      <span>₹{billResult.total_bill?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* RESULT 3: ENVIRONMENTAL IMPACT */}
                {showEnvironmental && envResult && (
                  <LeafImpactMascot
                    co2Kg={envResult.co2_emissions_kg}
                    treesOffset={envResult.trees_offset_required}
                  />
                )}

                {/* RESULT 4: SIMPLE SAVINGS EXPLORER */}
                <div style={{
                  marginTop: '28px',
                  paddingTop: '24px',
                  borderTop: '1px solid var(--border-light)'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: 'var(--text-charcoal)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    marginBottom: '8px'
                  }}>
                    Explore What Happens If You Save
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 14px 0' }}>
                    Select a reduction scenario to recalculate through non-linear tariff tiers.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[5, 10, 20].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleSavingsToggle(pct)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: savingsPercent === pct
                            ? '2px solid var(--primary-forest)'
                            : '1px solid var(--border-light)',
                          backgroundColor: savingsPercent === pct
                            ? 'var(--soft-lime)'
                            : 'var(--bg-subtle)',
                          color: 'var(--primary-forest)',
                          fontWeight: 700,
                          fontSize: '13px',
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        Reduce {pct}%
                      </button>
                    ))}
                  </div>

                  {savingsPercent && savingsResult && savingsResult.reducedBill != null && (
                    <SavingsCelebrationCard
                      originalBill={billResult.total_bill}
                      reducedBill={savingsResult.reducedBill}
                      percent={savingsPercent}
                      unitReduction={savingsResult.unitReduction}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
