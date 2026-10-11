import React, { useState } from 'react';

export default function ModelComparisonChart({ models = [] }) {
  const [metricTab, setMetricTab] = useState('r2'); // 'r2' | 'mae' | 'rmse'

  const validModels = models.filter(m => m.metrics && m.metrics[metricTab] !== undefined && m.metrics[metricTab] !== null);

  const width = 760;
  const height = 240;
  const padding = 50;

  if (validModels.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px' }}>
        No evaluation metrics available to compare.
      </div>
    );
  }

  const values = validModels.map(m => m.metrics[metricTab]);
  const maxVal = metricTab === 'r2' ? 1.0 : Math.max(...values, 0.1) * 1.2;
  const minVal = 0;

  const barWidth = (width - 2 * padding) / validModels.length - 30;

  const metricLabels = {
    r2: 'R² Score (Goodness of Fit, higher is better)',
    mae: 'Mean Absolute Error (kW, lower is better)',
    rmse: 'Root Mean Squared Error (kW, lower is better)'
  };

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', color: '#fff', margin: 0 }}>Model Performance Benchmarking</h3>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {metricLabels[metricTab]} • Evaluated on 20% holdout chronological test split
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['r2', 'mae', 'rmse'].map(m => (
            <button
              key={m}
              onClick={() => setMetricTab(m)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: metricTab === m ? 'var(--accent-blue)' : 'transparent',
                color: metricTab === m ? '#fff' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = height - padding - ratio * (height - 2 * padding);
          const val = (minVal + ratio * (maxVal - minVal)).toFixed(2);
          return (
            <g key={ratio}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
              <text x={padding - 8} y={y + 4} fill="var(--text-muted)" fontSize="11" textAnchor="end">{val}</text>
            </g>
          );
        })}

        {/* Bars */}
        {validModels.map((m, i) => {
          const val = m.metrics[metricTab];
          const barHeight = Math.max(4, (val / maxVal) * (height - 2 * padding));
          const x = padding + i * ((width - 2 * padding) / validModels.length) + 15;
          const y = height - padding - barHeight;
          const color = i === 0 ? 'var(--accent-cyan)' : (i === 1 ? 'var(--accent-blue)' : 'var(--accent-amber)');

          return (
            <g key={m.id}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill={color}
                opacity={0.9}
              />
              <text x={x + barWidth / 2} y={y - 8} fill="#fff" fontSize="12" fontWeight="600" textAnchor="middle">
                {val.toFixed(4)}
              </text>
              <text x={x + barWidth / 2} y={height - padding + 18} fill="var(--text-muted)" fontSize="11" textAnchor="middle">
                {m.name.replace(' Regressor', '')}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
