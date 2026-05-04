import axios from "axios";
import siteConfig from "../config/siteConfig";

const api = axios.create({
  baseURL: `${siteConfig.backendUrl}/api`
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;