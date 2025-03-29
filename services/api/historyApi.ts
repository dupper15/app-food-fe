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
