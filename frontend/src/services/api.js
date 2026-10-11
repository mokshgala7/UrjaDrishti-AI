const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

async function handleResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

// Health & Status
export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(res);
}

export async function fetchStatus() {
  const res = await fetch(`${API_BASE_URL}/status`);
  return handleResponse(res);
}

// Dashboard
export async function fetchDashboardSummary() {
  const res = await fetch(`${API_BASE_URL}/dashboard/summary`);
  return handleResponse(res);
}

export async function fetchConsumption(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/dashboard/consumption${query ? '?' + query : ''}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchConsumptionPatterns() {
  const res = await fetch(`${API_BASE_URL}/dashboard/consumption-patterns`);
  return handleResponse(res);
}

export async function fetchHouseholds() {
  const res = await fetch(`${API_BASE_URL}/dashboard/households`);
  return handleResponse(res);
}

// Predictions & Forecasting
export async function fetchPrediction(payload) {
  const res = await fetch(`${API_BASE_URL}/predictions/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function fetchForecast(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/predictions/forecast${query ? '?' + query : ''}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchPredictionHistory(limit = 20) {
  const res = await fetch(`${API_BASE_URL}/predictions/history?limit=${limit}`);
  return handleResponse(res);
}

// Models
export async function fetchModels() {
  const res = await fetch(`${API_BASE_URL}/models`);
  return handleResponse(res);
}

export async function fetchModelComparison() {
  const res = await fetch(`${API_BASE_URL}/models/compare`);
  return handleResponse(res);
}

// Anomalies
export async function fetchAnomalies(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/anomalies${query ? '?' + query : ''}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchAnomalySummary() {
  const res = await fetch(`${API_BASE_URL}/anomalies/summary`);
  return handleResponse(res);
}

// Billing & Tariffs
export async function calculateBill(provider, units, financialYear = 'FY 2022-23') {
  const res = await fetch(`${API_BASE_URL}/billing/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, units, financial_year: financialYear })
  });
  return handleResponse(res);
}

export async function fetchBillingTariffs() {
  const res = await fetch(`${API_BASE_URL}/billing/tariffs`);
  return handleResponse(res);
}

export async function fetchBillingHistory() {
  const res = await fetch(`${API_BASE_URL}/billing/history`);
  return handleResponse(res);
}

// Datasets
export async function fetchDatasets() {
  const res = await fetch(`${API_BASE_URL}/datasets`);
  return handleResponse(res);
}

export async function fetchDatasetDetails(datasetId) {
  const res = await fetch(`${API_BASE_URL}/datasets/${datasetId}`);
  return handleResponse(res);
}

export async function fetchDatasetPreview(datasetId, page = 1, pageSize = 20) {
  const res = await fetch(`${API_BASE_URL}/datasets/${datasetId}/preview?page=${page}&page_size=${pageSize}`);
  return handleResponse(res);
}

export async function fetchDatasetStatistics(datasetId) {
  const res = await fetch(`${API_BASE_URL}/datasets/${datasetId}/statistics`);
  return handleResponse(res);
}

export async function fetchDatasetQuality(datasetId) {
  const res = await fetch(`${API_BASE_URL}/datasets/${datasetId}/quality`);
  return handleResponse(res);
}

export async function refreshDatasets() {
  const res = await fetch(`${API_BASE_URL}/datasets/refresh`, { method: 'POST' });
  return handleResponse(res);
}

// Environmental
export async function fetchEnvironmentalSummary() {
  const res = await fetch(`${API_BASE_URL}/environmental/summary`);
  return handleResponse(res);
}

export async function calculateEnvironmental(unitsKwh) {
  const res = await fetch(`${API_BASE_URL}/environmental/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ units_kwh: unitsKwh })
  });
  return handleResponse(res);
}

export async function fetchEnvironmentalTrends(interval = 'daily') {
  const res = await fetch(`${API_BASE_URL}/environmental/trends?interval=${interval}`);
  return handleResponse(res);
}
