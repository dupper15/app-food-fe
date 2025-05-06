import { LoyalCustomerListProps } from "@/interfaces/RevenueInterface";
import { formatPrice } from "@/utils/format";
import React from "react";
import { View, Text } from "react-native";

const getRankStyle = (index: number) => {
  switch (index) {
    case 0:
      return "bg-yellow-400 text-white";
    case 1:
      return "bg-gray-300 text-white";
    case 2:
      return "bg-yellow-600 text-white";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const LoyalCustomerList: React.FC<LoyalCustomerListProps> = ({
  topCustomers,
}) => {
  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-2">
        Loyal customer
      </Text>
      {topCustomers.map((customer, index) => {
        const rankStyle = getRankStyle(index);

        return (
          <View
            key={customer._id}
            className="flex-row items-center py-3 border-b border-gray-100"
          >
            <View
              className={`w-8 h-8 rounded-full justify-center items-center mr-3 ${rankStyle}`}
            >
              <Text
                className={`font-bold ${
                  index > 2 ? "text-gray-600" : "text-white"
                }`}
              >
                {index + 1}
              </Text>
            </View>

            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-800">
                {customer.customerName}
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">
                {customer.totalOrders} orders
              </Text>
            </View>

            <Text className="text-sm font-bold text-[#389C9A]">
              {formatPrice(customer.totalSpent)}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default LoyalCustomerList;
