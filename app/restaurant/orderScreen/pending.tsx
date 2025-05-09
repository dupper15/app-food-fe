import { CustomToast } from "@/app/components/toast";
import { OrderPendingRestaurant } from "@/interfaces/OrderInterface";
import {
  cancelOrderByRestaurnat,
  fetchPendingOrderByRestaurant,
  updateStatusOrderByRestaurant,
} from "@/services/api/orderApi";
import { formatDate, formatPrice } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

export default function Pending({
  setCount,
  data,
  refresh,
  setRefresh,
}: {
  setCount: (count: number) => void;
  data: OrderPendingRestaurant[];
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}) {
  const [items, setItems] = useState<OrderPendingRestaurant[]>([]);

  useEffect(() => {
    setItems(data);
    setCount(data.length);
  }, [data]);

  const cancelOrder = useMutation({
    mutationFn: (id: string) => cancelOrderByRestaurnat(id),
    onSuccess: () => {
      CustomToast("success", "Success", "Cancelled successfully!");
      setRefresh(!refresh);
    },
    onError: () => {
      CustomToast("error", "Error", "Failed to cancel order! Please try again");
    },
  });

  const confirmOrder = useMutation({
    mutationFn: (id: string) => updateStatusOrderByRestaurant(id),
    onSuccess: () => {
      CustomToast("success", "Success", "Order received successfully!");
      setRefresh(!refresh);
    },
    onError: () => {
      CustomToast(
        "error",
        "Error",
        "Failed to receive order! Please try again"
      );
    },
  });

  const handleAccept = (orderId: string) => {
    confirmOrder.mutate(orderId);
  };

  const handleCancel = (orderId: string) => {
    cancelOrder.mutate(orderId);
  };

  const renderItem = ({ item }: { item: OrderPendingRestaurant }) => (
    <View className="bg-white p-4 flex-row justify-between items-center mb-3 border-b border-gray-200">
      {/* info */}
      <View className="flex-row items-center flex-1">
        <Image
          source={{ uri: item.customer_id?.avatar }}
          className="w-12 h-12 rounded-full bg-gray-200 mr-3"
        />

        <View className="flex-1 gap-1">
          <Text className="font-bold text-lg">
            {item.customer_id?.name || "Unknown"}
          </Text>
          {/* note */}
          <View className="flex-row gap-2">
            <Text className="font-bold">Note:</Text>
            <Text className="font-semibold text-gray-500">
              {item.note ? item.note : "No note"}
            </Text>
          </View>

          <View className="flex-col flex-wrap gap-1">
            {item.array_item.map((dish, index) => (
              <View key={index} className="flex-row flex-wrap items-center">
                <Text className="text-gray-600 text-sm mr-2">
                  {dish.quantity} x {dish.dish_id.name}
                </Text>

                {dish.topping?.length > 0 && (
                  <Text className="text-gray-600 text-sm">
                    (
                    {dish.topping.map((top, i) => (
                      <Text key={i} className="text-gray-600 text-sm">
                        {top.name}
                        {i < dish.topping.length - 1 ? ", " : ""}
                      </Text>
                    ))}
                    )
                  </Text>
                )}
              </View>
            ))}
          </View>
          <View className="flex-row justify-between">
            <View className="flex-row gap-2">
              <Text className="font-bold">Total price:</Text>
              <Text className="text-[#389C9A] text-md font-bold mr-3">
                {formatPrice(item.total_price)}
              </Text>
            </View>
            <Text className="text-gray-600 text-sm">
              {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>
      {/* action button */}
      <View className="flex-row space-x-2 ml-3 gap-1">
        <TouchableOpacity
          onPress={() => handleAccept(item._id)}
          className="p-1 rounded-full bg-green-100"
        >
          <Ionicons name="checkmark" size={20} color="green" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleCancel(item._id)}
          className="p-1 rounded-full bg-red-100"
        >
          <Ionicons name="close" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item, index) => item._id || index.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingVertical: 12 }}
      ListEmptyComponent={
        <Text className="text-center text-gray-500 mt-4">
          No order pending.
        </Text>
      }
    />
  );
}
