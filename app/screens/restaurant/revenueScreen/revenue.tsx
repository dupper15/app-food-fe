import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";

import {
  fetchLoyalCustomerByRestaurant,
  fetchOrderRateByRestaurant,
  fetchRevenueByRestaurant,
  fetchWeeklyRevenueByRestaurant,
} from "@/apis/orderApi";
import ratingApi from "@/apis/ratingApi";

import MonthlyRevenueCard from "./monthlyRevenue";
import MonthlyOrderCard from "./monthlyOrder";
import OrderRateChart from "./orderStatusChart";
import LoyalCustomerList from "./listTopCustomers";
import WeeklyRevenueChart from "./weeklyRevenueChart";
import AverageRating from "./averageRating";

import { WeeklyRevenueItem } from "@/types/RevenueInterface";

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
  const [weeklyChartData, setWeeklyChartData] = useState(null);

  const restaurantId = useSelector(
    (state: { restaurant: { restaurantId: string } }) =>
      state.restaurant.restaurantId,
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

  useEffect(() => {
    if (!weeklyRevenue || weeklyRevenue.length === 0) return;

    const labels = weeklyRevenue.map((item) => item?.day ?? "");
    const data = weeklyRevenue.map((item) => {
      const value = Number(item?.total);
      if (!isFinite(value) || isNaN(value)) {
        console.warn("Invalid value found:", item);
        return 0;
      }
      return value;
    });

    setWeeklyChartData({
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    });
  }, [weeklyRevenue]);

  const fetchRevenue = useMutation({
    mutationFn: fetchRevenueByRestaurant,
    onSuccess: (data) => {
      setMockMonthlyRevenue(data.totalRevenue);
      setTotalOrders(data.totalOrders);
      setRateMonth(data.percentageRevenue);
    },
  });

  const fetchOrderRate = useMutation({
    mutationFn: fetchOrderRateByRestaurant,
    onSuccess: (data) => {
      setSuccessOrder(data.totalSuccessful);
      setFailOrder(data.totalFailed);
      setRateSuccess(data.successRate ?? 0); // tránh null
    },
  });

  const fetchLoyalCustomer = useMutation({
    mutationFn: fetchLoyalCustomerByRestaurant,
    onSuccess: (data) => {
      setTopCustomers(data);
    },
  });

  const fetchWeeklyRevenue = useMutation({
    mutationFn: fetchWeeklyRevenueByRestaurant,
    onSuccess: (data) => {
      setWeeklyRevenue(data);
    },
  });

  const fetchAverage = useMutation({
    mutationFn: ratingApi.fetchAverage,
    onSuccess: (data) => {
      setAverageRating(data);
    },
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
    }, [restaurantId]),
  );

  return (
    <ScrollView
      className='flex-1 bg-white px-4 py-4'
      showsVerticalScrollIndicator={false}>
      <MonthlyRevenueCard
        mockMonthlyRevenue={mockMonthlyRevenue}
        rateMonth={rateMonth}
      />
      <View className='flex-row gap-4 mb-4'>
        <View className='flex-1'>
          <MonthlyOrderCard totalOrders={totalOrders} />
        </View>
        <View className='flex-1'>
          <AverageRating rating={averageRating} />
        </View>
      </View>
      <OrderRateChart
        orderStatusData={orderStatusData}
        successOrder={successOrder}
        failOrder={failOrder}
        rateSuccess={rateSuccess}
      />
      {weeklyChartData ? (
        <WeeklyRevenueChart weeklyChartData={weeklyChartData} />
      ) : (
        <Text className='text-center text-gray-400 mb-4'>
          Loading weekly revenue...
        </Text>
      )}
      <LoyalCustomerList topCustomers={topCustomers} />
    </ScrollView>
  );
}
