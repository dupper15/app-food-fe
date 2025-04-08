import axiosInstance from "./axiosInstance";

export const fetchAllToppingByRestaurant = async (
  ownerId: string
): Promise<any> => {
  const response = await axiosInstance.get(
    `toppings/getall-by-restaurant/${ownerId}`
  );
  return response.data;
};

export const getToppingById = async (id: string): Promise<any> => {
  const response = await axiosInstance.get(`toppings/detail/${id}`);
  return response.data;
};

export interface Topping {
  _id: string;
  restaurant_id: string;
  name: string;
  price: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchToppings = async (
  toppingIds: string[]
): Promise<Topping[]> => {
  if (!toppingIds || toppingIds.length === 0) {
    return [];
  }

  try {
    const response = await axiosInstance.post(
      `toppings/detail-array`,
      toppingIds,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching toppings:", error);
    throw error;
  }
};
