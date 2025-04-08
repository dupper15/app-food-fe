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
  voucherIds: string[] | null
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
      }
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
