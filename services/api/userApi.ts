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
  const { userId, editUser } = data;
  const response = await axiosInstance.put(`customers/${userId}`, {
    editUser,
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
