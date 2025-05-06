import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MonthlyOrderCardProps } from "@/interfaces/RevenueInterface";

const MonthlyOrderCard: React.FC<MonthlyOrderCardProps> = ({ totalOrders }) => {
  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm flex-row justify-between items-center">
      <View className="flex-1">
        <Text className="text-lg font-bold mb-2">Total orders in month</Text>
        <View className="flex-row gap-3 items-center">
          <Text className="text-2xl font-bold text-[#389C9A] mb-1">
            {totalOrders}
          </Text>
          <View className="w-12 h-12 bg-yellow-200 rounded-full items-center justify-center">
            <Ionicons name="cart-outline" size={24} color="#000" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MonthlyOrderCard;
