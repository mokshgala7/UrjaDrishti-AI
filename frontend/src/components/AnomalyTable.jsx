import React, { useState } from 'react';

export default function AnomalyTable({ anomalies = [], onFilterSeverity, selectedSeverity }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = anomalies.filter(a => {
    if (searchTerm) {
      const matchSearch = a.timestamp.includes(searchTerm) || a.anomaly_type.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;
    }
    return true;
  });

  const getSeverityStyle = (sev) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL':
        return { background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444' };
      case 'HIGH':
        return { background: 'rgba(249, 115, 22, 0.2)', color: '#f97316', border: '1px solid #f97316' };
      case 'MEDIUM':
        return { background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid #f59e0b' };
      default:
        return { background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid #3b82f6' };
    }
  };

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '16px', color: '#fff', margin: 0 }}>Detected Anomaly Incidents</h3>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Model-inferred telemetry deviations. Note: Distinct from confirmed utility hardware fault tickets.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search timestamp / type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: '#fff',
              fontSize: '12px'
            }}
          />

          <select
            value={selectedSeverity || ''}
            onChange={(e) => onFilterSeverity?.(e.target.value || null)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: '#fff',
              fontSize: '12px'
            }}
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px' }}>Timestamp</th>
              <th style={{ padding: '10px' }}>Household</th>
              <th style={{ padding: '10px' }}>Observed</th>
              <th style={{ padding: '10px' }}>Baseline</th>
              <th style={{ padding: '10px' }}>Deviation</th>
              <th style={{ padding: '10px' }}>Type</th>
              <th style={{ padding: '10px' }}>Severity</th>
              <th style={{ padding: '10px' }}>Detector</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No anomalies match the selected filters.
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.anomaly_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px' }}>{a.timestamp}</td>
                  <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{a.household_id}</td>
                  <td style={{ padding: '10px', fontWeight: 600, color: '#ff5858' }}>{a.actual_kwh} kW</td>
                  <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{a.expected_kwh} kW</td>
                  <td style={{ padding: '10px', color: a.deviation_kwh > 0 ? '#ff5858' : '#10b981' }}>
                    {a.deviation_kwh > 0 ? `+${a.deviation_kwh}` : a.deviation_kwh} kW
                  </td>
                  <td style={{ padding: '10px', fontSize: '12px' }}>{a.anomaly_type.replace(/_/g, ' ')}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      ...getSeverityStyle(a.severity)
                    }}>
                      {a.severity}
                    </span>
                  </td>
                  <td style={{ padding: '10px', color: 'var(--text-muted)', fontSize: '11px' }}>
                    {a.detection_method.split(' ')[0]}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
