import { RootState } from "@/services/redux/store";
import { getCustomerInfo } from "@/apis/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
export default function Personal() {
  const userId = useSelector((state: RootState) => state.user.userId);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const handleLogout = () => {
    AsyncStorage.removeItem("userId");
    AsyncStorage.removeItem("accessToken");
    AsyncStorage.removeItem("refreshToken");
    AsyncStorage.removeItem("owner_id");
    AsyncStorage.removeItem("restaurant_id");
    AsyncStorage.removeItem("startTime");
    AsyncStorage.removeItem("usageTime");
    AsyncStorage.removeItem("customer_id");
    router.push("/screens/authen/login");
  };
  const menuItems = [
    {
      icon: "person", // Giữ nguyên icon cho Personal Info
      label: "Personal Info",
      iconColor: "#3b82f6", // blue-500
      onPress: () => {
        if (user) {
          router.push({
            pathname: "/screens/screen/editCustomerInfo",
            params: { data: JSON.stringify(user) },
          });
        }
      },
    },
    {
      icon: "location-on", // Dùng icon lock cho Change password
      label: "Addresses",
      iconColor: "#ef4444", // amber-500
      onPress: () => {
        router.push("/screens/screen/addressPage");
      },
    },
    {
      icon: "report", // Dùng icon favorite cho Reflect
      label: "Reflect",
      iconColor: "#10b981", // green-500
      onPress: () => {
        router.push("/screens/screen/reflect");
      },
    },
    {
      icon: "lock", // Dùng icon lock cho Change password
      label: "Change password",
      iconColor: "#f59e0b", // amber-500
      onPress: () => {
        router.push("/screens/screen/changePasswordPage");
      },
    },
    {
      icon: "lock-outline", // Dùng icon lock-outline cho Privacy
      label: "Privacy",
      iconColor: "#f97316", // orange-500
      onPress: () => {
        router.push("/screens/screen/privacyPage");
      },
    },
    {
      icon: "logout", // Giữ nguyên icon logout
      label: "Logout",
      iconColor: "#ef4444", // red-500
      onPress: () => {
        handleLogout();
      },
    },
  ];

  const getUserInfoMutation = useMutation({
    mutationFn: getCustomerInfo,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: (error) => {
      console.error("Error fetching user info:", error);
    },
  });

  useEffect(() => {
    if (userId) {
      getUserInfoMutation.mutate(userId);
    }
  }, [userId]);
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        getUserInfoMutation.mutate(userId);
      }
    }, [userId]),
  );

  return (
    <View className='flex-1 bg-white'>
      <View className='bg-white px-6 py-3 border-b border-gray-200'>
        <Text className='text-2xl font-semibold text-gray-800'>Profile</Text>
      </View>

      <View className='flex-1 gap-4 py-8 px-6'>
        <View className='bg-gray-50 rounded-xl p-4'>
          {getUserInfoMutation.isPending ? (
            <Placeholder Animation={Fade}>
              <View className='flex-row items-center'>
                <PlaceholderMedia size={64} isRound={true} />
                <View className='ml-4 flex-1'>
                  <PlaceholderLine width={80} />
                  <PlaceholderLine width={50} />
                </View>
              </View>
            </Placeholder>
          ) : (
            user && (
              <View className='flex-row items-center'>
                {user.avatar ? (
                  <Image
                    source={{
                      uri: user.avatar,
                    }}
                    className='w-16 h-16 rounded-full mr-4'
                  />
                ) : (
                  <Image
                    source={require("../../../../assets/images/default_avatar.jpg")}
                    className='w-16 h-16 rounded-full mr-4'
                  />
                )}
                <View>
                  <Text className='text-lg font-semibold text-gray-800'>
                    {user.name}
                  </Text>
                  <Text className='text-gray-500'>{user.email}</Text>
                </View>
              </View>
            )
          )}
        </View>

        <View className='mt-4  bg-gray-50 rounded-xl'>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className='flex-row items-center py-4 px-4  rounded-xl'
              onPress={item.onPress}
              activeOpacity={0.7}>
              <MaterialIcons
                name={item.icon}
                size={24}
                color={item.iconColor}
              />
              <Text className='ml-4 text-base text-gray-800'>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
