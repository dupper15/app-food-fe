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
export const editRestaurant = async (
  id: string,
  data: FormData
): Promise<RestaurantData> => {
  const response = await axiosInstance.put(`restaurants/edit/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
  // cai nay la cho for you
  const response = await axiosInstance.get(`restaurants/for-you/${userId}`);
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
export const fetchRestaurantByOwner = async (id: any): Promise<any> => {
  return await axiosInstance.get(`restaurants/owner/${id}`);
};
export const getRestaurantByCriteria = async (data: any) => {
  const { restaurantCriteria, userId } = data;
  const restaurantCriteriaString = restaurantCriteria.toString().slice(1, -1);
  if (restaurantCriteriaString === "Near me") {
    const response = await axiosInstance.get(`restaurants/nearby/${userId}`);
    return response.data;
  } else if (restaurantCriteriaString === "Recommended") {
    const response = await axiosInstance.get(
      `restaurants/recommended/${userId}`
    );
    return response.data;
  } else if (restaurantCriteriaString === "Multiple deals") {
    const response = await axiosInstance.get(`restaurants/multiple-deals`);
    return response.data;
  } else {
    const response = await axiosInstance.get(`restaurants/multiple-buyers`);
    return response.data;
  }
};
