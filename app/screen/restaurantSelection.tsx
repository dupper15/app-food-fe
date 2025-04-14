import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
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
const RestaurantSelection = () => {
  const { restaurantCriteria, header } = useLocalSearchParams();
  useEffect(() => {
    console.log("restaurantCriteria", restaurantCriteria);
    console.log("header", header);
  }, [restaurantCriteria, header]);
  const [restaurants, setRestaurants] = useState([0]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const userId = useSelector((state) => state.user.userId);

  const getRestaurantMutation = useMutation({
    mutationFn: getRestaurantByCriteria,
    onSuccess: (data) => {
      setRestaurants(data);
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
      getRestaurantMutation.mutate(data);
      //  getFavoriteRestaurants.mutate(userId);
    }
    if (userId) {
      getFavoriteResMutation.mutate(userId);
    }
  }, [restaurantCriteria, userId]);
  const router = useRouter();
  const handleDishNavigate = (item) => {
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
  const handleAddToFavorite = (restaurantId, isFavorite) => {
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
    <View className='flex-1 bg-gray-100 '>
      <View className='flex-row items-start  bg-white px-2 pt-4 pb-2 shadow-sm mb-4'>
        <TouchableHighlight
          className='rounded-full p-2'
          onPress={() => {
            router.back();
          }}>
          <Icon name='arrow-back' size={24} color='gray' />
        </TouchableHighlight>
        <Text className='text-2xl font-semibold text-gray-800'>{header}</Text>
      </View>
      <ScrollView className='px-4' showsVerticalScrollIndicator={false}>
        {restaurants.length > 0 &&
          restaurants.map((restaurant) => (
            <View
              key={restaurant._id}
              className='bg-white rounded-lg p-5 mb-6 shadow-sm border border-gray-200'>
              <View className='flex-row items-start justify-between'>
                <View className='flex-row items-start'>
                  {restaurant.owner_id?.avatar && (
                    <Image
                      source={{ uri: restaurant.owner_id.avatar }}
                      className='w-20 h-20 rounded-lg border-2 border-gray-300'
                    />
                  )}
                  <View className='flex-1 ml-4'>
                    <Text className='text-2xl font-semibold text-gray-800'>
                      {restaurant.name}
                    </Text>
                    <Text className='text-sm text-gray-600 mt-2'>
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
                className='absolute top-3 right-3'>
                <Icon
                  name={
                    favoriteRestaurants.includes(restaurant._id)
                      ? "favorite"
                      : "favorite-border"
                  }
                  size={36}
                  color={
                    favoriteRestaurants.includes(restaurant._id)
                      ? "red"
                      : "gray"
                  }
                />
              </TouchableHighlight>
              <View className='flex-row items-end justify-between mt-0'>
                <Text className='text-xl ml-2 text-gray-900  '>3.5km</Text>
                <TouchableHighlight
                  className='bg-customYellow rounded-lg px-8 py-4 w-max self-end transition-all duration-300'
                  onPress={() => {
                    handleDishNavigate(restaurant);
                  }}>
                  <Text className='text-lg font-semibold text-white'>
                    Order
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

export default RestaurantSelection;
