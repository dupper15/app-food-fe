import { RestaurantData } from "@/interfaces/RestaurantInterface";
import axiosInstance from "./axiosInstance";

export const createRestaurant = async (data: FormData): Promise<any> => {
  const name = data.get("name");
  const description = data.get("description");
  const address = data.get("address");
  const image = data.get("images");
  const ownerId = data.get("owner_id");

  // if (!name || !description || !address || !image || !ownerId) {
  //   if (!name) {
  //     throw new Error("Name is required");
  //   }
  //   if (!description) {
  //     throw new Error("Description is required");
  //   }
  //   if (!address) {
  //     throw new Error("Address is required");
  //   }
  //   if (!image) {
  //     throw new Error("Image is required");
  //   }
  //   if (!ownerId) {
  //     throw new Error("Owner id is required");
  //   }
  // }
  const response = await axiosInstance.post("restaurants", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const setAvatarRes = async (data: FormData): Promise<any> => {
  const id = data.get("owner_id");
  console.log(id);
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
  console.log("test lan 1");
  const response = await axiosInstance.get(`restaurants/rcm/${userId}`);
  return response.data;
};
export const getRestaurantDetail = async (restaurantId: string) => {
  const response = await axiosInstance.get(`restaurants/${restaurantId}`);
  return response.data;
};
