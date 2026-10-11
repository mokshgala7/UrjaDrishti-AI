import React, { useState, useEffect } from 'react';
import AnomalyTable from '../components/AnomalyTable';
import MetricCard from '../components/MetricCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchAnomalies, fetchAnomalySummary } from '../services/api';

export default function AnomalyMonitor() {
  const [anomalies, setAnomalies] = useState([]);
  const [summary, setSummary] = useState(null);
  const [severityFilter, setSeverityFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchAnomalies({ severity: severityFilter, limit: 100 }),
      fetchAnomalySummary()
    ])
      .then(([anoRes, sumRes]) => {
        if (isMounted) {
          setAnomalies(anoRes.data || []);
          setSummary(sumRes.data || null);
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
  }, [severityFilter]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ color: '#ff5858', padding: '24px' }}>Error loading anomaly data: {error}</div>;

  const totalCount = summary?.total_anomalies || anomalies.length;
  const criticalCount = summary?.severity_breakdown?.CRITICAL || 0;
  const highCount = summary?.severity_breakdown?.HIGH || 0;
  const hourlyDist = summary?.hourly_distribution || [];

  const maxHourCount = Math.max(...hourlyDist.map(h => h.count), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Anomaly Monitor & Grid Health</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
          Isolation Forest & diurnal deviation detector identifying household load spikes and abnormal surges.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <MetricCard
          title="Total Inferred Anomalies"
          value={totalCount}
          unit="events"
          change="Trained Isolation Forest"
          changeType="neutral"
        />
        <MetricCard
          title="Critical Severity Spikes"
          value={criticalCount}
          unit="events"
          change="Deviation score < -0.7"
          changeType="negative"
        />
        <MetricCard
          title="High Severity Events"
          value={highCount}
          unit="events"
          change="Off-peak power surge"
          changeType="negative"
        />
        <MetricCard
          title="Active Model"
          value="Isolation Forest"
          unit=""
          change="3% contamination factor"
          changeType="positive"
        />
      </div>

      {/* Hourly Anomaly Distribution Chart */}
      {hourlyDist.length > 0 && (
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '15px', color: '#fff', marginBottom: '4px' }}>Diurnal Anomaly Distribution (Hour of Day)</h3>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Frequency of anomalous spikes across 24-hour cycle. Notice peaks during Mumbai evening transition hours.
          </div>

          <svg viewBox="0 0 760 140" style={{ width: '100%', height: 'auto' }}>
            {hourlyDist.map((h, i) => {
              const barH = Math.max(2, (h.count / maxHourCount) * 80);
              const x = 30 + i * ((760 - 60) / 24);
              const y = 110 - barH;
              const isPeakHour = h.hour >= 18 && h.hour <= 23;
              return (
                <g key={h.hour}>
                  <rect
                    x={x + 2}
                    y={y}
                    width={22}
                    height={barH}
                    rx="3"
                    fill={isPeakHour ? '#ff5858' : 'var(--accent-amber)'}
                    opacity={0.85}
                  />
                  <text x={x + 13} y={125} fill="var(--text-muted)" fontSize="9" textAnchor="middle">
                    {h.hour}
                  </text>
                  {h.count > 0 && (
                    <text x={x + 13} y={y - 4} fill="#fff" fontSize="9" textAnchor="middle">
                      {h.count}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Anomaly Table */}
      <AnomalyTable
        anomalies={anomalies}
        onFilterSeverity={setSeverityFilter}
        selectedSeverity={severityFilter}
      />
    </div>
  );
}
