import axiosInstance from "./axiosInstance";

export const getAllConversations = async (userId: string): Promise<any> => {
  const response = await axiosInstance.get(`conversation?userId=${userId}`);
  return response.data;
};

export const getMessage = async (messageId: string) => {
  const response = await axiosInstance.get(`messages/${messageId}`);
  return response.data;
};

export const getConversationDetail = async (conversationId: string) => {
  const response = await axiosInstance.get(
    `conversation/messages?conversationId=${conversationId}`
  );
  return response.data;
};

export const sendMessage = async (data: any) => {
  const response = await axiosInstance.post("conversation", data);
  return response.data;
};
