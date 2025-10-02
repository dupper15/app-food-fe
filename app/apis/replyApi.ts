import axiosInstance from "./axiosInstance";

export const createReply = async (id: string, data: FormData) => {
  const response = await axiosInstance.post(`reply/${id}/create`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
