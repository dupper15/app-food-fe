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
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "@/services/redux/store";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {
  getConversationDetail,
  sendMessage as apiSendMessage,
  uploadImage,
} from "@/apis/chatApi";
import { getRestaurantDetail } from "@/apis/restaurantApi";
import socketService from "@/services/socket/socketService";

// Define the message type based on API response
interface ApiMessage {
  _id: string;
  sender_id: string;
  receiver_id: string;
  conversationId: string;
  content: string;
  image?: string;
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
  const [restaurantAvatar, setRestaurantAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
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

        // Set up message listener with improved duplicate detection
        const messageUnsubscribe = socketService.onReceiveMessage(
          (newMessage) => {
            console.log("New message received:", newMessage);

            if (newMessage.conversationId === id) {
              setMessages((prevMessages) => {
                // More robust duplicate checking
                const isDuplicate = prevMessages.some(
                  (msg) =>
                    // Check if the message has the same ID (for server messages)
                    msg._id === newMessage._id ||
                    // Check if this is a server version of a temp message
                    (msg._id.startsWith("temp-") &&
                      msg.content === newMessage.content &&
                      msg.sender_id === newMessage.sender_id &&
                      Math.abs(
                        new Date(msg.createdAt).getTime() -
                          new Date(newMessage.createdAt).getTime(),
                      ) < 5000) ||
                    // Check for duplicate image messages (same sender and image URL)
                    (msg.image &&
                      newMessage.image &&
                      msg.image === newMessage.image &&
                      msg.sender_id === newMessage.sender_id &&
                      Math.abs(
                        new Date(msg.createdAt).getTime() -
                          new Date(newMessage.createdAt).getTime(),
                      ) < 10000),
                );

                if (isDuplicate) {
                  console.log(
                    "Duplicate message detected, ignoring:",
                    newMessage._id,
                  );
                  return prevMessages;
                }
                return [...prevMessages, newMessage];
              });

              // Scroll to bottom
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }
          },
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
          "Could not connect to chat service. Messages may be delayed.",
        );
      }
    };

    connectSocket();

    return () => {
      cleanupFunction();
    };
  }, [userId, id]);

  // Fetch restaurant name and avatar
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (recipientId) {
        try {
          const restaurantData = await getRestaurantDetail(recipientId);
          setRestaurantName(restaurantData.name || "Restaurant");

          // Check if the restaurant has an avatar image
          if (restaurantData.logo || restaurantData.image) {
            setRestaurantAvatar(restaurantData.logo || restaurantData.image);
          }
        } catch (error) {
          console.error("Error fetching restaurant details:", error);
          setRestaurantName("Restaurant");
        }
      }
    };

    fetchRestaurantDetails();
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

  // Function to handle image selection from camera
  const handleCameraPress = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera permissions to take photos.",
        );
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await handleImageUpload(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      Alert.alert("Error", "Could not access camera");
    }
  };

  // Function to handle image selection from gallery
  const handleDocumentPress = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant media library permissions to select images.",
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await handleImageUpload(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error accessing media library:", error);
      Alert.alert("Error", "Could not access media library");
    }
  };

  // Function to upload an image and send as message
  const handleImageUpload = async (imageUri: string) => {
    if (!recipientId || !id) return;

    try {
      setIsUploading(true);

      // Create a unique ID for this upload to track it
      const tempId = `temp-${Date.now()}`;

      // Create a temporary message with image indicator
      const tempMessage: ApiMessage = {
        _id: tempId,
        sender_id: userId || "",
        receiver_id: recipientId,
        conversationId: id,
        content: "📷 Sending image...",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      };

      // Show temporary message in UI
      setMessages((prevMessages) => [...prevMessages, tempMessage]);

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      console.log(
        "Starting image upload from URI:",
        imageUri.substring(0, 30) + "...",
      );

      // Upload the image to server
      const response = await uploadImage(imageUri, id);
      console.log("Upload image response:", response);

      if (!response) {
        console.error("Upload response is empty");
        throw new Error("Failed to upload image: Empty response");
      }

      let imageUrl: string;

      // Handle different response formats to extract the image URL
      if (typeof response === "string") {
        imageUrl = response;
      } else if (Array.isArray(response) && response.length > 0) {
        imageUrl = response[0];
      } else if (response.imageUrl) {
        imageUrl = response.imageUrl;
      } else {
        console.error("Invalid response format:", response);
        throw new Error("Failed to get image URL from response");
      }

      console.log("Successfully extracted image URL:", imageUrl);

      // Message data for API with image URL
      const messageData = {
        sender_id: userId || "",
        receiver_id: recipientId,
        content: "Image",
        _id: id,
        image: imageUrl,
      };

      // Send message with image URL
      const result = await apiSendMessage(messageData);
      console.log("Image message sent via API:", result);

      // Store the message ID to prevent duplicates
      const sentMessageId = result._id;

      // Remove temporary message
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== tempId),
      );

      // Only add the final message if we're not using sockets
      // If using sockets, the message will come through the socket
      if (!socketConnected) {
        const finalMessage: ApiMessage = {
          _id: sentMessageId || `image-${Date.now()}`,
          sender_id: userId || "",
          receiver_id: recipientId,
          conversationId: id,
          content: "Image",
          image: imageUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
        };

        setMessages((prevMessages) => [...prevMessages, finalMessage]);
      } else {
        // If socket connected, we'll track this ID to avoid duplicates
        // Store the sent message ID in a ref or state if needed
        console.log(
          "Message sent via API, waiting for socket update with ID:",
          sentMessageId,
        );
      }

      // When using socket, don't send the message through socket again,
      // since the server will broadcast it back to all connected clients
      // including this one
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");

      // Remove any temporary message
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => !msg._id.startsWith("temp-")),
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Function to send a message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || !recipientId) return;

    try {
      const tempMessage: ApiMessage = {
        _id: `temp-${Date.now()}`,
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

  // Function to render avatar for message
  const renderAvatar = (senderId: string) => {
    if (senderId !== userId && restaurantAvatar) {
      return (
        <Image
          source={{ uri: restaurantAvatar }}
          style={styles.messageAvatar}
          onError={() => console.log("Error loading avatar image")}
        />
      );
    }
    return <View style={styles.messageAvatar} />;
  };

  // Function to render message content
  const renderMessageContent = (message: ApiMessage) => {
    if (message.image) {
      return (
        <Image
          source={{ uri: message.image }}
          style={styles.messageImage}
          resizeMode='cover'
          onError={() => console.log("Error loading message image")}
        />
      );
    }
    return <Text style={styles.messageText}>{message.content}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='chevron-back' size={24} color='#000' />
        </TouchableOpacity>

        {restaurantAvatar ? (
          <Image
            source={{ uri: restaurantAvatar }}
            style={styles.avatar}
            onError={() => console.log("Error loading avatar image")}
          />
        ) : (
          <View style={styles.avatar}>
            {restaurantName && (
              <Text style={styles.avatarText}>
                {restaurantName.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
        )}

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
        contentContainerStyle={styles.messagesContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#FFC515' />
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
                ]}>
                {!isUser && renderAvatar(message.sender_id)}
                <View
                  style={[
                    styles.messageContent,
                    isUser
                      ? styles.userMessageContent
                      : styles.otherMessageContent,
                  ]}>
                  {renderMessageContent(message)}
                </View>
              </View>
            );
          })
        )}

        {isUploading && (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size='small' color='#FFC515' />
            <Text style={styles.uploadingText}>Uploading image...</Text>
          </View>
        )}
      </ScrollView>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={handleCameraPress}>
          <Ionicons name='camera' size={24} color='#666' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleDocumentPress}>
          <Ionicons name='document' size={24} color='#666' />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder='Message...'
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={inputMessage.trim() === "" || isLoading}>
          <Ionicons name='send' size={20} color='#000' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  uploadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  uploadingText: {
    marginLeft: 10,
    color: "#666",
  },
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
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
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
    overflow: "hidden",
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
