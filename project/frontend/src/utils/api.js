import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true, // send httpOnly cookie when available
});

// Also attach token from localStorage as Bearer header
// This covers the case where login was done via the real API and the
// token was stored, or when the httpOnly cookie isn't accessible.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
