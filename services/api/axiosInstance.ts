import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://10.0.2.2:3000/",
  timeout: 50000,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
