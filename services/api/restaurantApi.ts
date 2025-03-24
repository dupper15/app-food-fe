import { RestaurantData } from "@/interfaces/RestaurantInterface";
import axiosInstance from "./axiosInstance";

export const createRestaurant = async (data: FormData): Promise<any> => {
  const response = await axiosInstance.post("restaurants", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const setAvatarRes = async (data: FormData): Promise<any> => {
  const id = data.get("owner_id");
  const response = await axiosInstance.put(`restaurant_owners/${id}`, data);
  return response.data;
};
export const getRestaurantHistory = async (
  userId: any
): Promise<RestaurantData> => {
  const response = await axiosInstance.get(`restaurants/history/${userId}`);
  return response.data;
};
export const getRcmRestaurant = async (
  userId: any
): Promise<RestaurantData> => {
  const response = await axiosInstance.get(`restaurants/rcm/${userId}`);
  return response.data;
};
export const getDishesOfRestaurant = async (data: any) => {
  const { restaurantId, categoryId } = data;
  if (categoryId && categoryId !== "") {
    const response = await axiosInstance.get(
      `dish/fetchall-dish-category-by-restaurant/${restaurantId}/${categoryId}`
    );
    return response.data;
  } else {
    const response = await axiosInstance.get(
      `dish/fetchall-dish-by-restaurant/${restaurantId}`
    );
    return response.data;
  }
};
export const getCategory = async () => {
  const response = await axiosInstance.get("categories/fetchall-category");
   return response.data;
};
export const getRestaurantDetail = async (restaurantId: string) => {
  const response = await axiosInstance.get(`restaurants/${restaurantId}`);
  return response.data;
};
