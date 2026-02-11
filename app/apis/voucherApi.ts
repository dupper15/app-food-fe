import { CreateVoucherDto, VoucherData } from "@/types/VoucherInterface";
import axiosInstance from "./axiosInstance";

export interface Voucher {
  _id: string;
  restaurant_id: string;
  quantity: number;
  value: number;
  max: number;
  expire_date: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchVouchers = async (
  voucherIds: string[] | null,
): Promise<Voucher[]> => {
  if (!voucherIds || voucherIds.length === 0) {
    return [];
  }

  try {
    const response = await axiosInstance.post(
      `voucher/detail-array`,
      voucherIds,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    throw error;
  }
};

export const getVouchers = async (restaurantId: string) => {
  const response = await axiosInstance.get(`voucher/available/${restaurantId}`);
  return response.data;
};

export const getAllVouchers = async (restaurantId: string) => {
  const response = await axiosInstance.get(
    `voucher/all-voucher/${restaurantId}`,
  );
  return response.data;
};

export const createVoucher = async (data: CreateVoucherDto) => {
  const response = await axiosInstance.post("voucher/create", data);
  return response.data;
};

export const editVoucher = async (id: string, data: CreateVoucherDto) => {
  const response = await axiosInstance.put(`voucher/edit/${id}`, data);
  return response.data;
};

export const deleteVoucher = async (id: string) => {
  const response = await axiosInstance.delete(`voucher/delete/${id}`);
  return response.data;
};
