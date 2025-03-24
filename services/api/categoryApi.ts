import axiosInstance from "./axiosInstance";
import * as CategoryInterface from "@/interfaces/CategoryInterface";

export const fetchAllCategory = async (): Promise<any> => {
  return await axiosInstance.get("categories/fetchall-category");
};
