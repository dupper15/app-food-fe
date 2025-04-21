import { HistoryData, HistoryDetailData } from "@/interfaces/HistoryInterface";
import axiosInstance from "./axiosInstance";

export interface HistoryItem {
  _id: string;
  order_id: string;
  customer_id: string;
  cost: number;
  sum_dishes: number;
  createdAt: string;
  updatedAt: string;
}

export const fetchUserHistory = async (
  userId: string
): Promise<HistoryItem[]> => {
  const response = await axiosInstance.get(`/history/customer/${userId}`);
  return response.data;
};

export const fetchDetailHistoryByRestaurant = async (
  id: string
): Promise<HistoryDetailData> => {
  const response = await axiosInstance.get(`/history/restaurant/detail/${id}`);
  return response.data;
};

export const fetchAllHistorySuccess = async (
  id: string
): Promise<HistoryData[]> => {
  const response = await axiosInstance.get(`/history/restaurant/success/${id}`);
  return response.data;
};

export const fetchAllHistoryFailed = async (
  id: string
): Promise<HistoryData[]> => {
  const response = await axiosInstance.get(`/history/restaurant/failed/${id}`);
  return response.data;
};
