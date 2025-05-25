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

export default function Restaurant() {
  const ownerId = useSelector(
    (state: { user: { userId: string } }) => state.user.userId
  );
  const name = useSelector(
    (state: { restaurant: { name: string } }) => state.restaurant.name
  );
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    router.push("/auth/login");
  };

  return (
    <View className="bg-white px-6 pt-6 flex-col h-full gap-8">
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
    </View>
  );
}
