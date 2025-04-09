import { getCustomerInfo } from "@/services/api/userApi";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";

export default function Personal() {
  const userId = useSelector((state) => state.user.userId);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const menuItems = [
    {
      icon: "person",
      label: "Personal Info",
      iconColor: "#3b82f6", // blue-500
      onPress: () => {
        if (user) {
          router.push({
            pathname: "/screen/editCustomerInfo",
            params: { data: JSON.stringify(user) },
          });
        }
      },
    },
    {
      icon: "location-on",
      label: "Addresses",
      iconColor: "#10b981", // green-500
      onPress: () => {},
    },
    {
      icon: "settings",
      label: "Settings",
      iconColor: "#f97316", // orange-500
      onPress: () => {},
    },
    {
      icon: "logout",
      label: "Logout",
      iconColor: "#ef4444", // red-500
      onPress: () => {},
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

  return (
    <View className='flex-1 bg-white'>
      <View className='bg-white px-6 py-3 shadow-sm'>
        <Text className='text-2xl font-semibold text-gray-800'>Profile</Text>
      </View>

      <View className='flex-1 gap-4 py-8 px-6'>
        {user && (
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
                source={{
                  uri: " https://th.bing.com/th/id/OIP.vg41yG82qw84ziz5nS-CWQHaHa?rs=1&pid=ImgDetMain",
                }}
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
        )}

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className='flex-row items-center py-4 px-4 bg-white rounded-xl shadow-sm'
            onPress={item.onPress}
            activeOpacity={0.7}>
            <MaterialIcons name={item.icon} size={24} color={item.iconColor} />
            <Text className='ml-4 text-base text-gray-800'>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
