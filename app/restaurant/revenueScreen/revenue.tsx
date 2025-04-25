import { formatPrice } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [orders, setOrders] = useState({ successful: 0, failed: 0 });
  const [weeklyRevenue, setWeeklyRevenue] = useState<any>([]);
  const [topCustomers, setTopCustomers] = useState<any>([]);

  const mockMonthlyRevenue = 45678000;
  const totalOrders = 410;
  const rateMonth = 0.12;
  const rateOrder = 0.05;

  const mockOrders = {
    successful: 387,
    failed: 23
  };
    
  const mockWeeklyRevenue = [
    { date: "2025-04-19", total: 1850000, day: "Mon" },
    { date: "2025-04-20", total: 2250000, day: "Tue" },
    { date: "2025-04-21", total: 1950000, day: "Wed" },
    { date: "2025-04-22", total: 2380000, day: "Thu" },
    { date: "2025-04-23", total: 2920000, day: "Fri" },
    { date: "2025-04-24", total: 3450000, day: "Sat" },
    { date: "2025-04-25", total: 3120000, day: "Sun" },
  ];
    
  const mockTopCustomers = [
    { id: 1, name: "Nguyễn Văn An", totalSpent: 4250000, orderCount: 17 },
    { id: 2, name: "Trần Thị Bình", totalSpent: 3870000, orderCount: 14 },
    { id: 3, name: "Lê Hoàng Cường", totalSpent: 2940000, orderCount: 11 },
    { id: 4, name: "Phạm Thị Dung", totalSpent: 2580000, orderCount: 9 },
    { id: 5, name: "Hoàng Văn Eminence", totalSpent: 2150000, orderCount: 8 },
  ];

  useEffect(() => {
    setMonthlyRevenue(mockMonthlyRevenue);
    setOrders(mockOrders);
    setWeeklyRevenue(mockWeeklyRevenue);
    setTopCustomers(mockTopCustomers);
  }, []);

  // Data for pie chart showing order success/failure ratio
  const orderStatusData = [
    {
      name: "Successful",
      count: orders.successful,
      color: "#4CAF50",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Failed",
      count: orders.failed,
      color: "#F44336",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    }
  ];

  // Data for weekly revenue line chart
  const weeklyChartData = {
    labels: weeklyRevenue.map(item => item.day),
    datasets: [
      {
        data: weeklyRevenue.map(item => item.total),
        color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-4">
      {/* Monthly Revenue */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-bold mb-2">This month's revenue</Text>
          <Text className="text-3xl font-bold text-[#389C9A] mb-1">
            {monthlyRevenue >= 0 ? '+' : '-'}{formatPrice(Math.abs(monthlyRevenue))}
          </Text>
          {/* Percentage change indicator */}
          <View className="flex-row items-center mt-1">
            {rateMonth > 0 ? (
              <View className="bg-green-100 px-2 py-1 rounded-full flex-row items-center">
                <Text className="text-green-700 text-xs font-medium">↑ {Math.abs(rateMonth * 100).toFixed(0)}% from last month</Text>
              </View>
            ) : (
              <View className="bg-red-100 px-2 py-1 rounded-full flex-row items-center">
                <Text className="text-red-700 text-xs font-medium">↓ {Math.abs(rateMonth * 100).toFixed(0)}% from last month</Text>
              </View>
            )}
          </View>
        </View>
      
        <View className="w-12 h-12 bg-yellow-200 rounded-full items-center justify-center">
          <Text className="text-2xl">💰</Text>
        </View>
      </View>

      {/* Monthly Order Revenue */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-bold mb-2">This month's revenue</Text>
          <Text className="text-3xl font-bold text-[#389C9A] mb-1">{totalOrders}</Text>
          {/* Percentage change indicator */}
          <View className="flex-row items-center mt-1">
            {rateOrder > 0 ? (
              <View className="bg-green-100 px-2 py-1 rounded-full flex-row items-center">
                <Text className="text-green-700 text-xs font-medium">↑ {Math.abs(rateOrder * 100).toFixed(0)}% from last month</Text>
              </View>
            ) : (
              <View className="bg-red-100 px-2 py-1 rounded-full flex-row items-center">
                <Text className="text-red-700 text-xs font-medium">↓ {Math.abs(rateOrder * 100).toFixed(0)}% from last month</Text>
              </View>
            )}
          </View>
        </View>
      
        <View className="w-12 h-12 bg-yellow-200 rounded-full items-center justify-center">
          <Ionicons name="cart-outline" size={24} color="#000" />
        </View>
      </View>

      {/* Order Status Pie Chart */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-2">Order rate</Text>
        <View className="items-center justify-center my-2">
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
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
        <View className="flex-row justify-between mt-2">
          <View className="items-center flex-row gap-1">
            <Text className="text-sm text-gray-600">Total orders:</Text>
            <Text className="text-base font-bold text-gray-800">{orders.successful + orders.failed}</Text>
          </View>
          <View className="items-center flex-row gap-1">
            <Text className="text-sm text-gray-600">Success rate:</Text>
            <Text className="text-base font-bold text-gray-800">
              {Math.round((orders.successful / (orders.successful + orders.failed)) * 100)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Weekly Revenue Chart */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-2">Last 7 days revenue</Text>
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
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 8,
          }}
        />
      </View>

      {/* Top Customers */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-2">Loyal customer</Text>
        {topCustomers.map((customer, index) => (
          <View key={customer.id} className="flex-row items-center py-3 border-b border-gray-100">
            {index === 0 ? (
              <View className="w-8 h-8 rounded-full bg-yellow-400 justify-center items-center mr-3">
                <Text className="font-bold text-white">1</Text>
              </View>
            ) : index === 1 ? (
              <View className="w-8 h-8 rounded-full bg-gray-300 justify-center items-center mr-3">
                <Text className="font-bold text-white">2</Text>
              </View>
            ) : index === 2 ? (
              <View className="w-8 h-8 rounded-full bg-yellow-600 justify-center items-center mr-3">
                <Text className="font-bold text-white">3</Text>
              </View>
            ) : (
              <View className="w-8 h-8 rounded-full bg-gray-100 justify-center items-center mr-3">
                <Text className="font-bold text-gray-600">{index + 1}</Text>
              </View>
            )}
            
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-800">{customer.name}</Text>
              <Text className="text-xs text-gray-500 mt-0.5">{customer.orderCount} orders</Text>
            </View>
            <Text className="text-sm font-bold text-[#389C9A]">{formatPrice(customer.totalSpent)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}