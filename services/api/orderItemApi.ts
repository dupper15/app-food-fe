import axiosInstance from "./axiosInstance";

export interface OrderItem {
  _id: string;
  dish_id: string;
  quantity: number;
  topping: string[];
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchOrderItems = async (
  itemIds: string | string[]
): Promise<OrderItem[]> => {
  // Handle both string and array cases
  const idsToSend = Array.isArray(itemIds) ? itemIds : [itemIds];
  console.log("IDs to send:", idsToSend);
  try {
    // Ensure we're sending a proper JSON array
    const response = await axiosInstance.post(
      `order-item/fetchall-order-item-by-list-id`,
      idsToSend,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response from fetchOrderItems:", response.data);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching order items:", error);
    throw error;
  }
};
