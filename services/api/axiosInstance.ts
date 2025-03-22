import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://10.0.2.2:3000/",
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = "your-auth-token";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
