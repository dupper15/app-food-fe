import axiosInstance from "./axiosInstance";

export const getVouchers = async (restaurantId) => {
  const response = await axiosInstance.get(`voucher/available/${restaurantId}`);
  return response.data;
};
