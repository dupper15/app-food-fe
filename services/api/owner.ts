import axiosInstance from "./axiosInstance";
import { OwnerData } from "@/interfaces/OwnerInterface";

export const getDetailOwner = async (id: string): Promise<OwnerData> => {
  return await axiosInstance.get(`restaurant_owners/${id}`);
};
export const setAvatarRes = async (data: FormData): Promise<any> => {
  const id = data.get("owner_id");
  const response = await axiosInstance.put(`restaurant_owners/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
