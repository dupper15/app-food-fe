import { OrderRateChartProps } from "@/types/RevenueInterface";
import React from "react";
import { View, Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

const OrderRateChart: React.FC<OrderRateChartProps> = ({
  orderStatusData,
  successOrder,
  failOrder,
  rateSuccess,
}) => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <View className='bg-white rounded-xl p-4 mb-4 shadow-sm'>
      <Text className='text-lg font-bold text-gray-800 mb-2'>Order rate</Text>

      <View className='items-center justify-center my-2'>
        <PieChart
          data={orderStatusData}
          width={screenWidth - 64}
          height={200}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor='count'
          backgroundColor='transparent'
          paddingLeft='15'
          absolute
        />
      </View>

      <View className='flex-row justify-between mt-2'>
        <View className='items-center flex-row gap-1'>
          <Text className='text-sm text-gray-600'>Total orders:</Text>
          <Text className='text-base font-bold text-gray-800'>
            {successOrder + failOrder}
          </Text>
        </View>
        <View className='items-center flex-row gap-1'>
          <Text className='text-sm text-gray-600'>Success rate:</Text>
          <Text className='text-base font-bold text-gray-800'>
            {typeof rateSuccess === "number" && isFinite(rateSuccess)
              ? `${rateSuccess.toFixed(2)}%`
              : "N/A"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OrderRateChart;
