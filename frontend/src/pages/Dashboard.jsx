import React, { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import ConsumptionChart from '../components/ConsumptionChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchDashboardSummary, fetchEnvironmentalSummary, fetchHouseholds } from '../services/api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [environmental, setEnvironmental] = useState(null);
  const [households, setHouseholds] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchDashboardSummary(),
      fetchEnvironmentalSummary(),
      fetchHouseholds()
    ])
      .then(([sumRes, envRes, hhRes]) => {
        if (isMounted) {
          setSummary(sumRes.data);
          setEnvironmental(envRes.data);
          setHouseholds(hhRes.data || []);
          if (hhRes.data && hhRes.data.length > 0) {
            setSelectedHousehold(hhRes.data[0].id);
          }
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

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ color: '#ff5858', padding: '24px' }}>Error loading dashboard data: {error}</div>;

  const todayUsage = summary?.consumption?.today_usage_kwh ?? 0;
  const peakLoad = summary?.peak_load?.peak_kw ?? 0;
  const peakTime = summary?.peak_load?.timestamp ? summary.peak_load.timestamp.split(' ')[1] : 'Peak recorded';
  const readingsCount = summary?.readings_count ?? 0;
  const anomalyCount = summary?.anomalies?.count ?? 0;
  const co2Emissions = environmental?.co2_emissions_kg ?? 0;
  const treesNeeded = environmental?.trees_equivalent_annual ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Energy Operations Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Mumbai Grid Zone (Adani Electricity & BEST Distribution) • Real-time telemetry analytics
          </p>
        </div>

        {households.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Household:</span>
            <select
              value={selectedHousehold}
              onChange={(e) => setSelectedHousehold(e.target.value)}
              style={{
                background: 'var(--bg-secondary)',
                color: '#fff',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '13px'
              }}
            >
              {households.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        <MetricCard
          title="Recent 24h Usage"
          value={todayUsage.toFixed(1)}
          unit="kWh"
          change="Smart-meter rollup"
          changeType="positive"
        />
        <MetricCard
          title="Peak Load Detected"
          value={peakLoad.toFixed(2)}
          unit="kW"
          change={`Recorded at ${peakTime}`}
          changeType="neutral"
        />
        <MetricCard
          title="Historical Readings"
          value={readingsCount.toLocaleString()}
          unit="records"
          change={summary?.date_range?.start ? `From ${summary.date_range.start.split(' ')[0]}` : 'Telemetry archive'}
          changeType="positive"
        />
        <MetricCard
          title="CO2 Footprint (CEA Factor)"
          value={co2Emissions.toLocaleString()}
          unit="kg CO2"
          change={`~${treesNeeded} mature trees to offset`}
          changeType="negative"
        />
        <MetricCard
          title="Anomalies Flagged"
          value={anomalyCount}
          unit="events"
          change={anomalyCount > 0 ? "Spikes under inspection" : "Stable profile"}
          changeType={anomalyCount > 0 ? "negative" : "positive"}
        />
      </div>

      <ConsumptionChart household={selectedHousehold} />
    </div>
  );
}
