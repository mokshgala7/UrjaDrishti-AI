import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  fetchDatasets,
  fetchDatasetDetails,
  fetchDatasetPreview,
  fetchDatasetStatistics,
  fetchDatasetQuality,
  refreshDatasets
} from '../services/api';

export default function DatasetExplorer() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'statistics' | 'quality'
  const [datasetDetails, setDatasetDetails] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [qualityData, setQualityData] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDatasetsList();
  }, []);

  const loadDatasetsList = () => {
    setLoading(true);
    fetchDatasets()
      .then(res => {
        const list = res.data || [];
        setDatasets(list);
        if (list.length > 0 && !selectedDatasetId) {
          setSelectedDatasetId(list[0].id);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!selectedDatasetId) return;
    setPage(1);
    loadDatasetData(selectedDatasetId, 1);
  }, [selectedDatasetId]);

  useEffect(() => {
    if (!selectedDatasetId) return;
    if (activeTab === 'preview') {
      loadPreview(selectedDatasetId, page);
    } else if (activeTab === 'statistics') {
      loadStatistics(selectedDatasetId);
    } else if (activeTab === 'quality') {
      loadQuality(selectedDatasetId);
    }
  }, [selectedDatasetId, activeTab, page]);

  const loadDatasetData = (id, p = 1) => {
    fetchDatasetDetails(id).then(res => setDatasetDetails(res.data)).catch(() => {});
    loadPreview(id, p);
  };

  const loadPreview = (id, p) => {
    fetchDatasetPreview(id, p, pageSize)
      .then(res => setPreviewData(res.data))
      .catch(() => {});
  };

  const loadStatistics = (id) => {
    fetchDatasetStatistics(id)
      .then(res => setStatsData(res.data))
      .catch(() => {});
  };

  const loadQuality = (id) => {
    fetchDatasetQuality(id)
      .then(res => setQualityData(res.data))
      .catch(() => {});
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshDatasets();
      loadDatasetsList();
      if (selectedDatasetId) loadDatasetData(selectedDatasetId, page);
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const selectedMeta = datasets.find(d => d.id === selectedDatasetId) || datasetDetails;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Dataset Explorer & Registry</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Inspect raw telemetry, calibrated synthetic profiles, tariff schedules, and schema quality.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid var(--accent-cyan)',
            background: 'transparent',
            color: 'var(--accent-cyan)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {refreshing ? 'Scanning...' : '🔄 Rescan & Refresh Datasets'}
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(255, 88, 88, 0.15)', border: '1px solid #ff5858', padding: '12px', borderRadius: '8px', color: '#ff5858', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' }}>
          {/* Datasets Sidebar List */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Registered Datasets ({datasets.length})
            </h3>
            {datasets.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDatasetId(d.id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: selectedDatasetId === d.id ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                  color: selectedDatasetId === d.id ? '#fff' : 'var(--text-main)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{d.name}</span>
                <span style={{ fontSize: '11px', color: selectedDatasetId === d.id ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>
                  {d.rows.toLocaleString()} rows • {d.classification}
                </span>
              </button>
            ))}
          </div>

          {/* Dataset Details & Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {selectedMeta && (
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>{selectedMeta.name}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
                      {selectedMeta.description}
                    </p>
                  </div>

                  <a
                    href={`http://localhost:5000/api/v1/datasets/${selectedMeta.id}/download`}
                    download
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      background: 'rgba(0, 242, 254, 0.15)',
                      border: '1px solid var(--accent-cyan)',
                      color: 'var(--accent-cyan)',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    ⬇️ Download CSV
                  </a>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <div><strong>Rows:</strong> {selectedMeta.rows?.toLocaleString()}</div>
                  <div><strong>Columns:</strong> {selectedMeta.columns?.length || selectedMeta.column_count}</div>
                  <div><strong>Size:</strong> {((selectedMeta.file_size_bytes || 0) / 1024).toFixed(1)} KB</div>
                  <div><strong>Provenance:</strong> {selectedMeta.provenance}</div>
                  <div><strong>Quality Status:</strong> <span style={{ color: selectedMeta.quality_status === 'HEALTHY' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{selectedMeta.quality_status || 'HEALTHY'}</span></div>
                </div>
              </div>
            )}

            {/* View Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              {['preview', 'statistics', 'quality'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeTab === tab ? 'var(--accent-cyan)' : 'transparent',
                    color: activeTab === tab ? '#000' : 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: '13px',
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
              {activeTab === 'preview' && (
                <div>
                  <div style={{ overflowX: 'auto', maxHeight: '420px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', position: 'sticky', top: 0, background: 'var(--card-bg)' }}>
                          {previewData?.columns?.map(c => (
                            <th key={c} style={{ padding: '8px' }}>{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData?.items?.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            {previewData.columns.map(c => (
                              <td key={c} style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                                {row[c] !== null && row[c] !== undefined ? String(row[c]) : <span style={{ color: 'var(--text-muted)' }}>null</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <div>
                      Page {previewData?.pagination?.page || page} of {previewData?.pagination?.total_pages || 1} ({previewData?.pagination?.total_items || 0} total records)
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent', color: '#fff', cursor: 'pointer' }}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={previewData && page >= previewData.pagination?.total_pages}
                        style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent', color: '#fff', cursor: 'pointer' }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'statistics' && (
                <div>
                  <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '12px' }}>Summary Column Statistics</h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '8px' }}>Column</th>
                          <th style={{ padding: '8px' }}>Count</th>
                          <th style={{ padding: '8px' }}>Mean</th>
                          <th style={{ padding: '8px' }}>Std</th>
                          <th style={{ padding: '8px' }}>Min</th>
                          <th style={{ padding: '8px' }}>Median</th>
                          <th style={{ padding: '8px' }}>Max</th>
                          <th style={{ padding: '8px' }}>Missing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statsData?.statistics && Object.entries(statsData.statistics).map(([col, s]) => (
                          <tr key={col} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '8px', fontWeight: 600 }}>{col}</td>
                            <td style={{ padding: '8px' }}>{s.count}</td>
                            <td style={{ padding: '8px' }}>{s.mean}</td>
                            <td style={{ padding: '8px' }}>{s.std}</td>
                            <td style={{ padding: '8px' }}>{s.min}</td>
                            <td style={{ padding: '8px' }}>{s.median}</td>
                            <td style={{ padding: '8px' }}>{s.max}</td>
                            <td style={{ padding: '8px', color: s.missing > 0 ? '#ff5858' : '#10b981' }}>{s.missing}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'quality' && (
                <div>
                  <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '12px' }}>Data Quality Assessment</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quality Score</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
                        {qualityData?.quality_score ?? 100} / 100
                      </div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Duplicate Rows</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>
                        {qualityData?.duplicate_rows ?? 0}
                      </div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quality Status</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#00f2fe', marginTop: '4px' }}>
                        {qualityData?.status ?? 'HEALTHY'}
                      </div>
                    </div>
                  </div>

                  {qualityData?.issues?.length > 0 ? (
                    <div>
                      <h5 style={{ fontSize: '13px', color: '#f59e0b', marginBottom: '8px' }}>Detected Issues:</h5>
                      <ul style={{ fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '20px', lineHeight: 1.6 }}>
                        {qualityData.issues.map((issue, idx) => (
                          <li key={idx}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: '#10b981' }}>
                      ✓ No missing values, duplicate records, or schema anomalies detected.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
