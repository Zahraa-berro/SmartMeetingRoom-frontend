import axios from 'axios';



// Setup axios defaults
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Request interceptor - add auth token to requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors globally
axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on 401 Unauthorized
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// API methods
export const api = {
  get: (url) => axios.get(url),
  post: (url, data) => axios.post(url, data),
  put: (url, data) => axios.put(url, data),
  delete: (url) => axios.delete(url),
};