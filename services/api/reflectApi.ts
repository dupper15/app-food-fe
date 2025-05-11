import axiosInstance from "./axiosInstance";

export const getReflectByUserId = async (userId: string) => {
  const response = await axiosInstance.get(`reflect/customer/${userId}`);
  return response.data;
};
export const sendReflect = async (data: FormData) => {
  const response = await axiosInstance.post(`reflect/create`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
