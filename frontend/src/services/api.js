import axios from "axios";
import { useAuth } from "../context/AuthContext";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const { logout } = useAuth();

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      logout();
      window.location.href = "/login";
    }

    console.error("API Error:", error.response?.data || error.message);

    return Promise.reject(error.response?.data || error.message);
  }
);

export { api };
