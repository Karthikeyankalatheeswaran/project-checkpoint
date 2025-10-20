import axios from "axios";

const API_URL = "https://checkpoint-yy68.onrender.com/api/"; // Django backend

// Get access token from localStorage dynamically
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor to add auth header to all requests
api.interceptors.request.use(
  (config) => {
    const headers = getAuthHeaders();
    if (headers.Authorization) {
      config.headers.Authorization = headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh_token");
        const res = await api.post("token/refresh/", { refresh });
        localStorage.setItem("access_token", res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err.response || err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth ---
export const registerUser = (data) => api.post("register/", data);
export const loginUser = (data) => api.post("token/", data);
export const refreshToken = (refresh) =>
  api.post("token/refresh/", { refresh });

// --- Games ---
export const searchGames = async (query = "", page = 1) => {
  try {
    const res = await api.get(`search-games/?q=${query}&page=${page}`);
    return res.data;
  } catch (err) {
    console.error("Search API error:", err.response || err);
    return { results: [] };
  }
};

export const getGameDetail = async (rawg_id) => {
  try {
    const res = await api.get(`games/${rawg_id}/`);
    return res.data;
  } catch (err) {
    console.error("Get game detail error:", err.response || err);
    return null;
  }
};

export const logGame = async (data) => {
  try {
    const res = await api.post("log-game/", data);
    return res.data;
  } catch (err) {
    console.error("Log game error:", err.response || err);
    throw err;
  }
};

export const getDashboard = async (status) => {
  try {
    const url = status ? `dashboard/?status=${status}` : "dashboard/";
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    console.error("Dashboard fetch error:", err.response || err);
    return { logs: [] };
  }
};

// Get existing log for a specific game
export const getGameLog = async (rawg_id) => {
  try {
    const dashboard = await getDashboard();
    const logs = dashboard.logs || [];
    return logs.find((log) => log.game.rawg_id === rawg_id) || null;
  } catch (err) {
    console.error("Get game log error:", err.response || err);
    return null;
  }
};

// Edit a game log
export const editGameLog = async (log_id, data) => {
  try {
    const res = await api.put(`log-game/${log_id}/edit/`, data);
    return res.data;
  } catch (err) {
    console.error("Edit game log error:", err.response || err);
    throw err;
  }
};

// Delete a game log
export const deleteGameLog = async (log_id) => {
  try {
    const res = await api.delete(`log-game/${log_id}/delete/`);
    return res.data;
  } catch (err) {
    console.error("Delete game log error:", err.response || err);
    throw err;
  }
};

// --- User Profile APIs ---
export const getUserProfile = async (username = null) => {
  try {
    const url = username ? `profile/${username}/` : "profile/";
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    console.error("Error fetching user profile:", err.response || err);
    throw err;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const res = await api.put("profile/update/", profileData);
    return res.data;
  } catch (err) {
    console.error("Error updating user profile:", err.response || err);
    throw err;
  }
};

export const getUserGameLogs = async (username, status = "") => {
  try {
    const url = status
      ? `profile/${username}/logs/?status=${status}`
      : `profile/${username}/logs/`;
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    console.error("Error fetching user game logs:", err.response || err);
    throw err;
  }
};

// --- Friends System APIs ---
export const searchUsers = async (query) => {
  try {
    if (!query || query.trim().length < 2) {
      return { users: [] };
    }
    const res = await api.get(
      `friends/search/?q=${encodeURIComponent(query.trim())}`
    );
    return res.data;
  } catch (err) {
    console.error("Error searching users:", err.response || err);
    // Return empty results instead of throwing for better UX
    return { users: [] };
  }
};

export const sendFriendRequest = async (username) => {
  try {
    const res = await api.post(`friends/send-request/${username}/`);
    return res.data;
  } catch (err) {
    console.error("Error sending friend request:", err.response || err);
    throw err;
  }
};

export const acceptFriendRequest = async (friendshipId) => {
  try {
    const res = await api.post(`friends/accept-request/${friendshipId}/`);
    return res.data;
  } catch (err) {
    console.error("Error accepting friend request:", err.response || err);
    throw err;
  }
};

export const rejectFriendRequest = async (friendshipId) => {
  try {
    const res = await api.post(`friends/reject-request/${friendshipId}/`);
    return res.data;
  } catch (err) {
    console.error("Error rejecting friend request:", err.response || err);
    throw err;
  }
};

export const removeFriend = async (username) => {
  try {
    const res = await api.delete(`friends/remove/${username}/`);
    return res.data;
  } catch (err) {
    console.error("Error removing friend:", err.response || err);
    throw err;
  }
};

export const getFriends = async () => {
  try {
    const res = await api.get("friends/");
    return res.data;
  } catch (err) {
    console.error("Error fetching friends:", err.response || err);
    // Return empty friends array instead of throwing
    return { friends: [] };
  }
};

export const getPendingRequests = async () => {
  try {
    const res = await api.get("friends/pending/");
    return res.data;
  } catch (err) {
    console.error("Error fetching pending requests:", err.response || err);
    // Return empty pending requests instead of throwing
    return { pending_requests: [] };
  }
};

export const getFriendStatus = async (username) => {
  try {
    const res = await api.get(`friends/status/${username}/`);
    return res.data;
  } catch (err) {
    // If endpoint doesn't exist or returns error, assume not friends
    if (err.response?.status === 404) {
      return { status: "not_friends" };
    }
    console.error("Error fetching friend status:", err.response || err);
    return { status: "not_friends" };
  }
};
