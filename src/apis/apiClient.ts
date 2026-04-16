import axios from "axios";
const apiURl = import.meta.env.BACKEND_URL;

export const apiClient = axios.create({
  baseURL: `${apiURl}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/signin";
    return Promise.reject("No token");
  }
  config.headers.Authorization = token;
  return config;
});
