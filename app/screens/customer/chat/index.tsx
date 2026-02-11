import { getAllConversations, getMessage } from "@/apis/chatApi";
import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "@/services/redux/store";
import { getRestaurantDetail } from "@/apis/restaurantApi";
import socketService from "@/services/socket/socketService";

export interface Conversation {
  _id: string;
  user1: string;
  user2: string;
  is_seen: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  last_message: string;
}

export interface UserNames {
  [key: string]: string;
}

export interface MessageContents {
  [key: string]: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

export default function Chat() {
  const userId = useSelector((state: RootState) => state.user.userId);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);
  const [userNames, setUserNames] = useState<UserNames>({});
  const [userAvatars, setUserAvatars] = useState<{ [key: string]: string }>({});
  const [messageContents, setMessageContents] = useState<MessageContents>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [socketConnected, setSocketConnected] = useState(false);

  // Connect to socket
  useEffect(() => {
    let cleanupFunction: () => void = () => {};

    const setupSocket = async () => {
      if (!userId) return;

      try {
        await socketService.connect(userId);
        setSocketConnected(true);

        // Listen for conversation updates
        const updateUnsubscribe = socketService.onConversationUpdated(
          (data) => {
            console.log("Conversation updated notification:", data);
            // Refresh conversations when updated
            fetchData();
          },
        );

        cleanupFunction = () => {
          updateUnsubscribe();
        };
      } catch (error) {
        console.error("Socket connection error:", error);
        setSocketConnected(false);
      }
    };

    setupSocket();

    return () => {
      cleanupFunction();
    };
  }, [userId]);

  // Extract fetch logic to a separate function to reuse
  const fetchData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await getAllConversations(userId);

      // Sort conversations by updatedAt timestamp (newest first)
      const sortedData = [...data].sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });

      setConversations(sortedData);
      setFilteredConversations(sortedData);

      // Collect all user IDs that need name resolution
      const userIds = new Set<string>();
      sortedData.forEach((conv: Conversation) => {
        userIds.add(conv.user1);
        userIds.add(conv.user2);
      });

      // Fetch usernames and avatars for all users
      const namesMap: UserNames = {};
      const avatarsMap: { [key: string]: string } = {};

      await Promise.all(
        Array.from(userIds).map(async (id) => {
          try {
            const restaurantData = await getRestaurantDetail(id);
            namesMap[id] = restaurantData.name || "Unknown User";

            // Store avatar URL if available
            if (restaurantData.logo || restaurantData.image) {
              avatarsMap[id] = restaurantData.logo || restaurantData.image;
            }
          } catch (error) {
            console.error(`Error fetching details for user ${id}:`, error);
            namesMap[id] = "Unknown User";
          }
        }),
      );

      // Fetch all last message contents
      const messageIds = data
        .filter((conv: Conversation) => conv.last_message)
        .map((conv: Conversation) => conv.last_message);

      const messagesMap: MessageContents = {};
      await Promise.all(
        messageIds.map(async (msgId: string) => {
          try {
            if (msgId) {
              const messageData = await getMessage(msgId);
              messagesMap[msgId] = messageData.content || "No content";
            }
          } catch (error) {
            console.error(`Error fetching message ${msgId}:`, error);
            messagesMap[msgId] = "Unable to load message";
          }
        }),
      );

      setMessageContents(messagesMap);
      setUserNames(namesMap);
      setUserAvatars(avatarsMap);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [userId]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {
        // Optional cleanup
      };
    }, [userId]),
  );

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter((conversation) => {
        // Get the other user's ID
        const otherUserId = getOtherUserId(conversation);
        // Get their username and check if it includes the search query
        const otherUserName = userNames[otherUserId] || otherUserId;
        return otherUserName.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations, userId, userNames]);

  const navigateToChatDetail = (conversationId: string): void => {
    router.push({
      pathname: "/screens/customer/chat/[id]",
      params: { id: conversationId },
    });
  };

  const getOtherUserId = (conversation: Conversation): string => {
    return conversation.user1 === userId
      ? conversation.user2
      : conversation.user1;
  };

  const getOtherUserName = (conversation: Conversation): string => {
    const otherUserId = getOtherUserId(conversation);
    return userNames[otherUserId] || "Loading...";
  };

  const getLastMessageContent = (msgId: string): string => {
    if (!msgId) return "No messages yet";
    return messageContents[msgId] || "Loading message...";
  };

  const truncateMessage = (message: string, maxLength: number = 30): string => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor='#1A1A1A' />
      <Text style={styles.chatTitle}>chat</Text>

      <View style={styles.chatContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <Ionicons name='chevron-back' size={24} color='#000' />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat</Text>
          <View style={styles.rightHeader}>
            {!socketConnected && (
              <Text style={styles.offlineIndicator}>Offline</Text>
            )}
            <TouchableOpacity
              className='mr-4'
              onPress={() => router.push("/screens/screen/chatBot")}>
              <Ionicons name='logo-android' size={24} color='#000' />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name='search'
            size={20}
            color='#999'
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder='Search'
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor='#999'
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#FFC515' />
            <Text style={styles.loadingText}>Loading conversations...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredConversations}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const otherUserId = getOtherUserId(item);
              const otherUserName = getOtherUserName(item);
              const lastMessageContent = getLastMessageContent(
                item.last_message,
              );
              const avatarUrl = userAvatars[otherUserId];

              return (
                <TouchableOpacity
                  style={styles.chatItem}
                  onPress={() => navigateToChatDetail(item._id)}>
                  {avatarUrl ? (
                    <Image
                      source={{ uri: avatarUrl }}
                      style={styles.avatar}
                      onError={() => console.log("Error loading avatar image")}
                    />
                  ) : (
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {otherUserName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.chatContent}>
                    <Text style={styles.chatName}>{otherUserName}</Text>
                    <Text style={styles.chatMessage}>
                      {truncateMessage(lastMessageContent)}
                    </Text>
                  </View>
                  <Text style={styles.chatTime}>
                    {formatDate(item.updatedAt)}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No conversations found</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  chatTitle: {
    color: "#999",
    fontSize: 16,
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
    marginRight: 40, // To center the title accounting for the back button
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#333",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "500",
  },
  chatMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  chatTime: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  rightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  offlineIndicator: {
    color: "#cc9900",
    fontSize: 12,
    marginRight: 8,
  },
});
