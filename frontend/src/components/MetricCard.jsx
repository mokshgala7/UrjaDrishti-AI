import React from 'react';

export default function MetricCard({ title, value, unit, change, changeType }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '20px'
    }}>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{title}</div>
      <div style={{ fontSize: '26px', fontWeight: 700, margin: '8px 0' }}>
        {value} <span style={{ fontSize: '16px', fontWeight: 400 }}>{unit}</span>
      </div>
      {change && (
        <div style={{ fontSize: '12px', color: changeType === 'positive' ? '#10b981' : '#f43f5e' }}>
          {change}
        </div>
      )}
    </div>
  );
}
