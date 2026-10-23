import axios from "axios";

const api = axios.create({
  baseURL: "https://ebkiq-138-252-74-93.run.pinggy-free.link/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("edusphere_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;