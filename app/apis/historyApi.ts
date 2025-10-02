import { HistoryData, HistoryDetailData } from "@/types/HistoryInterface";
import axiosInstance from "./axiosInstance";

export interface OrderItem {
  _id: string;
  array_item: string | string[];
  customer_id: string;
  restaurant_id: string;
  voucher_id: string[] | null;
  total_price: number;
  used_point: number;
  time_receive: number;
  status: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const fetchUserHistory = async (
  userId: string
): Promise<OrderItem[]> => {
  const response = await axiosInstance.get(
    `/order/fetchall-order-by-customer/${userId}`
  );
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
