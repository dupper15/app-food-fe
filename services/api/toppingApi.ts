import { RestaurantData } from "@/interfaces/RestaurantInterface";
import axiosInstance from "./axiosInstance";
import { DishData } from "@/interfaces/DishInterface";

export const fetchAllToppingByRestaurant = async (
  ownerId: string
): Promise<any> => {
  const response = await axiosInstance.get(
    `toppings/getall-by-restaurant/${ownerId}`
  );
  return response.data;
};
