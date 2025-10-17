import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/"; // Django backend

// Get access token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// --- Auth ---
export const registerUser = (data) => api.post("register/", data);
export const loginUser = (data) => api.post("token/", data);
export const refreshToken = (refresh) =>
  api.post("token/refresh/", { refresh });

// --- Games ---
export const searchGames = (query, page = 1) =>
  api.get(`search-games/?q=${query}&page=${page}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

export const logGame = (data) =>
  api.post("log-game/", data, { headers: getAuthHeaders() });

// --- Dashboard ---
export const getDashboard = (status) => {
  const url = status ? `dashboard/?status=${status}` : "dashboard/";
  return api.get(url, { headers: getAuthHeaders() });
};

export const editGameLog = (log_id, data) =>
  api.put(`log-game/${log_id}/edit/`, data, { headers: getAuthHeaders() });

export const deleteGameLog = (log_id) =>
  api.delete(`log-game/${log_id}/delete/`, { headers: getAuthHeaders() });
