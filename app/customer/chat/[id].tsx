import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
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
import socketService from "@/services/socket/socketService";

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
  const [socketConnected, setSocketConnected] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Connect to socket when component mounts
  useEffect(() => {
    let cleanupFunction: () => void = () => {};

    const connectSocket = async () => {
      if (!userId) return;

      try {
        await socketService.connect(userId);
        setSocketConnected(true);
        console.log("Socket connected successfully");

        // Join the conversation room
        if (id) {
          const joined = socketService.joinConversation(id);
          console.log("Joined conversation:", joined);
        }

        // Set up message listener
        const messageUnsubscribe = socketService.onReceiveMessage(
          (newMessage) => {
            console.log("New message received:", newMessage);

            if (newMessage.conversationId === id) {
              setMessages((prevMessages) => {
                // Avoid duplicates by checking message ID
                const exists = prevMessages.some(
                  (msg) => msg._id === newMessage._id
                );
                if (exists) return prevMessages;
                return [...prevMessages, newMessage];
              });

              // Scroll to bottom
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }
          }
        );

        cleanupFunction = () => {
          if (id) {
            socketService.leaveConversation(id);
          }
          messageUnsubscribe();
        };
      } catch (error) {
        console.error("Socket connection failed:", error);
        Alert.alert(
          "Connection Error",
          "Could not connect to chat service. Messages may be delayed."
        );
      }
    };

    connectSocket();

    return () => {
      cleanupFunction();
    };
  }, [userId, id]);

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
      if (!id) return;

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

          // Scroll to bottom after messages load
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: false });
          }, 300);
        }
      } catch (error) {
        console.error("Error fetching conversation details:", error);
        Alert.alert("Error", "Failed to load conversation history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, userId]);

  // Function to send a message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || !recipientId) return;

    try {
      // Create a temporary message to show immediately
      const tempMessage: ApiMessage = {
        _id: `temp-${Date.now()}`, // Temporary ID for UI
        sender_id: userId || "",
        receiver_id: recipientId,
        conversationId: id,
        content: inputMessage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      };

      // Clear input field
      const messageToBeSent = inputMessage;
      setInputMessage("");

      // Add to UI immediately for better UX
      setMessages((prevMessages) => [...prevMessages, tempMessage]);

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Message data for API
      const messageData = {
        sender_id: userId || "",
        receiver_id: recipientId,
        content: messageToBeSent,
        _id: id,
      };

      // Send via socket if connected
      if (socketConnected) {
        socketService.sendMessage({
          conversationId: id,
          message: tempMessage,
        });
      }

      // Also send through API for persistence
      const result = await apiSendMessage(messageData);
      console.log("Message sent via API:", result);
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
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
        {!socketConnected && (
          <View style={styles.offlineIndicator}>
            <Text style={styles.offlineText}>Offline</Text>
          </View>
        )}
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
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
          messages.map((message, index) => {
            const isUser = isCurrentUser(message.sender_id);
            // Add a key that will be unique even with temp IDs
            const key = `${message._id}-${index}`;
            return (
              <View
                key={key}
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
  offlineIndicator: {
    backgroundColor: "#ffcc0033",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  offlineText: {
    color: "#cc9900",
    fontSize: 12,
  },
});
