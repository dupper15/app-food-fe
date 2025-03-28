import axiosInstance from "./axiosInstance";

export const addToCart = async (data: any) => {
  const { userId, dish, topping, quantity } = data;
  const newCart = {
    dish_id: dish._id,
    quantity: quantity,
    topping: topping,
  };
  const response = await axiosInstance.post(`cart/${userId}`, newCart);
  console.log(response.data);
  return response.data;
};
export const editCart = async (data: any) => {
  const { quantity, topping, orderItemId } = data;
  const newCart = {
    quantity: quantity,
    topping: topping,
  };
  const response = await axiosInstance.put(
    `order-item/${orderItemId}`,
    newCart
  );
  return response.data;
};
export const getOrderItem = async (data: any) => {
  const { userId, dishId } = data;
  const response = await axiosInstance.get(`order-item/${userId}/${dishId}`);
  return response.data;
};
