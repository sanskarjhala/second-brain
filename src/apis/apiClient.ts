import axios from "axios";
// const apiURl = "http://localhost:8080";
const apiURl = "https://second-brain-8meb.onrender.com";
export const apiClient = axios.create({
  baseURL: `${apiURl}/api/v1`,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  config.headers.Authorization = token;
  return config;
});
