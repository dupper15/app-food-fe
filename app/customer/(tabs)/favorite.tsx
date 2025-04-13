import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import {
  getFavoriteRestaurants,
  removeFavoriteRestaurant,
} from "@/services/api/userApi";
import { useSelector } from "react-redux";

export default function Favorite() {
  const userId = useSelector((state) => state.user.userId);
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();

  const navigateCart = () => {
    router.push("/screen/cartPage");
  };

  const getFavoriteRestaurantMutation = useMutation({
    mutationFn: getFavoriteRestaurants,
    onSuccess: (data) => {
      setRestaurants(data);
    },
    onError: (error) => {
      console.error("Error fetching favorite restaurants:", error);
    },
  });

  const removeFavoriteRestaurantMutation = useMutation({
    mutationFn: removeFavoriteRestaurant,
    onSuccess: () => {
      getFavoriteRestaurantMutation.mutate(userId);
    },
    onError: (error) => {
      console.error("Error removing favorite restaurant:", error);
    },
  });

  const handleRemoveFavorite = (restaurantId) => {
    const data = { userId, restaurantId };
    removeFavoriteRestaurantMutation.mutate(data);
  };

  const handleNavigateToRestaurant = (restaurant) => {
    router.push({
      pathname: "/screen/restaurantPage",
      params: {
        data: JSON.stringify(restaurant),
      },
    });
  };
  useEffect(() => {
    if (userId) {
      getFavoriteRestaurantMutation.mutate(userId);
    }
  }, [userId]);

  return (
    <View className='flex-1 bg-gray-100'>
      <View className='flex-row justify-between items-center px-4 pt-2 pb-4 bg-white'>
        <Text className='text-2xl font-semibold text-gray-900'>
          Favorite Restaurants
        </Text>
        <View className='flex-row gap-3'>
          <TouchableOpacity
            onPress={navigateCart}
            className='bg-customYellow p-2 rounded-lg'>
            <Icon name='cart-outline' size={24} color={"black"} />
          </TouchableOpacity>
          <TouchableOpacity
            className='bg-black p-2 rounded-lg'
            onPress={() => {
              console.log("Chat button pressed");
              router.push("/customer/chat");
            }}>
            <Ionicons
              name='chatbubble-ellipses-outline'
              size={24}
              color={"#FFC515"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {restaurants.length > 0 ? (
        <ScrollView
          className='px-4 py-4 pb-8'
          showsVerticalScrollIndicator={false}>
          {restaurants.map((restaurant) => (
            <View
              key={restaurant._id}
              className='bg-white rounded-xl p-4 mb-5 shadow-md border border-gray-100'>
              <View className='flex-row'>
                <Image
                  source={{ uri: restaurant.owner_id.avatar }}
                  className='w-20 h-20 rounded-lg border border-gray-300'
                />
                <View className='ml-4 flex-1'>
                  <Text className='text-xl font-bold text-gray-900'>
                    {restaurant.name}
                  </Text>
                  <Text className='text-sm text-gray-600 mt-1'>
                    {restaurant.description}
                  </Text>
                </View>
                <TouchableHighlight
                  onPress={() => handleRemoveFavorite(restaurant._id)}
                  className='absolute top-2 right-2'>
                  <Icon name={"heart"} size={28} color={"red"} />
                </TouchableHighlight>
              </View>

              <View className='flex-row justify-end items-center'>
                <TouchableHighlight
                  className='bg-customYellow px-6 py-2 rounded-lg'
                  onPress={() => handleNavigateToRestaurant(restaurant)}>
                  <Text className='text-white font-semibold'>Order</Text>
                </TouchableHighlight>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View className='flex items-center justify-center h-full'>
          <Text className='text-gray-600 text-lg font-semibold'>
            You have no favorite restaurants yet.
          </Text>
        </View>
      )}
    </View>
  );
}
