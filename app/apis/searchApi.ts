import axiosInstance from "./axiosInstance";

export const textSearch = async (text: any) => {
  const response = await axiosInstance.get(`search/text`, {
    params: { query: text },
  });
  console.log(response.data);
  return response.data;
};
