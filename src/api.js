import axios from "axios";

const api = axios.create({
  baseURL: "https://YOUR-NGROK-URL.ngrok-free.app/api", // <--- Yahan apna ngrok url paste karein
  headers: {
    "ngrok-skip-browser-warning": "true"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("edusphere_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;