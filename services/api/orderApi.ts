import axiosInstance from "./axiosInstance";

export interface Order {
  _id: string;
  array_item: string[];
  customer_id: string;
  restaurant_id: string;
  voucher_id: string[];
  total_price: number;
  used_point: number;
  time_receive: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchOrderById = async (orderId: string): Promise<Order> => {
  const response = await axiosInstance.get(
    `/order/fetch-detail-order/${orderId}`
  );
  return response.data;
};
