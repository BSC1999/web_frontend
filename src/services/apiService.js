import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/';

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add access token to requests
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthorized errors (401)
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 on anything OTHER than login, clear and redirect.
    // Login failures (401) should be handled by the Login component itself.
    const isLoginRequest = error.config && (error.config.url.includes('api/auth/login/'));
    
    if (error.response && error.response.status === 401 && !isLoginRequest) {
      // Mawa, only clear authentication tokens if they are strictly invalid.
      // We no longer forcibly redirect to /login to prevent automatic logouts.
      // The user will only be logged out if they explicitly choose to.
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      console.warn("Session Refresh Required - Explicit Login Highly Recommended");
    }
    return Promise.reject(error);
  }
);


export default apiService;
