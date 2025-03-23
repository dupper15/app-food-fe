import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  getConversationDetail,
  sendMessage as apiSendMessage,
} from "@/services/api/chatApi";
import { getRestaurantDetail } from "@/services/api/restaurantApi";

// Define the message type based on API response
interface ApiMessage {
  _id: string;
  sender_id: string;
  receiver_id: string;
  conversationId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function ChatDetail() {
  // Get the conversation id from the route parameter
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = useSelector((state: RootState) => state.user.userId);

  // State for messages
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [recipientId, setRecipientId] = useState<string>("");
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch restaurant name
  useEffect(() => {
    const fetchRestaurantName = async () => {
      if (recipientId) {
        try {
          const restaurantData = await getRestaurantDetail(recipientId);
          setRestaurantName(restaurantData.name || "Restaurant");
        } catch (error) {
          console.error("Error fetching restaurant name:", error);
          setRestaurantName("Restaurant");
        }
      }
    };

    fetchRestaurantName();
  }, [recipientId]);

  // Fetch messages for this conversation
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getConversationDetail(id);

        if (data && data.length > 0) {
          setMessages(data);

          // Determine the recipient ID (the other user in the conversation)
          const firstMessage = data[0];
          const otherUserId =
            firstMessage.sender_id === userId
              ? firstMessage.receiver_id
              : firstMessage.sender_id;

          setRecipientId(otherUserId);
        }
      } catch (error) {
        console.error("Error fetching conversation details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, userId]);

  // Function to send a message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || !recipientId) return;

    try {
      // Create a temporary message to show immediately
      const tempMessage: ApiMessage = {
        _id: id,
        sender_id: userId || "",
        receiver_id: recipientId,
        conversationId: id,
        content: inputMessage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      };

      // Add to UI immediately for better UX
      setMessages((prevMessages) => [...prevMessages, tempMessage]);
      setInputMessage("");

      // Send to API with the correct format
      await apiSendMessage({
        sender_id: userId || "",
        receiver_id: recipientId,
        content: inputMessage,
        _id: id,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const isCurrentUser = (senderId: string): boolean => {
    return senderId === userId;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.avatar} />
        <Text style={styles.headerTitle}>{restaurantName || "Loading..."}</Text>
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        ref={(ref) => {
          if (ref) {
            ref.scrollToEnd({ animated: true });
          }
        }}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading messages...</Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text>No messages yet. Start the conversation!</Text>
          </View>
        ) : (
          messages.map((message) => {
            const isUser = isCurrentUser(message.sender_id);
            return (
              <View
                key={message._id}
                style={[
                  styles.messageBubble,
                  isUser ? styles.userMessage : styles.otherMessage,
                ]}
              >
                {!isUser && <View style={styles.messageAvatar} />}
                <View
                  style={[
                    styles.messageContent,
                    isUser
                      ? styles.userMessageContent
                      : styles.otherMessageContent,
                  ]}
                >
                  <Text style={styles.messageText}>{message.content}</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="camera" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="document" size={24} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Message..."
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={inputMessage.trim() === "" || isLoading}
        >
          <Ionicons name="send" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  messagesList: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  messagesContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  messageBubble: {
    flexDirection: "row",
    marginVertical: 5,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  messageContent: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  userMessageContent: {
    backgroundColor: "#ffcc00", // Yellow color for user messages
  },
  otherMessageContent: {
    backgroundColor: "#e5e5ea", // Gray color for other messages
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  iconButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: "#ffcc00",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
