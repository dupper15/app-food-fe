import { WeeklyRevenueChartProps } from "@/interfaces/RevenueInterface";
import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const WeeklyRevenueChart: React.FC<WeeklyRevenueChartProps> = ({
  weeklyChartData,
}) => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-2">
        Last 7 days revenue
      </Text>
      <LineChart
        data={weeklyChartData}
        width={screenWidth - 64}
        height={220}
        yAxisSuffix="đ"
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(71, 126, 232, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
          propsForLabels: {
            fontSize: 10,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 8,
        }}
      />
    </View>
  );
};

export default WeeklyRevenueChart;
