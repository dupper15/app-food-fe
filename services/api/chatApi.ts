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

export const getOrInitializeConversation = async (
  user1: string,
  user2: string
): Promise<any> => {
  console.log(`Initializing conversation between users ${user1} and ${user2}`);

  if (!isValidObjectId(user1) || !isValidObjectId(user2)) {
    console.error("Invalid user IDs:", { user1, user2 });
    throw new Error("Invalid user ID format");
  }

  try {
    // First, check if a conversation already exists between these users (without messages)
    // This checks for an existing conversation even if no messages have been sent
    console.log("First checking if conversation exists in DB...");
    const allConversations = await getAllConversations(user1);

    const existingConversation = allConversations.find(
      (conv: any) => conv.user1 === user2 || conv.user2 === user2
    );

    if (existingConversation) {
      console.log(
        "Found existing conversation in conversation list:",
        existingConversation._id
      );
      return { conversationId: existingConversation._id, isNew: false };
    }

    // If no conversation exists at all, now try the message-based approach
    console.log("No conversation found, checking for messages...");
    const response = await axiosInstance.get(
      `conversation/messagesBy2Users?user1=${user1}&user2=${user2}`
    );
    console.log("API response for message check:", response.data);

    // If there's an existing conversation with messages, return it
    if (response.data && response.data.length > 0) {
      const conversationId = response.data[0]?.conversationId;
      console.log(
        "Found existing conversation with messages. ID:",
        conversationId
      );
      return { conversationId, isNew: false };
    }

    console.log("No existing conversation found, creating a new one...");
    // Create a new conversation by sending an initial message
    const initialMessage = {
      sender_id: user1,
      receiver_id: user2,
      content: "Hello, I'm interested in your restaurant!",
    };

    console.log("Sending initial message:", initialMessage);
    const newConversation = await sendMessage(initialMessage);
    console.log("New conversation created:", newConversation);

    // The sendMessage API should return the conversation ID, but let's handle a fallback
    if (newConversation && newConversation._id) {
      return { conversationId: newConversation._id, isNew: true };
    } else {
      console.error("API didn't return a valid conversation:", newConversation);
      throw new Error("Failed to create conversation");
    }
  } catch (error) {
    console.error("Error getting or initializing conversation:", error);
    throw error;
  }
};
