import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

interface UseFavoriteRestaurantsOptions {
  userId: string;
  getFavoriteRestaurants: (userId: string) => Promise<any>;
  removeFavoriteRestaurant: (data: {
    userId: string;
    restaurantId: string;
  }) => Promise<any>;
}

export const useFavoriteRestaurants = ({
  userId,
  getFavoriteRestaurants,
  removeFavoriteRestaurant,
}: UseFavoriteRestaurantsOptions) => {
  const [restaurants, setRestaurants] = useState([]);

  const getFavoriteRestaurantMutation = useMutation({
    mutationFn: getFavoriteRestaurants,
    onSuccess: (data) => {
      setRestaurants(data);
      console.log("Favorite restaurants fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching favorite restaurants:", error);
    },
  });

  const removeFavoriteRestaurantMutation = useMutation({
    mutationFn: removeFavoriteRestaurant,
    onSuccess: () => {
      getFavoriteRestaurantMutation.mutate(userId);
      console.log("Restaurant removed from favorites successfully");
    },
    onError: (error) => {
      console.error("Error removing restaurant from favorites:", error);
    },
  });

  const fetchFavorites = useCallback(() => {
    if (userId) {
      getFavoriteRestaurantMutation.mutate(userId);
    }
  }, [userId, getFavoriteRestaurantMutation]);

  const removeFavorite = useCallback(
    (restaurantId: string) => {
      removeFavoriteRestaurantMutation.mutate({ userId, restaurantId });
    },
    [userId, removeFavoriteRestaurantMutation]
  );

  return {
    restaurants,
    fetchFavorites,
    removeFavorite,
    isLoading:
      getFavoriteRestaurantMutation.isPending ||
      removeFavoriteRestaurantMutation.isPending,
    error:
      getFavoriteRestaurantMutation.error ||
      removeFavoriteRestaurantMutation.error,
  };
};
