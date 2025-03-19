import axiosInstance from "./axiosInstance";
import * as RestaurantInterface from "@/interfaces/RestaurantInterface";

export const createRestaurant = async (
  data: RestaurantInterface.CreateRestaurantData
): Promise<any> => {
  const { name, description, address, banner, avatar, ownerId } = data;
  if (!name || !description || !address || !banner || !avatar || !ownerId) {
    throw new Error("All fields are required");
  }
  const response = await axiosInstance.post("restaurants", data);
  return response.data;
};
