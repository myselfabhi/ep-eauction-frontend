import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: false, // optional if using cookies
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired, clear session and redirect to login
      localStorage.clear();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
