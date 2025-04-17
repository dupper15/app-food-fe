import axiosInstance from "./axiosInstance";

function isValidObjectId(id: any): boolean {
  if (!id) return false;
  // MongoDB ObjectId is a 24-character hex string
  return /^[0-9a-fA-F]{24}$/.test(String(id));
}

export const getAllConversations = async (userId: string): Promise<any> => {
  if (!isValidObjectId(userId)) {
    throw new Error("Invalid user ID format");
  }
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
export const sendChatBotMessage = async (data: any) => {
  const response = await axiosInstance.post("conversation/chat-bot", data);
  return response.data;
};
export const getChatBotMessage = async (userId: string) => {
  const response = await axiosInstance.get(`conversation/chat-bot/${userId}`);
  return response.data;
};
