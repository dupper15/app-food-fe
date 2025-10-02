import axiosInstance from "./axiosInstance";
import * as CategoryInterface from "@/types/CategoryInterface";

export const fetchAllCategory = async (): Promise<any> => {
  const data = await axiosInstance.get("categories/fetchall-category");
  return data;
};
