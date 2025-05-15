import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { getRestaurantByCriteria } from "@/services/api/restaurantApi";
import {
  addFavoriteRestaurant,
  getFavoriteRestaurantIds,
  removeFavoriteRestaurant,
} from "@/services/api/userApi";
import { RestaurantData } from "@/interfaces/RestaurantInterface";
const RestaurantSelection = () => {
  const { restaurantCriteria, header } = useLocalSearchParams();
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<
    RestaurantData[]
  >([]);
  const userId = useSelector((state) => state.user.userId);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getRestaurantMutation = useMutation({
    mutationFn: getRestaurantByCriteria,
    onSuccess: (data) => {
      setRestaurants(data.result);
    },
    onError: (error) => {
      console.error("Error fetching restaurant data:", error);
    },
  });

  useEffect(() => {
    if (restaurantCriteria && userId) {
      const data = {
        restaurantCriteria: restaurantCriteria,
        userId: userId,
      };
      setIsLoading(true);
      getRestaurantMutation.mutate(data, {
        onSettled: () => setIsLoading(false), // dừng loading dù thành công hay thất bại
      });
    }
    if (userId) {
      getFavoriteResMutation.mutate(userId);
    }
  }, [restaurantCriteria, userId]);

  const handleDishNavigate = (item: any) => {
    router.push({
      pathname: "/screen/restaurantPage",
      params: {
        data: JSON.stringify(item),
      },
    });
  };
  const getFavoriteResMutation = useMutation({
    mutationFn: getFavoriteRestaurantIds,
    onSuccess: (data) => {
      setFavoriteRestaurants(data);
    },
    onError: (error) => {
      console.error("Error fetching favorite restaurant IDs:", error);
    },
  });
  const addToFavoriteRestaurant = useMutation({
    mutationFn: addFavoriteRestaurant,
    onSuccess: () => {
      getFavoriteResMutation.mutate(userId);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const removeFavoriteRestaurantMutation = useMutation({
    mutationFn: removeFavoriteRestaurant,
    onSuccess: () => {
      console.log("Removed from favorites");
      getFavoriteResMutation.mutate(userId);
    },
    onError: (error) => {
      console.error("Error removing favorite restaurant:", error);
    },
  });
  const handleAddToFavorite = (restaurantId: any, isFavorite: any) => {
    const data = {
      userId: userId,
      restaurantId,
    };
    if (isFavorite) {
      removeFavoriteRestaurantMutation.mutate(data);
    } else {
      addToFavoriteRestaurant.mutate(data);
    }
  };
  return (
    <View className="flex-1 bg-gray-100 ">
      <View className="flex-row items-start  bg-white px-2 pt-4 pb-2 mb-4">
        <TouchableHighlight
          className="rounded-full p-2"
          onPress={() => {
            router.back();
          }}
        >
          <Icon name="arrow-back" size={24} color="gray" />
        </TouchableHighlight>
        <Text className="text-2xl font-semibold text-gray-800">{header}</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#facc15" />
          <Text className="mt-2 text-gray-500">Loading restaurants...</Text>
        </View>
      ) : (
        <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
          {restaurants.length > 0 &&
            restaurants.map((restaurant) => (
              <View
                key={restaurant._id}
                className="bg-white rounded-lg p-5 mb-6 border border-gray-300 "
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-row items-start w-full">
                    {restaurant.owner_id?.avatar && (
                      <Image
                        source={{ uri: restaurant.owner_id.avatar }}
                        className="w-16 h-16 rounded-lg border border-gray-300"
                      />
                    )}
                    <View className="flex-1 ml-4">
                      <Text className="text-2xl font-semibold text-gray-800 whitespace-nowrap text-ellipsis overflow-hidden">
                        {restaurant.name}
                      </Text>
                      <Text className="text-sm text-gray-600 mt-1 whitespace-nowrap text-ellipsis overflow-hidden">
                        {restaurant.description}
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableHighlight
                  onPress={() =>
                    handleAddToFavorite(
                      restaurant._id,
                      favoriteRestaurants.includes(restaurant._id)
                    )
                  }
                  className="absolute top-3 right-3"
                >
                  <Icon
                    name={
                      favoriteRestaurants.includes(restaurant._id)
                        ? "favorite"
                        : "favorite-border"
                    }
                    size={30}
                    color={
                      favoriteRestaurants.includes(restaurant._id)
                        ? "red"
                        : "gray"
                    }
                  />
                </TouchableHighlight>
                <View className="flex-row items-center justify-between mt-4">
                  <Text className="text-xl ml-2 text-gray-900">3.5km</Text>

                  <TouchableHighlight
                    className="bg-customYellow rounded-lg px-6 py-3 w-max self-end transition-all duration-300"
                    onPress={() => {
                      handleDishNavigate(restaurant);
                    }}
                  >
                    <Text className="text-lg font-semibold text-white">
                      Order
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            ))}
        </ScrollView>
      )}
    </View>
  );
};

export default RestaurantSelection;
