import axios from "axios";
import * as UserInterface from "@/interfaces/UserInterface";
import axiosInstance from "./axiosInstance";

export const loginUser = async (
  data: UserInterface.LoginData
): Promise<any> => {
  const { email, password } = data;
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const response = await axiosInstance.post("users/login", data);

  return response.data;
};
export const registerCustomer = async (
  data: UserInterface.RegisterData
): Promise<any> => {
  const { name, email, phone, password, confirmPassword } = data;
  if (!name || !email || !phone || !password || !confirmPassword) {
    throw new Error("All fields are required");
  }
  const response = await axiosInstance.post("customers", data);
  return response.data;
};
export const registerRestaurantOwner = async (
  data: UserInterface.RegisterData
): Promise<any> => {
  const { name, email, phone, password, confirmPassword } = data;
  if (!name || !email || !phone || !password || !confirmPassword) {
    throw new Error("All fields are required");
  }
  const response = await axiosInstance.post("restaurant_owners", data);
  return response.data;
};
export const getPoint = async (userId: string): Promise<any> => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const response = await axiosInstance.get(`customers/${userId}/points`);
  return response.data;
};
export const getFavoriteRestaurants = async (userId: string): Promise<any> => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const response = await axiosInstance.get(
    `customers/${userId}/favorite-restaurant`
  );
  return response.data;
};
export const removeFavoriteRestaurant = async (data: any): Promise<any> => {
  const { userId, restaurantId } = data;
  if (!userId || !restaurantId) {
    throw new Error("User ID and Restaurant ID are required");
  }
  const response = await axiosInstance.delete(
    `customers/${userId}/favorite-restaurant/${restaurantId}`
  );
  return response.data;
};
export const addFavoriteRestaurant = async (data: any): Promise<any> => {
  const { userId, restaurantId } = data;
  if (!userId || !restaurantId) {
    throw new Error("User ID and Restaurant ID are required");
  }
  const response = await axiosInstance.post(
    `customers/${userId}/favorite-restaurant/${restaurantId}`
  );
  return response.data;
};
export const getFavoriteRestaurantIds = async (
  userId: string
): Promise<any> => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const response = await axiosInstance.get(
    `customers/${userId}/favorite-restaurant-ids`
  );
  return response.data;
};
export const getCustomerInfo = async (userId: any) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const response = await axiosInstance.get(`customers/${userId}`);
  return response.data;
};
export const editCustomerInfo = async (data: any) => {
  const { userId, formData } = data;
  const response = await axiosInstance.put(`customers/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const changePassword = async (data: any) => {
  const { userId, currentPassword, newPassword, confirmPassword } = data;
  if (!userId || !currentPassword || !newPassword || !confirmPassword) {
    throw new Error("All fields are required");
  }
  const response = await axiosInstance.put(`users/change-password/${userId}`, {
    currentPassword,
    newPassword,
    confirmPassword,
  });
  return response.data;
};
export const setUsageTime = async (data) => {
  const { userId, usageTime } = data;
  if (!userId || !usageTime) {
    throw new Error("User ID and usage time are required");
  }
  const response = await axiosInstance.put(`users/${userId}/usage-time`, {
    total_time_spent: usageTime,
  });
  return response.data;
};
export const sendVerificationCode = async (data) => {
  const { id, phone } = data;
  if (!id || !phone) {
    throw new Error("User ID and phone number are required");
  }
  const response = await axiosInstance.post(`sms`, {
    id,
    to: phone,
  });
  return response.data;
};
export const checkCode = async (data) => {
  const { id, code } = data;
  if (!id || !code) {
    throw new Error("User ID and code are required");
  }
  const response = await axiosInstance.post(`sms/verify`, {
    id,
    code,
  });
  return response.data;
};
export const checkCodeNoDeleteCode = async (data) => {
  const { id, code } = data;
  if (!id || !code) {
    throw new Error("User ID and code are required");
  }
  const response = await axiosInstance.post(`sms/verify-no-delete-code`, {
    id,
    code,
  });
  return response.data;
};

export const sendCodeByPhone = async (data) => {
  const { phone } = data;
  if (!phone) {
    throw new Error("Phone number is required");
  }
  const response = await axiosInstance.post(`sms/find-Id`, {
    phone,
  });
  return response.data;
};
export const resetPassword = async (data) => {
  const { id, code, newPassword, confirmPassword } = data;
  if (!id || !code || !newPassword || !confirmPassword) {
    throw new Error("All fields are required");
  }
  const response = await axiosInstance.put(`sms/forget-password`, {
    id,
    code,
    newPassword,
    confirmPassword,
  });
  return response.data;
};
export const addAddress = async (data) => {
  const { userId, address } = data;
  if (!userId || !address) {
    throw new Error("User ID and address are required");
  }
  const response = await axiosInstance.post(`customers/${userId}/address`, {
    address: address,
  });
  return response.data;
};
export const getAddresses = async (userId: string): Promise<any> => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const response = await axiosInstance.get(`customers/${userId}/address`);
  return response.data;
};
export const editAddress = async (data: {
  userId: string;
  prevAddress: string;
  newAddress: string;
}) => {
  const { userId, prevAddress, newAddress } = data;
  if (!userId || !prevAddress || !newAddress) {
    throw new Error("User ID, address ID, and new address are required");
  }
  const response = await axiosInstance.put(`customers/${userId}/address`, {
    address: newAddress,
    prevAddress,
  });
  return response.data;
};
export const deleteAddress = async (data: {
  userId: string;
  address: string;
}) => {
  const { userId, address } = data;
  if (!userId || !address) {
    throw new Error("User ID and address are required");
  }
  const response = await axiosInstance.delete(`customers/${userId}/address`, {
    data: { address },
  });
  return response.data;
};
