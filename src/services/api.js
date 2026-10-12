import axios from 'axios';

// API client configured with FastAPI base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Interceptor to inject JWT authentication bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('findit_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to catch 401 unauthenticated errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // In production, handle token refresh or redirect to /login
      console.warn('[API Interceptor] Session expired or unauthorized');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
