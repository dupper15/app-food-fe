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
