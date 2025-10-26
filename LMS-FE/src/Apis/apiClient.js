import axios from 'axios';

// TODO: Replace with your actual backend API base URL
// You might want to use environment variables for this (e.g., process.env.REACT_APP_API_URL)
const API_BASE_URL = 'http://localhost:8080'; // Default to a common local development port for NestJS

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Request interceptor to add auth token
/*
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Or however you store your token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
*/

// Optional: Response interceptor for global error handling
/*
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors (e.g., logout on 401, show notifications)
    if (error.response && error.response.status === 401) {
      // Example: redirect to login or clear token
      console.error('Unauthorized, logging out...');
      // logoutUser();
    }
    return Promise.reject(error);
  }
);
*/

export default apiClient;
