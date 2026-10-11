import React, { useState } from 'react';

export default function PredictionChart({ forecastData = [], unit = "kWh" }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!forecastData || forecastData.length === 0) {
    return (
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '30px',
        textAlign: 'center',
        color: 'var(--text-muted)'
      }}>
        No forecast data generated. Select a horizon and click "Generate Forecast".
      </div>
    );
  }

  const width = 800;
  const height = 260;
  const padding = 40;

  const maxVal = Math.max(...forecastData.map(d => d.confidence_upper || d.predicted_kwh), 1.0) * 1.15;
  const minVal = 0;

  const points = forecastData.map((d, i) => {
    const x = padding + (i / (forecastData.length - 1 || 1)) * (width - 2 * padding);
    const yPred = height - padding - ((d.predicted_kwh - minVal) / (maxVal - minVal)) * (height - 2 * padding);
    const yLow = height - padding - (((d.confidence_lower || d.predicted_kwh * 0.9) - minVal) / (maxVal - minVal)) * (height - 2 * padding);
    const yHigh = height - padding - (((d.confidence_upper || d.predicted_kwh * 1.1) - minVal) / (maxVal - minVal)) * (height - 2 * padding);
    return { x, yPred, yLow, yHigh, raw: d };
  });

  const predLine = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.yPred}`, '');
  
  // Upper and lower bounds for confidence band
  const upperLine = points.map(p => `${p.x},${p.yHigh}`).join(' ');
  const lowerLineRev = [...points].reverse().map(p => `${p.x},${p.yLow}`).join(' ');
  const confidenceBand = `M ${upperLine} L ${lowerLineRev} Z`;

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '20px',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <h3 style={{ fontSize: '16px', color: '#fff', margin: 0 }}>Predicted Load Forecast & Confidence Interval</h3>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Multi-step forecast horizon with uncertainty bounds (±12% confidence cone)
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', background: 'var(--accent-cyan)', display: 'inline-block' }} /> Forecast
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '10px', background: 'rgba(0, 242, 254, 0.2)', display: 'inline-block' }} /> Uncertainty Band
          </span>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - padding - ratio * (height - 2 * padding);
            const val = (minVal + ratio * (maxVal - minVal)).toFixed(1);
            return (
              <g key={ratio}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <text x={padding - 8} y={y + 4} fill="var(--text-muted)" fontSize="11" textAnchor="end">{val} {unit}</text>
              </g>
            );
          })}

          {/* Uncertainty cone */}
          <path d={confidenceBand} fill="rgba(0, 242, 254, 0.15)" stroke="rgba(0, 242, 254, 0.25)" strokeDasharray="3 3" />

          {/* Predicted line */}
          <path d={predLine} fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5" />

          {/* Interactive points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.yPred}
              r={hoveredIdx === i ? 6 : 3}
              fill="var(--accent-cyan)"
              stroke="#fff"
              strokeWidth={hoveredIdx === i ? 2 : 1}
              style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        {hoveredIdx !== null && points[hoveredIdx] && (
          <div style={{
            position: 'absolute',
            left: `${(points[hoveredIdx].x / width) * 100}%`,
            top: `${(points[hoveredIdx].yPred / height) * 100}%`,
            transform: 'translate(-50%, -120%)',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--accent-cyan)',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '12px',
            color: '#fff',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            zIndex: 10
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
              {points[hoveredIdx].raw.predicted_kwh} {unit}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>
              Bounds: [{points[hoveredIdx].raw.confidence_lower} - {points[hoveredIdx].raw.confidence_upper} {unit}]
            </div>
            <div style={{ color: '#fff', fontSize: '11px', marginTop: '2px' }}>
              {points[hoveredIdx].raw.timestamp || `Hour +${points[hoveredIdx].raw.hour}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
