import React, { useState, useEffect } from 'react';
import { fetchConsumption, fetchConsumptionPatterns } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

export default function ConsumptionChart({ household, interval = 'hourly' }) {
  const [activeView, setActiveView] = useState('timeseries'); // 'timeseries' | 'diurnal'
  const [data, setData] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    if (activeView === 'timeseries') {
      fetchConsumption({ household, interval })
        .then((res) => {
          if (isMounted) {
            setData(res.data?.records?.slice(-48) || []); // show last 48 records for clear visual density
            setLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.message);
            setLoading(false);
          }
        });
    } else {
      fetchConsumptionPatterns()
        .then((res) => {
          if (isMounted) {
            setPatterns(res.data?.hourly_profile || []);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.message);
            setLoading(false);
          }
        });
    }

    return () => { isMounted = false; };
  }, [activeView, household, interval]);

  // SVG dimensions
  const width = 800;
  const height = 260;
  const padding = 40;

  const renderTimeSeriesSVG = () => {
    if (!data.length) return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No readings available for this filter.</div>;

    const maxVal = Math.max(...data.map(d => d.consumption_kwh), 1.0) * 1.15;
    const minVal = 0;

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((d.consumption_kwh - minVal) / (maxVal - minVal)) * (height - 2 * padding);
      return { x, y, raw: d };
    });

    const pathData = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
    const areaData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
      <div style={{ position: 'relative' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          <defs>
            <linearGradient id="consumptionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#4facfe" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - padding - ratio * (height - 2 * padding);
            const val = (minVal + ratio * (maxVal - minVal)).toFixed(1);
            return (
              <g key={ratio}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <text x={padding - 8} y={y + 4} fill="var(--text-muted)" fontSize="11" textAnchor="end">{val} kW</text>
              </g>
            );
          })}

          {/* Area & Line */}
          <path d={areaData} fill="url(#consumptionGradient)" />
          <path d={pathData} fill="none" stroke="#00f2fe" strokeWidth="2.5" />

          {/* Interactive points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={hoveredPoint === i ? 6 : (p.raw.is_anomaly ? 5 : 2.5)}
              fill={p.raw.is_anomaly ? '#ff5858' : '#00f2fe'}
              stroke="#fff"
              strokeWidth={hoveredPoint === i ? 2 : 1}
              style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {hoveredPoint !== null && points[hoveredPoint] && (
          <div style={{
            position: 'absolute',
            left: `${(points[hoveredPoint].x / width) * 100}%`,
            top: `${(points[hoveredPoint].y / height) * 100}%`,
            transform: 'translate(-50%, -120%)',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--accent-cyan)',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '12px',
            color: '#fff',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            zIndex: 10
          }}>
            <div><strong>{points[hoveredPoint].raw.consumption_kwh} kW</strong></div>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{points[hoveredPoint].raw.timestamp || 'Time record'}</div>
            {points[hoveredPoint].raw.is_anomaly ? <div style={{ color: '#ff5858', fontWeight: 'bold' }}>⚠️ Anomaly Spike</div> : null}
          </div>
        )}
      </div>
    );
  };

  const renderDiurnalSVG = () => {
    if (!patterns.length) return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No pattern records found.</div>;
    const maxVal = Math.max(...patterns.map(p => p.avg_kwh), 1.0) * 1.15;
    const barWidth = (width - 2 * padding) / 24 - 4;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
        {patterns.map((p, i) => {
          const barHeight = (p.avg_kwh / maxVal) * (height - 2 * padding);
          const x = padding + i * ((width - 2 * padding) / 24) + 2;
          const y = height - padding - barHeight;
          const isPeak = p.hour >= 19 && p.hour <= 23;
          return (
            <g key={p.hour}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="3"
                fill={isPeak ? 'var(--accent-amber)' : 'var(--accent-blue)'}
                opacity={0.85}
              />
              <text x={x + barWidth / 2} y={height - padding + 16} fill="var(--text-muted)" fontSize="10" textAnchor="middle">
                {p.hour}h
              </text>
              <text x={x + barWidth / 2} y={y - 6} fill="#fff" fontSize="9" textAnchor="middle">
                {p.avg_kwh}
              </text>
            </g>
          );
        })}
      </svg>
    );
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
          <h3 style={{ fontSize: '16px', color: '#fff', margin: 0 }}>
            {activeView === 'timeseries' ? 'Electricity Consumption Telemetry (Recent 48h)' : '24-Hour Diurnal Load Profile (Mumbai Residential)'}
          </h3>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Unit: kW | Source: Verified calibrated Mumbai smart-meter series
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveView('timeseries')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: activeView === 'timeseries' ? 'var(--accent-cyan)' : 'transparent',
              color: activeView === 'timeseries' ? '#000' : '#fff',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Time Series
          </button>
          <button
            onClick={() => setActiveView('diurnal')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: activeView === 'diurnal' ? 'var(--accent-amber)' : 'transparent',
              color: activeView === 'diurnal' ? '#000' : '#fff',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            24h Diurnal Pattern
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div style={{ color: '#ff5858', padding: '20px' }}>Error: {error}</div>
      ) : activeView === 'timeseries' ? (
        renderTimeSeriesSVG()
      ) : (
        renderDiurnalSVG()
      )}
    </div>
  );
}
