import {
  Order,
  OrderOngoingRestaurant,
  OrderPendingRestaurant,
} from "@/interfaces/OrderInterface";
import axiosInstance from "./axiosInstance";

export const fetchOrderById = async (orderId: string): Promise<Order> => {
  const response = await axiosInstance.get(
    `/order/fetch-detail-order/${orderId}`
  );
  return response.data;
};
export const reorder = async (orderId: string): Promise<Order> => {
  const response = await axiosInstance.post(`/order/re-order/${orderId}`);
  return response.data;
};

export const cancelOrder = async (
  orderId: string
): Promise<{ msg: string }> => {
  const response = await axiosInstance.put(`/order/cancel-order/${orderId}`);
  return response.data;
};
export const fetchPendingOrderByRestaurant = async (
  id: string
): Promise<OrderPendingRestaurant[]> => {
  const response = await axiosInstance.get(
    `/order/fetch-pending-order-by-restaurant/${id}`
  );
  return response.data;
};

export const fetchOngoingOrderByRestaurant = async (
  id: string
): Promise<OrderOngoingRestaurant[]> => {
  const response = await axiosInstance.get(
    `/order/fetch-ongoing-order-by-restaurant/${id}`
  );
  return response.data;
};

export const cancelOrderByRestaurnat = async (id: string): Promise<string> => {
  const response = await axiosInstance.patch(
    `/order/restaurant/cancel-order/${id}`
  );
  return response.data;
};

export const updateStatusOrderByRestaurant = async (
  id: string
): Promise<any> => {
  const response = await axiosInstance.patch(`/order/update-status/${id}`);
  return response.data;
};

export const fetchRevenueByRestaurant = async (id: string): Promise<any> => {
  const response = await axiosInstance.get(`/order/fetch-total-revenue/${id}`);
  return response.data;
};

export const fetchOrderRateByRestaurant = async (id: string): Promise<any> => {
  const response = await axiosInstance.get(`/order/fetch-order-rate/${id}`);
  return response.data;
};

export const fetchLoyalCustomerByRestaurant = async (
  id: string
): Promise<any> => {
  const response = await axiosInstance.get(`/order/fetch-loyal-customer/${id}`);
  return response.data;
};

export const fetchWeeklyRevenueByRestaurant = async (
  id: string
): Promise<any> => {
  const response = await axiosInstance.get(`/order/fetch-weekly-revenue/${id}`);
  return response.data;
};
