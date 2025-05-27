import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8088/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto add token if exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token"); // or sessionStorage
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;