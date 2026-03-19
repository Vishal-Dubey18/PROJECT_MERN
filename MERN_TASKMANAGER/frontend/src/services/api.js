import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ── Axios instance ──────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Request interceptor: attach JWT ─────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tf_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ───────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tf_token');
      localStorage.removeItem('tf_user');
      window.location.href = '/login';
    }
    // Normalise error message for consumers
    const message =
      error.response?.data?.message ||
      error.response?.data?.error  ||
      error.message                ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ── Auth API ─────────────────────────────────────────────────────
export const authAPI = {
  login:    (creds)    => api.post('/auth/login',    creds),
  register: (payload)  => api.post('/auth/register', payload),
};

// ── Tasks API ────────────────────────────────────────────────────
export const tasksAPI = {
  getAll: (params) => api.get('/tasks', { params }),    // { status, search, page, limit, sortBy }
  getOne: (id)     => api.get(`/tasks/${id}`),
  create: (data)   => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  remove: (id)     => api.delete(`/tasks/${id}`),
};

export default api;
