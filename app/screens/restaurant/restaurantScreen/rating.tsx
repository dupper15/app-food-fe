import RatingItem from "@/components/items/ratingItem";
import { CustomToast } from "@/components/ui/toast";
import { RatingInterface } from "@/types/RatingInterface";
import ratingApi from "@/apis/ratingApi";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

export default function Rating() {
  const router = useRouter();
  const restaurantId = useSelector(
    (state: { restaurant: { restaurantId: string | null } }) =>
      state.restaurant.restaurantId,
  );

  const [ratings, setRatings] = useState<RatingInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const fetchRatings = useMutation({
    mutationFn: async (id: string) => {
      return await ratingApi.getAllRatingByRestaurantId(id);
    },
    onSuccess: (data: any) => {
      setRatings(data.reverse());
      setIsLoading(false);
    },
    onError: () => {
      console.error = () => {};
      CustomToast("error", "Error", "Failed to fetch dishes");
    },
  });

  const fetchAverage = useMutation({
    mutationFn: async (id: string) => {
      return await ratingApi.fetchAverage(id);
    },
    onSuccess: (data: any) => {
      setAverageRating(data);
    },
    onError: () => {
      console.error = () => {};
      CustomToast("error", "Error", "Failed to fetch dishes");
    },
  });

  useEffect(() => {
    if (!restaurantId) return;
    fetchRatings.mutate(restaurantId);
    fetchAverage.mutate(restaurantId);
  }, [restaurantId, refresh]);

  return (
    <View className='h-full bg-white'>
      {/* Header */}
      <View className='flex-row w-full h-14 items-center px-4 border-b border-gray-200'>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='chevron-back-outline' size={24} color='black' />
        </TouchableOpacity>
        <Text className='font-bold text-2xl text-center flex-1'>Rating</Text>
        <View className='w-6' />
      </View>

      <View className='px-4 pt-3 pb-1 flex-row items-center justify-between'>
        <Text className='text-base font-semibold text-gray-800'>
          ⭐ Your averaget rating: {averageRating.toFixed(1)} / 5
        </Text>
        <TouchableOpacity
          className='px-3 py-1 bg-[#FFC515] rounded-lg'
          onPress={() =>
            setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
          }>
          <Text className='text-white font-medium text-sm'>
            {sortOrder === "desc"
              ? "Rating: High to Low"
              : "Rating: Low to High"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rating List */}
      {isLoading ? (
        <View className='flex-1 justify-center items-center bg-white'>
          <ActivityIndicator size='large' color='#FFC515' />
          <Text className='mt-3 text-gray-600 text-base font-medium'>
            Loading rating...
          </Text>
        </View>
      ) : (
        <FlatList
          data={[...ratings].sort((a, b) =>
            sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating,
          )}
          keyExtractor={(item) => item._id}
          className='px-4 pt-2'
          renderItem={({ item }) => (
            <RatingItem item={item} setRefresh={setRefresh} refresh={refresh} />
          )}
        />
      )}
    </View>
  );
}
