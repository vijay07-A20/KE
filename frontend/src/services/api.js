const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

function getAuthHeader() {
  const token = localStorage.getItem('cds_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // --- Auth ---
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  getDemoUsers: () => request('/auth/demo-users'),
  quickSwitchRole: (role) =>
    request(`/auth/quick-switch/${role}`, { method: 'POST' }),

  // --- Dashboard ---
  getDashboardStats: () => request('/dashboard/stats'),

  // --- Patients ---
  getPatients: () => request('/patients'),
  getPatient: (id) => request(`/patients/${id}`),
  createPatient: (data) =>
    request('/patients', { method: 'POST', body: JSON.stringify(data) }),
  updatePatient: (id, data) =>
    request(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePatient: (id) =>
    request(`/patients/${id}`, { method: 'DELETE' }),

  // --- Drugs ---
  getDrugs: (search = '', drugClass = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (drugClass) params.append('drug_class', drugClass);
    const qs = params.toString();
    return request(`/drugs${qs ? `?${qs}` : ''}`);
  },
  getDrugClasses: () => request('/drugs/classes/list'),
  getDrug: (id) => request(`/drugs/${id}`),
  createDrug: (data) =>
    request('/drugs', { method: 'POST', body: JSON.stringify(data) }),
  updateDrug: (id, data) =>
    request(`/drugs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDrug: (id) => request(`/drugs/${id}`, { method: 'DELETE' }),

  // --- Interactions / Reasoning ---
  checkInteractions: (data) =>
    request('/interactions/check', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getClinicalRules: () => request('/interactions/rules'),

  // --- Knowledge Graph ---
  getFullGraph: () => request('/graph/full'),
  getPatientGraph: (patientId) => request(`/graph/patient/${patientId}`),
  getDrugNetwork: (drugId) => request(`/graph/drug/${drugId}`),
  getGraphStatus: () => request('/graph/status'),
  queryGraph: (payload) =>
    request('/graph/query', { method: 'POST', body: JSON.stringify(payload) }),

  // --- Alerts ---
  getAlerts: (severity = '', isReviewed = null) => {
    const params = new URLSearchParams();
    if (severity) params.append('severity', severity);
    if (isReviewed !== null) params.append('is_reviewed', isReviewed);
    const qs = params.toString();
    return request(`/alerts${qs ? `?${qs}` : ''}`);
  },
  reviewAlert: (alertId, reviewedBy, notes) =>
    request(`/alerts/${alertId}/review`, {
      method: 'POST',
      body: JSON.stringify({ reviewed_by: reviewedBy, review_notes: notes }),
    }),
  deleteAlert: (alertId) => request(`/alerts/${alertId}`, { method: 'DELETE' }),

  // --- Reports ---
  getReports: () => request('/reports'),
  getReport: (id) => request(`/reports/${id}`),
  createReport: (data) =>
    request('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getPdfDownloadUrl: (reportId) => `${API_BASE}/reports/${reportId}/pdf`,

  // --- Settings ---
  getSystemStatus: () => request('/settings/status'),
  testNeo4j: (payload) =>
    request('/settings/test-neo4j', {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    }),
  resetDemoData: () => request('/settings/reset-demo', { method: 'POST' }),
  getAuditLogs: () => request('/settings/audit-logs'),
};
