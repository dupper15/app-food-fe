import {
  fetchLoyalCustomerByRestaurant,
  fetchOrderRateByRestaurant,
  fetchRevenueByRestaurant,
  fetchWeeklyRevenueByRestaurant,
} from "@/services/api/orderApi";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import MonthlyRevenueCard from "./monthlyRevenue";
import MonthlyOrderCard from "./monthlyOrder";
import OrderRateChart from "./orderStatusChart";
import LoyalCustomerList from "./listTopCustomers";
import WeeklyRevenueChart from "./weeklyRevenueChart";
import { WeeklyRevenueItem } from "@/interfaces/RevenueInterface";
import { useFocusEffect } from "expo-router";
import ratingApi from "@/services/api/ratingApi";
import AverageRating from "./averageRating";

export default function DashboardScreen() {
  const [mockMonthlyRevenue, setMockMonthlyRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [rateMonth, setRateMonth] = useState(0);

  const [successOrder, setSuccessOrder] = useState(0);
  const [failOrder, setFailOrder] = useState(0);
  const [rateSuccess, setRateSuccess] = useState(0);

  const [topCustomers, setTopCustomers] = useState([]);

  const [weeklyRevenue, setWeeklyRevenue] = useState<WeeklyRevenueItem[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);

  const restaurantId = useSelector(
    (state: { restaurant: { restaurantId: string } }) =>
      state.restaurant.restaurantId
  );

  const orderStatusData = [
    {
      name: "Successful",
      count: successOrder,
      color: "#4CAF50",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Failed",
      count: failOrder,
      color: "#F44336",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ];

  const weeklyChartData = {
    labels: weeklyRevenue.map((item) => item.day),
    datasets: [
      {
        data: weeklyRevenue.map((item) => item.total),
        color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const fetchRevenue = useMutation({
    mutationFn: fetchRevenueByRestaurant,
    onSuccess: (data) => {
      setMockMonthlyRevenue(data.totalRevenue);
      setTotalOrders(data.totalOrders);
      setRateMonth(data.percentageRevenue);
    },
    onError: () => {},
  });

  const fetchOrderRate = useMutation({
    mutationFn: fetchOrderRateByRestaurant,
    onSuccess: (data) => {
      setSuccessOrder(data.totalSuccessful);
      setFailOrder(data.totalFailed);
      setRateSuccess(data.successRate);
    },
    onError: () => {},
  });

  const fetchLoyalCustomer = useMutation({
    mutationFn: fetchLoyalCustomerByRestaurant,
    onSuccess: (data) => {
      setTopCustomers(data);
    },
    onError: () => {},
  });

  const fetchWeeklyRevenue = useMutation({
    mutationFn: fetchWeeklyRevenueByRestaurant,
    onSuccess: (data) => {
      setWeeklyRevenue(data);
    },
    onError: () => {},
  });

  const fetchAverage = useMutation({
    mutationFn: ratingApi.fetchAverage,
    onSuccess: (data) => {
      setAverageRating(data);
    },
    onError: () => {},
  });
  useFocusEffect(
    useCallback(() => {
      if (restaurantId) {
        fetchRevenue.mutate(restaurantId);
        fetchOrderRate.mutate(restaurantId);
        fetchLoyalCustomer.mutate(restaurantId);
        fetchWeeklyRevenue.mutate(restaurantId);
        fetchAverage.mutate(restaurantId);
      }
    }, [restaurantId])
  );

  return (
    <ScrollView
      className="flex-1 bg-white px-4 py-4"
      showsVerticalScrollIndicator={false}
    >
      <MonthlyRevenueCard
        mockMonthlyRevenue={mockMonthlyRevenue}
        rateMonth={rateMonth}
      />
      <View className="flex-row gap-4 mb-4">
        <View className="flex-1">
          <MonthlyOrderCard totalOrders={totalOrders} />
        </View>
        <View className="flex-1">
          <AverageRating rating={averageRating} />
        </View>
      </View>
      <OrderRateChart
        orderStatusData={orderStatusData}
        successOrder={successOrder}
        failOrder={failOrder}
        rateSuccess={rateSuccess}
      />
      <WeeklyRevenueChart weeklyChartData={weeklyChartData} />
      <LoyalCustomerList topCustomers={topCustomers} />
    </ScrollView>
  );
}
