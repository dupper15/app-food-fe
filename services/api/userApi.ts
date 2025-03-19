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
