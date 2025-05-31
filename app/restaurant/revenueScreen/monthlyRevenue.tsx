import { MonthlyRevenueCardProps } from "@/interfaces/RevenueInterface";
import { formatPrice } from "@/utils/format";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { View, Text } from "react-native";

const MonthlyRevenueCard: React.FC<MonthlyRevenueCardProps> = ({
  mockMonthlyRevenue,
  rateMonth,
}) => {
  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm flex-row justify-between items-center">
      <View className="flex-1">
        <Text className="text-lg font-bold mb-2">This month's revenue</Text>
        <Text className="text-3xl font-bold text-[#389C9A] mb-1">
          {mockMonthlyRevenue >= 0 ? "+" : "-"}
          {formatPrice(Math.abs(mockMonthlyRevenue))}
        </Text>

        {/* Percentage change indicator */}
        <View className="flex-row items-center mt-1">
          {rateMonth > 0 ? (
            <View className="bg-green-100 px-2 py-1 rounded-full flex-row items-center">
              <Text className="text-green-700 text-xs font-medium">
                ↑ {Math.abs(rateMonth * 100).toFixed(2)}% from last month
              </Text>
            </View>
          ) : (
            <View className="bg-red-100 px-2 py-1 rounded-full flex-row items-center">
              <Text className="text-red-700 text-xs font-medium">
                ↓ {Math.abs(rateMonth * 100).toFixed(2)}% from last month
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="w-12 h-12 bg-yellow-200 rounded-full items-center justify-center">
        <Icon name="money" size={24} color="#000" />
      </View>
    </View>
  );
};

export default MonthlyRevenueCard;
