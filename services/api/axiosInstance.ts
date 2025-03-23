import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getBaseUrl = () => {
  return Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000";
};

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Safe string conversion for logging
      const safeData = config.data ? JSON.stringify(config.data) : "no data";
      const safeUrl = config.url || "unknown endpoint";
      console.log(
        `${config.method?.toUpperCase() || "REQUEST"} ${safeUrl}`,
        safeData
      );

      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error in request interceptor:", error);
      // Don't throw - continue with the request
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    try {
      // Safe logging
      const statusText = response.status
        ? `${response.status}`
        : "unknown status";
      const safeData = response.data
        ? JSON.stringify(response.data)
        : "no data";
      console.log("Response:", statusText, safeData);
    } catch (error) {
      console.error("Error logging response:", error);
    }
    return response;
  },
  (error) => {
    try {
      // Safe error logging
      console.error(
        "Response error:",
        error.response?.status || "unknown status",
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message || "Unknown error"
      );
    } catch (loggingError) {
      console.error("Error while logging error:", loggingError);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
