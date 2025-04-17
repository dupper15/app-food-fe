import { Order } from "@/interfaces/OrderInterface";
import axiosInstance from "./axiosInstance";

export const fetchOrderById = async (orderId: string): Promise<Order> => {
  const response = await axiosInstance.get(
    `/order/fetch-detail-order/${orderId}`
  );
  return response.data;
};

export const fetchPendingOrderByRestaurant = async (
  id: string
): Promise<Order[]> => {
  const response = await axiosInstance.get(
    `/order/fetch-pending-order-by-restaurant/${id}`
  );
  return response.data;
};

export const cancelOrderByRestaurnat = async (id: string): Promise<string> => {
  const response = await axiosInstance.patch(
    `/order/restaurant/cancel-order/${id}`
  );
  return response.data;
};
