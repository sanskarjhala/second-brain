import axios from "axios";
// const apiURl = import.meta.env.BACKEND_URL;
const apiURl = "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: `${apiURl}/api/v1`,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  config.headers.Authorization = token;
  return config;
});
