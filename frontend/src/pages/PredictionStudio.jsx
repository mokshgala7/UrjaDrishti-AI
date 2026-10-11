import React, { useState, useEffect } from 'react';
import PredictionChart from '../components/PredictionChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchPrediction, fetchForecast, fetchPredictionHistory, fetchModels } from '../services/api';

export default function PredictionStudio() {
  const [temperature, setTemperature] = useState(31.5);
  const [humidity, setHumidity] = useState(72);
  const [hour, setHour] = useState(19);
  const [dayOfWeek, setDayOfWeek] = useState(2);
  const [selectedModel, setSelectedModel] = useState('random_forest');
  const [horizon, setHorizon] = useState(24);

  const [pointPrediction, setPointPrediction] = useState(null);
  const [forecastResult, setForecastResult] = useState([]);
  const [history, setHistory] = useState([]);
  const [models, setModels] = useState([]);

  const [loadingPred, setLoadingPred] = useState(false);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModels()
      .then(res => setModels(res.data || []))
      .catch(() => {});

    loadHistory();
    handleGenerateForecast(24, 'random_forest');
  }, []);

  const loadHistory = () => {
    fetchPredictionHistory(10)
      .then(res => setHistory(res.data || []))
      .catch(() => {});
  };

  const handlePredictPoint = async () => {
    setLoadingPred(true);
    setError(null);
    try {
      const res = await fetchPrediction({
        temperature,
        humidity,
        hour,
        day_of_week: dayOfWeek,
        model_id: selectedModel
      });
      setPointPrediction(res.data);
      loadHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPred(false);
    }
  };

  const handleGenerateForecast = async (h = horizon, m = selectedModel) => {
    setLoadingForecast(true);
    setError(null);
    try {
      const res = await fetchForecast({ horizon_hours: h, model_id: m });
      setForecastResult(res.data?.forecast || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingForecast(false);
    }
  };

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Prediction Studio</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
          Simulate household electricity consumption with supervised regressors and multi-step time-series forecasting.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(255, 88, 88, 0.15)', border: '1px solid #ff5858', padding: '12px 16px', borderRadius: '8px', color: '#ff5858', fontSize: '13px' }}>
          <strong>Notification:</strong> {error}
        </div>
      )}

      {/* Control Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* Weather & Calendar Parameters */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: '#fff', marginBottom: '16px' }}>Simulated Environmental Inputs</h3>
          
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span>Ambient Temperature:</span>
              <strong>{temperature}°C</strong>
            </div>
            <input
              type="range"
              min="18"
              max="45"
              step="0.5"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span>Relative Humidity:</span>
              <strong>{humidity}%</strong>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              value={humidity}
              onChange={(e) => setHumidity(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span>Time of Day:</span>
              <strong>{hour}:00 hrs {hour >= 19 && hour <= 23 ? '(Evening Peak)' : ''}</strong>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              value={hour}
              onChange={(e) => setHour(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Day of Week:</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
              style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-secondary)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px' }}
            >
              {dayNames.map((d, i) => (
                <option key={i} value={i}>{d} {i >= 5 ? '(Weekend)' : ''}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Predictive Model:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-secondary)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px' }}
            >
              <option value="random_forest">Random Forest Regressor (Ensemble)</option>
              <option value="decision_tree">Decision Tree Regressor</option>
              <option value="linear_regression">Linear Regression Baseline</option>
              <option value="chronos_forecaster">Chronos-2 Forecaster (Foundation Model)</option>
            </select>
          </div>

          <button
            onClick={handlePredictPoint}
            disabled={loadingPred}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--accent-blue)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {loadingPred ? 'Calculating...' : 'Run Point Inference'}
          </button>
        </div>

        {/* Prediction Results & Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', flex: 1 }}>
            <h3 style={{ fontSize: '15px', color: '#fff', marginBottom: '12px' }}>Point Inference Output</h3>
            {pointPrediction ? (
              <div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {pointPrediction.predicted_load_kw} <span style={{ fontSize: '18px', fontWeight: 400, color: 'var(--text-muted)' }}>kW</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Uncertainty Range: [{pointPrediction.confidence_interval?.[0]} kW — {pointPrediction.confidence_interval?.[1]} kW]
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Model: <strong>{pointPrediction.model_used}</strong> • Timestamp: {pointPrediction.created_at}
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0' }}>
                Click "Run Point Inference" to evaluate selected environmental parameters.
              </div>
            )}
          </div>

          {/* Horizon Forecast Controls */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', color: '#fff', marginBottom: '12px' }}>Horizon Rollout</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {[12, 24, 48, 72].map(h => (
                <button
                  key={h}
                  onClick={() => { setHorizon(h); handleGenerateForecast(h, selectedModel); }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: horizon === h ? 'var(--accent-cyan)' : 'transparent',
                    color: horizon === h ? '#000' : '#fff',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  +{h} Hours
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      {loadingForecast ? <LoadingSpinner /> : <PredictionChart forecastData={forecastResult} />}

      {/* History Table */}
      {history.length > 0 && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: '#fff', marginBottom: '14px' }}>Recent Inferences (Persisted Database Log)</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '8px' }}>Timestamp</th>
                  <th style={{ padding: '8px' }}>Model</th>
                  <th style={{ padding: '8px' }}>Predicted Load</th>
                  <th style={{ padding: '8px' }}>Confidence Bounds</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 5).map(h => (
                  <tr key={h.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px' }}>{h.created_at}</td>
                    <td style={{ padding: '8px', color: 'var(--accent-blue)' }}>{h.model_id}</td>
                    <td style={{ padding: '8px', fontWeight: 600 }}>{h.predicted_load_kw} kW</td>
                    <td style={{ padding: '8px', color: 'var(--text-muted)' }}>[{h.confidence_lower} - {h.confidence_upper} kW]</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
