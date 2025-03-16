import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const TOKEN_NAME = "token";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_NAME);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_NAME, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_NAME);
};

export const eraseToken = () => {
  localStorage.removeItem(TOKEN_NAME);
};

export default api;
