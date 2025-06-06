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
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import {
  getRestaurantByCriteria,
  getNearbyRestaurantsByLocation,
} from "@/services/api/restaurantApi";
import {
  addFavoriteRestaurant,
  getCustomerInfo,
  getFavoriteRestaurantIds,
  removeFavoriteRestaurant,
} from "@/services/api/userApi";
import { RestaurantData } from "@/interfaces/RestaurantInterface";
import * as Location from "expo-location";
import LocationSelectionModal from "@/components/LocationSelectionModal";

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // Earth's radius in kilometers
  const R = 6371;

  // Convert coordinates from degrees to radians
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
};

const RestaurantSelection = () => {
  const { restaurantCriteria, header } = useLocalSearchParams();
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<
    RestaurantData[]
  >([]);
  const userId = useSelector((state) => state.user.userId);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userCoordinates, setUserCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [selectedLocationInfo, setSelectedLocationInfo] = useState<{
    source: string;
    addressName?: string;
  } | null>(null);

  const calculateRestaurantDistances = (restaurants: RestaurantData[]) => {
    if (!userCoordinates) return restaurants;

    return restaurants.map((restaurant) => {
      // Check if restaurant has coordinates
      if (restaurant.latitude && restaurant.longitude) {
        const distance = calculateDistance(
          userCoordinates.latitude,
          userCoordinates.longitude,
          restaurant.latitude,
          restaurant.longitude
        );

        return {
          ...restaurant,
          distance: distance,
        };
      }
      return restaurant;
    });
  };

  const getNearbyRestaurantsMutation = useMutation({
    mutationFn: getNearbyRestaurantsByLocation,
    onSuccess: (data) => {
      const restaurantsWithDistance = calculateRestaurantDistances(
        data.result || data || []
      );
      setRestaurants(restaurantsWithDistance);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Error fetching nearby restaurants:", error);
      setIsLoading(false);
      Alert.alert(
        "Location Error",
        "Could not fetch nearby restaurants. Please try again."
      );
    },
  });

  const getRestaurantMutation = useMutation({
    mutationFn: getRestaurantByCriteria,
    onSuccess: (data) => {
      setRestaurants(data.result || data || []);
    },
    onError: (error) => {
      console.error("Error fetching restaurant data:", error);
    },
  });

  const handleLocationSelection = (location: {
    latitude: number;
    longitude: number;
    source: string;
    addressName?: string;
  }) => {
    setUserCoordinates({
      latitude: location.latitude,
      longitude: location.longitude,
    });

    setSelectedLocationInfo({
      source: location.source,
      addressName: location.addressName,
    });

    setIsLoading(true);
    getNearbyRestaurantsMutation.mutate({
      latitude: location.latitude,
      longitude: location.longitude,
      maxDistance: 20, // maximum distance in km
    });
  };

  const initiateNearMeSearch = () => {
    if (userId) {
      // Just show the location selection modal directly instead of fetching user info first
      setShowLocationModal(true);
    } else {
      setIsLoading(false);
      Alert.alert(
        "Authentication Error",
        "You need to be logged in to use this feature."
      );
    }
  };

  useEffect(() => {
    if (restaurantCriteria && userId) {
      const restaurantCriteriaString = restaurantCriteria
        .toString()
        .slice(1, -1);

      setIsLoading(true);

      if (restaurantCriteriaString === "Near me") {
        initiateNearMeSearch();
      } else {
        const data = {
          restaurantCriteria: restaurantCriteria,
          userId: userId,
        };
        getRestaurantMutation.mutate(data, {
          onSettled: () => setIsLoading(false),
        });
      }
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
      <View className="flex-row items-start bg-white px-2 pt-4 pb-2 mb-4">
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

      {isLoading && !showLocationModal ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#facc15" />
          <Text className="mt-2 text-gray-500">Loading restaurants...</Text>
        </View>
      ) : (
        <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
          {selectedLocationInfo && (
            <View className="flex-row items-center bg-white p-3 rounded-lg mb-3">
              <Icon
                name={
                  selectedLocationInfo.source === "device"
                    ? "my-location"
                    : "place"
                }
                size={20}
                color="#facc15"
              />
              <Text className="ml-2 text-gray-600">
                {selectedLocationInfo.source === "device"
                  ? "Using your current device location"
                  : `Using address: ${selectedLocationInfo.addressName?.substring(
                      0,
                      24
                    )}${
                      selectedLocationInfo.addressName &&
                      selectedLocationInfo.addressName.length > 24
                        ? "..."
                        : ""
                    }`}
              </Text>
              <TouchableHighlight
                className="ml-auto rounded-full p-1"
                onPress={() => setShowLocationModal(true)}
              >
                <Text className="text-customYellow font-medium">Change</Text>
              </TouchableHighlight>
            </View>
          )}

          {restaurants && restaurants.length > 0 ? (
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
                  <Text className="text-xl ml-2 text-gray-900">
                    {restaurant.distance
                      ? `${restaurant.distance.toFixed(1)}km`
                      : "3.5km"}
                  </Text>

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
            ))
          ) : (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-gray-500 text-lg">
                No{" "}
                {restaurantCriteria
                  .slice(1, -1)
                  .toString()
                  .trim()
                  .toLowerCase()}{" "}
                restaurants found
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <LocationSelectionModal
        visible={showLocationModal}
        onClose={() => {
          setShowLocationModal(false);
          // If the user closes without selecting and we don't have coordinates yet, go back
          if (!userCoordinates) {
            setIsLoading(false);
          }
        }}
        userId={userId}
        onSelectLocation={handleLocationSelection}
      />
    </View>
  );
};

export default RestaurantSelection;
