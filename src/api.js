import axios from "axios";

const api = axios.create({
  baseURL: "https://lazy-turtles-arrive.loca.lt/api",
  headers: {
    "Bypass-Tunnel-Remainder": "true",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("edusphere_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;