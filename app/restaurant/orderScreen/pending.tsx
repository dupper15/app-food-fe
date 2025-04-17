import { CustomToast } from "@/app/components/toast";
import { OrderPendingRestaurant } from "@/interfaces/OrderInterface";
import {
  cancelOrderByRestaurnat,
  fetchPendingOrderByRestaurant,
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
}: {
  setCount: (count: number) => void;
}) {
  const restaurantId = useSelector(
    (state: { restaurant: { restaurantId: string } }) =>
      state.restaurant.restaurantId
  );
  const [items, setItems] = useState<OrderPendingRestaurant[]>([]);
  const hasFetched = useRef(false);

  const fetchPending = useMutation({
    mutationFn: fetchPendingOrderByRestaurant,
    onSuccess: (data: any[]) => {
      setItems(data.reverse());
      setCount(data.length);
    },
    onError: (error) => {
      console.error("Fetch history error", error);
    },
  });

  const cancelOrder = useMutation({
    mutationFn: (id: string) => cancelOrderByRestaurnat(id),
    onSuccess: () => {
      CustomToast("success", "Success", "Cancelled successfully!");
      fetchPending.mutate(restaurantId);
    },
    onError: () => {
      CustomToast("error", "Error", "Failed to cancel order! Please try again");
    },
  });

  useEffect(() => {
    if (!restaurantId) return;

    if (!hasFetched.current) {
      fetchPending.mutate(restaurantId);
      hasFetched.current = true;
    }
  }, [restaurantId]);

  const handleAccept = (orderId: string) => {
    // TODO: Gọi API cập nhật trạng thái thành "In Progress"
    console.log("Accept order:", orderId);
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
          <Text className="font-bold">
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
              <Text className="text-[#E23637] text-sm mr-3">
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
      <View className="flex-row space-x-2 ml-3">
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

  if (fetchPending.isPending) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FFC515" />
      </View>
    );
  }

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
