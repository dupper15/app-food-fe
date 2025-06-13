import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ListSetting from "@/app/components/settingItem";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { getDetailOwner } from "@/services/api/owner";
import { useCallback, useEffect, useState } from "react";
import { CustomToast } from "@/app/components/toast";
import { router, useFocusEffect } from "expo-router";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOrInitializeConversation } from "@/services/api/chatApi";
import { MessageContents, UserNames } from "@/app/customer/chat";

export default function Restaurant() {
  const ownerId = useSelector(
    (state: { user: { userId: string } }) => state.user.userId
  );
  const name = useSelector(
    (state: { restaurant: { name: string } }) => state.restaurant.name
  );
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStartingChat, setIsStartingChat] = useState<boolean>(true);
  const [userNames, setUserNames] = useState<UserNames>({});
  const [userAvatars, setUserAvatars] = useState<{ [key: string]: string }>({});
  const [messageContents, setMessageContents] = useState<MessageContents>({});
  const userId = "67d9214bf4722d58ebc02690";

  useFocusEffect(
    useCallback(() => {
      if (ownerId) {
        fetchDetailOwnerMutation.mutate(ownerId);
      }
    }, [ownerId])
  );

  const fetchDetailOwnerMutation = useMutation({
    mutationFn: async (id: string) => {
      return await getDetailOwner(id);
    },
    onSuccess: (data: any) => {
      setAvatarUrl(data.data.avatar);
      setIsLoading(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "An unknown error occurred";
      CustomToast("error", "Error", errorMessage);
    },
  });

  const handleLogout = () => {
    AsyncStorage.removeItem("userId");
    AsyncStorage.removeItem("accessToken");
    AsyncStorage.removeItem("refreshToken");
    AsyncStorage.removeItem("owner_id");
    AsyncStorage.removeItem("restaurant_id");
    AsyncStorage.removeItem("startTime");
    AsyncStorage.removeItem("usageTime");
    AsyncStorage.removeItem("customer_id");
    router.push("/authen/login");
  };

  const chatInitMutation = useMutation({
    mutationFn: ({ user1, user2 }: { user1: string; user2: string }) =>
      getOrInitializeConversation(user1, user2),
    onSuccess: (data) => {
      console.log("Chat initialization successful:", data);
      setIsStartingChat(false);
      if (data && data.conversationId) {
        router.push({
          pathname: "/customer/chat",
          params: { id: data.conversationId },
        });
      } else {
        console.error("Missing conversation ID in response:", data);
        alert("Could not start chat. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Error initializing chat:", error);
      setIsStartingChat(false);
      alert("Failed to start chat. Please try again.");
    },
  });

  const handleChatWithRestaurant = () => {
    console.log("Chat button clicked");

    if (!userId) {
      console.log("User not logged in, redirecting to login");
      router.push("/authen/login");
      return;
    }

    if (!ownerId) {
      console.error("Restaurant ID is missing");
      alert("Cannot start chat: restaurant information is missing");
      return;
    }

    console.log(
      `Starting chat between user ${userId} and restaurant ${ownerId}`
    );
    setIsStartingChat(true);

    // Add a small delay to ensure state update is visible
    setTimeout(() => {
      chatInitMutation.mutate({
        user1: userId,
        user2: ownerId,
      });
    }, 100);
  };

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
        })
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
        })
      );

      setMessageContents(messagesMap);
      setUserNames(namesMap);
      setUserAvatars(avatarsMap);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [userId]);

  return (
    <ScrollView className="bg-white px-6 pt-6 flex-col h-full gap-8">
      {isLoading ? (
        <ActivityIndicator size="large" color="#FFC515" className="mt-10" />
      ) : (
        <>
          {/* avatar and fullname */}
          <View className="flex-row items-center gap-10">
            <Image
              source={{ uri: avatarUrl }}
              className="rounded-full w-24 h-24"
            />
            <View className="gap-1 flex-1">
              <Text className="font-semibold text-xl">{name}</Text>
              <Text className="text-base text-gray-400">I love fast food</Text>
            </View>
          </View>
        </>
      )}

      {/* list item setting */}
      <View>
        <ListSetting />
      </View>

      <TouchableOpacity
        onPress={handleChatWithRestaurant}
        className="flex-row gap-2 items-center px-4 py-5 mt-5 mb-5 bg-gray-100 rounded-xl"
      >
        <View className="bg-white rounded-full p-2">
          <Ionicons name="chatbubble-outline" size={20} color="#FF5733" />
        </View>
        <Text className="flex-1 ml-4 text-base">Message</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </TouchableOpacity>

      {/* logout */}
      <TouchableOpacity
        onPress={handleLogout}
        className="flex-row gap-2 items-center px-4 py-5 mb-20 bg-gray-100 rounded-xl"
      >
        <View className="bg-white rounded-full p-2">
          <Ionicons name="log-out-outline" size={20} color="#FF5733" />
        </View>
        <Text className="flex-1 ml-4 text-base">Logout</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </TouchableOpacity>
    </ScrollView>
  );
}
