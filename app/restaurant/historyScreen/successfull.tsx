import { fetchAllHistorySuccess } from "@/services/api/historyApi";
import { formatCodeOrder, formatDate, formatPrice } from "@/utils/format";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

export default function Successful() {
  const router = useRouter();

  const restaurantId = useSelector(
    (state: { restaurant: { restaurantId: string } }) =>
      state.restaurant.restaurantId
  );

  const [items, setItems] = useState<any[]>([]);

  const fetchSuccess = useMutation({
    mutationFn: fetchAllHistorySuccess,
    onSuccess: (data: any[]) => {
      setItems(data.reverse());
    },
    onError: (error) => {
      console.error("Fetch history error", error);
    },
  });

  useEffect(() => {
    if (restaurantId) {
      fetchSuccess.mutate(restaurantId);
    }
  }, [restaurantId]);

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-white rounded-lg p-4 flex-row items-center mb-3 border-l-4 border-l-amber-400">
      <Image
        source={{ uri: item.customer_id?.avatar }}
        className="w-12 h-12 rounded-full bg-gray-200 mr-3"
      />

      <View className="flex-1">
        <View className="flex-row justify-between">
          <Text className="font-bold text-gray-800">
            {item.customer_id?.name || "Unknown"}
          </Text>
          <Text className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-md">
            {formatCodeOrder(item._id)}
          </Text>
        </View>

        <View className="flex-row flex-wrap mt-1 justify-between">
          <Text className="text-gray-600 text-sm mr-3">
            {item.sum_dishes} x item
          </Text>
          <Text className="text-[#389C9A] text-sm font-semibold mr-3">
            {formatPrice(item.cost)}
          </Text>
          <Text className="text-gray-600 text-sm">
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (fetchSuccess.isPending) {
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
          No history found.
        </Text>
      }
    />
  );
}
