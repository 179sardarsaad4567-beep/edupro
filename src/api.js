import axios from "axios";

const api = axios.create({
  baseURL: "https://<YAHAN_APNA_NAYA_LOCALTUNNEL_URL_DALO>/api",
  headers: {
    "Bypass-Tunnel-Reminder": "true"
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