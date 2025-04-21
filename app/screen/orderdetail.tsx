import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MoreVertical, MapPin } from "lucide-react-native";
import { useMutation } from "@tanstack/react-query";
import { fetchDetailHistoryByRestaurant } from "@/services/api/historyApi";
import { HistoryDetailData } from "@/interfaces/HistoryInterface";
import { CustomToast } from "../components/toast";
import { formatCodeOrder } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { formatPrice } from './../../utils/format';

export default function OrderDetailScreen() {
  const { id }: { id: string } = useLocalSearchParams();
  const router = useRouter();
  const [orderDetail, setOrderDetail] = useState<HistoryDetailData>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useMutation({
    mutationFn: fetchDetailHistoryByRestaurant,
    onSuccess: (data) => {
      setOrderDetail(data);
      setIsLoading(false);
    },
    onError: (err) => {
      console.error("Error fetching order details:", err);
      CustomToast("error", "Error", "Failed to load order details");
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (id) {
      fetchDetail.mutate(id);
    }
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-5">
          <ActivityIndicator size="large" color="#FFCC00" />
          <Text className="mt-4 text-base text-gray-500">
            Loading order details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !orderDetail) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-base text-red-500 mb-4 text-center">
            {error || "Order not found"}
          </Text>
          <TouchableOpacity
            className="bg-amber-400 py-3 px-6 rounded-lg"
            onPress={() => {
              setIsLoading(true);
              fetchDetail.mutate(id);
            }}
          >
            <Text className="text-white font-semibold text-sm">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* header */}
      <View className="flex-row w-full h-14 bg-white items-center px-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl text-center flex-1">
          Details Order
        </Text>
        <View className="w-2" />
      </View>
      <ScrollView className="flex-1 p-4">
        {/* Order ID */}
        <View className="flex-row mb-4">
          <Text className="text-sm text-gray-700">ID: </Text>
          <Text className="text-sm text-gray-500">
            {formatCodeOrder(orderDetail._id)}
          </Text>
        </View>

        {/* Customer Info */}
        <View className="flex-row items-center mb-4">
          <Image
            source={{
              uri: orderDetail.customer_id?.avatar,
            }}
            className="w-12 h-12 rounded-full bg-gray-200"
          />
          <View className="ml-3">
            <Text className="text-base font-bold text-gray-800 mb-1">
              {orderDetail.customer_id.name}
            </Text>
            <Text
              className={`text-sm font-medium ${
                orderDetail.order_id.status.toLowerCase() === "cancel"
                  ? "text-red-500"
                  : "text-blue-500"
              }`}
            >
              {orderDetail.order_id.status.charAt(0).toUpperCase() +
                orderDetail.order_id.status.slice(1)}
            </Text>
          </View>
        </View>
        {/* note */}
        <View className="flex-row items-center mb-4 gap-2">
          <Text className="text-lg font-semibold">Note:</Text>
          <Text className="text-sm text-gray-500 mt-0.5">
            {orderDetail.order_id.note ? orderDetail.order_id.note : 'None'}
          </Text>
        </View>

        {/* Order Details */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">Order Detail</Text>

          {/* Order Items */}
          {orderDetail.order_id.array_item.map((item, index) => (
           <View className="mb-4 flex-col" key={index}>
             <View className="flex-row items-start">
              {/* Quantity */}
              <View className="w-10 items-center">
                <Text className="text-sm font-medium text-gray-600">{item.quantity}x</Text>
              </View>

              {/* Dish and Toppings */}
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-800">{item.dish_id.name}</Text>
              </View>

              {/* Total Price */}
              <View className="w-20 items-end">
                <Text className="text-sm font-medium text-gray-700">
                  {formatPrice(item.dish_id.price * item.quantity)}
                </Text>
              </View>
            </View>

            {/* topping */}
            <View className="flex-row items-start mb-6">
              <View className="flex-1">
                {item.topping && item.topping.length > 0 && (
                  <View className="mt-2">
                    {item.topping.map((t, idx) => (
                      <View key={idx} className="flex-row justify-between">
                        <Text className="text-xs ps-8 text-gray-500">+ {t.name}</Text>
                        <Text className="text-xs text-gray-500">{formatPrice(t.price)}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
           </View>
          ))}

          {/* Order Summary */}
          <View className="mt-4 pt-4 border-t border-gray-200">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-600">Tổng tạm phí</Text>
              <Text className="text-sm text-gray-700">
                {formatPrice(orderDetail.cost)}
              </Text>
            </View>

            {/* {voucherDiscount > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-600">Voucher</Text>
                <Text className="text-sm text-gray-700">
                  {voucherDiscount.toLocaleString()}đ
                </Text>
              </View>
            )} */}

            <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-200">
              <Text className="text-base font-semibold text-gray-700">
                Tổng cộng
              </Text>
              <Text className="text-base font-semibold text-green-600">
                {formatPrice(orderDetail.cost)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
