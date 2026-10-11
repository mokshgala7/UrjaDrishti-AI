import React, { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchEnvironmentalSummary, calculateEnvironmental, fetchEnvironmentalTrends } from '../services/api';

export default function EnvironmentalImpact() {
  const [summary, setSummary] = useState(null);
  const [calculatorUnits, setCalculatorUnits] = useState(300);
  const [calcResult, setCalcResult] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calcLoading, setCalcLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchEnvironmentalSummary(),
      fetchEnvironmentalTrends('daily'),
      calculateEnvironmental(300)
    ])
      .then(([sumRes, trendRes, calcRes]) => {
        if (isMounted) {
          setSummary(sumRes.data);
          setTrends(trendRes.data?.records?.slice(-30) || []); // last 30 days
          setCalcResult(calcRes.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, []);

  const handleCalculate = async () => {
    setCalcLoading(true);
    try {
      const res = await calculateEnvironmental(calculatorUnits);
      setCalcResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCalcLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const width = 760;
  const height = 200;
  const padding = 40;
  const maxCo2 = Math.max(...trends.map(t => t.co2_kg), 1.0) * 1.15;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Environmental Impact & Carbon Intelligence</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
          Evaluate Scope 2 greenhouse gas emissions from electricity consumption using Central Electricity Authority (CEA) India grid factors.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(255, 88, 88, 0.15)', border: '1px solid #ff5858', padding: '12px', borderRadius: '8px', color: '#ff5858', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <MetricCard
          title="Total Scope 2 Emissions"
          value={summary?.co2_emissions_kg?.toLocaleString()}
          unit="kg CO2"
          change={`${summary?.co2_emissions_tonnes} Metric Tonnes`}
          changeType="negative"
        />
        <MetricCard
          title="Tree Offsets Required"
          value={summary?.trees_equivalent_annual}
          unit="trees/year"
          change="~21.77 kg CO2 / tree / yr"
          changeType="neutral"
        />
        <MetricCard
          title="CEA Grid Baseline Factor"
          value={summary?.emission_factor_kg_per_kwh}
          unit="kg/kWh"
          change="Indian Western / Maha Grid Mix"
          changeType="positive"
        />
        <MetricCard
          title="Monitored Load"
          value={summary?.total_consumption_kwh?.toLocaleString()}
          unit="kWh"
          change="Smart-meter archive"
          changeType="neutral"
        />
      </div>

      {/* Interactive Carbon Calculator */}
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '12px' }}>Interactive Household Carbon Calculator</h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>
              Monthly Consumption: {calculatorUnits} kWh
            </label>
            <input
              type="range"
              min="0"
              max="1500"
              step="25"
              value={calculatorUnits}
              onChange={(e) => setCalculatorUnits(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
            />
          </div>

          <button
            onClick={handleCalculate}
            disabled={calcLoading}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--accent-blue)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {calcLoading ? 'Calculating...' : 'Recalculate Footprint'}
          </button>
        </div>

        {calcResult && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Calculated CO2 Footprint</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-amber)', marginTop: '4px' }}>
                {calcResult.co2_emissions_kg} <span style={{ fontSize: '14px', fontWeight: 400 }}>kg CO2</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Required Tree Absorption Offset</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
                {calcResult.trees_offset_required} <span style={{ fontSize: '14px', fontWeight: 400 }}>trees/year</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CO2 Emissions Trend Chart */}
      {trends.length > 0 && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '4px' }}>Daily Carbon Emission Trend (Recent 30 Days)</h3>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Calculated as: Daily Consumption (kWh) × 0.716 kg CO2/kWh
          </div>

          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
            {trends.map((t, i) => {
              const barH = (t.co2_kg / maxCo2) * (height - 2 * padding);
              const x = padding + i * ((width - 2 * padding) / trends.length);
              const y = height - padding - barH;
              return (
                <g key={i}>
                  <rect
                    x={x + 1}
                    y={y}
                    width={((width - 2 * padding) / trends.length) - 2}
                    height={barH}
                    rx="2"
                    fill="var(--accent-blue)"
                    opacity={0.8}
                  />
                </g>
              );
            })}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.2)" />
          </svg>
        </div>
      )}

      {/* Methodology and Data Governance Alert */}
      <div style={{
        background: 'rgba(79, 172, 254, 0.1)',
        border: '1px solid rgba(79, 172, 254, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        lineHeight: 1.6
      }}>
        <strong style={{ color: '#fff' }}>Methodology & Source Attributions:</strong><br />
        1. <strong>Emission Factor:</strong> 0.716 kg CO2/kWh derived from the official Central Electricity Authority (CEA) Baseline Carbon Database for the Indian Power Sector.<br />
        2. <strong>Tree Sequestration Baseline:</strong> Calculated at ~21.77 kg CO2 per mature tree annually, reflecting standard arboricultural carbon sequestration rates.<br />
        3. <strong>Analytical Rigor:</strong> Figures represent estimated indirect Scope 2 emissions based on grid electricity consumption; does not assume synthetic readings directly measure renewable generation.
      </div>
    </div>
  );
}
