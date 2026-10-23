import axios from "axios";

const api = axios.create({
  baseURL: "https://YOUR-PINGGY-URL.a.pinggy.link/api", // <--- Yahan apna pinggy url lagayein
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("edusphere_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;