//src/axios.js
import axios from "axios";

// axios.defaults.baseURL = "http://localhost:4000/";
// Use environment variable for base URL
const baseURL = import.meta.env.VITE_API_URL || "https://survey-backend-five.vercel.app";

const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add withCredentials for CORS
instance.defaults.withCredentials = false;

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== '/admin-login') {
        window.location.href = '/admin-login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
