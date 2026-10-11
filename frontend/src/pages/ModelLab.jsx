import React, { useState, useEffect } from 'react';
import ModelComparisonChart from '../components/ModelComparisonChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchModels, fetchModelComparison } from '../services/api';

export default function ModelLab() {
  const [models, setModels] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchModels(), fetchModelComparison()])
      .then(([mRes, compRes]) => {
        if (isMounted) {
          setModels(mRes.data || []);
          setComparison(compRes.data || null);
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
  if (error) return <div style={{ color: '#ff5858', padding: '24px' }}>Error loading Model Lab data: {error}</div>;

  const comparisonModels = comparison?.models || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Model Lab & Benchmarks</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
          Evaluate regression models, foundation forecasters, and clustering detectors trained on Mumbai load data.
        </p>
      </div>

      {/* Comparison Chart */}
      <ModelComparisonChart models={comparisonModels} />

      {/* Benchmark Metrics Table */}
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ fontSize: '15px', color: '#fff', marginBottom: '14px' }}>Evaluation Benchmark Metrics</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px' }}>Model</th>
                <th style={{ padding: '10px' }}>Algorithm</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px' }}>MAE (kW)</th>
                <th style={{ padding: '10px' }}>RMSE (kW)</th>
                <th style={{ padding: '10px' }}>R² Score</th>
              </tr>
            </thead>
            <tbody>
              {comparisonModels.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px', fontWeight: 600 }}>{m.name}</td>
                  <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{m.algorithm}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: m.status === 'available' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: m.status === 'available' ? '#10b981' : '#f59e0b'
                    }}>
                      {m.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>{m.metrics?.mae !== undefined ? m.metrics.mae.toFixed(4) : 'N/A'}</td>
                  <td style={{ padding: '10px' }}>{m.metrics?.rmse !== undefined ? m.metrics.rmse.toFixed(4) : 'N/A'}</td>
                  <td style={{ padding: '10px', fontWeight: 600, color: m.metrics?.r2 > 0.8 ? 'var(--accent-cyan)' : '#fff' }}>
                    {m.metrics?.r2 !== undefined ? m.metrics.r2.toFixed(4) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Registry Cards */}
      <div>
        <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '14px' }}>Model Registry Artifacts</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {models.map(m => (
            <div key={m.id} style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>{m.name}</span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: m.status === 'available' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: m.status === 'available' ? '#10b981' : '#f59e0b'
                }}>
                  {m.status}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <strong>Algorithm:</strong> {m.algorithm}
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <strong>Task:</strong> {m.task}
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <strong>Artifact Reference:</strong> <code style={{ color: 'var(--accent-cyan)' }}>{m.artifact_reference}</code>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 'auto' }}>
                <em>{m.limitations}</em>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
