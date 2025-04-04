import { RestaurantData } from "@/interfaces/RestaurantInterface";
import axiosInstance from "./axiosInstance";
import { DishData } from "@/interfaces/DishInterface";

export const fetchAllDishByRestaurant = async (
  ownerId: string
): Promise<DishData> => {
  const response = await axiosInstance.get(
    `dish/fetchall-dish-by-restaurant/${ownerId}`
  );
  return response.data;
};

export const createDish = async (data: FormData): Promise<DishData> => {
  const response = await axiosInstance.post("dish/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const fetchDishById = async (id: string): Promise<DishData> => {
  const response = await axiosInstance.get(`dish/fetch-detail-dish/${id}`);
  return response.data;
};
