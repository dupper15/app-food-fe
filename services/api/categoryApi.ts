import axiosInstance from "./axiosInstance";
import * as CategoryInterface from "@/interfaces/CategoryInterface";

export const fetchAllCategory = async (): Promise<any> => {
  const data = await axiosInstance.get("categories/fetchall-category");
  return data;
};
