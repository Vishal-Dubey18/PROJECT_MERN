import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tf_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-redirect on 403 (verify email case)
    if (error.response?.status === 401) {
      localStorage.removeItem('tf_token');
      localStorage.removeItem('tf_user');
      window.location.href = '/login';
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.error  ||
      error.message || 'Something went wrong';
    const enhanced = new Error(message);
    enhanced.statusCode       = error.response?.status;
    enhanced.requiresVerification = error.response?.data?.requiresVerification;
    enhanced.email            = error.response?.data?.email;
    return Promise.reject(enhanced);
  }
);

export const authAPI = {
  login:          (creds)   => api.post('/auth/login',           creds),
  register:       (payload) => api.post('/auth/register',        payload),
  verifyEmail:    (data)    => api.post('/auth/verify-email',    data),
  resendOTP:      (data)    => api.post('/auth/resend-otp',      data),
  forgotPassword: (data)    => api.post('/auth/forgot-password', data),
  resetPassword:  (data)    => api.post('/auth/reset-password',  data),
};

export const tasksAPI = {
  getAll:  (params)   => api.get('/tasks',        { params }),
  getOne:  (id)       => api.get(`/tasks/${id}`),
  create:  (data)     => api.post('/tasks',        data),
  update:  (id, data) => api.put(`/tasks/${id}`,  data),
  remove:  (id)       => api.delete(`/tasks/${id}`),
};

export default api;
