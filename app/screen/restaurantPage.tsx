import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Icon from "react-native-vector-icons/MaterialIcons";
import DishBox from "../components/dishBox";
import { useMutation } from "@tanstack/react-query";
import {
  getDishesOfRestaurant,
  getCategory,
} from "@/services/api/restaurantApi";
import { useRouter } from "expo-router";
import {
  addFavoriteRestaurant,
  getFavoriteRestaurantIds,
  removeFavoriteRestaurant,
} from "@/services/api/userApi";
import { useSelector } from "react-redux";
import { getOrInitializeConversation } from "@/services/api/chatApi";
import RatingList from "../components/ratingList";
import DishBoxSkeleton from "../components/skeleton/dishBoxSkeleton";
import CategoryButtonSkeleton from "../components/skeleton/categoryButtonSkeleton";

const { width } = Dimensions.get("window");

const RestaurantPage = () => {
  const { data } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState<{ _id: String; name: string }[]>(
    [
      {
        _id: "",
        name: "All",
      },
    ]
  );
  const userId = useSelector((state) => state.user.userId);
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState(categories[0]);
  const [isStartingChat, setIsStartingChat] = useState(false);

  useEffect(() => {
    if (data) {
      setRestaurant(JSON.parse(data));
    }
  }, [data]);
  const dishesMutation = useMutation({
    mutationFn: getDishesOfRestaurant,
    onSuccess: (data) => {
      setDishes(data);
    },
    onError: (error) => {
      console.log(error);
      setDishes([]);
    },
  });
  const changeCategory = () => {
    const data = {
      categoryId: currentCategory._id,
      restaurantId: restaurant?._id,
    };
    dishesMutation.mutate(data);
  };
  const getCategoryMutation = useMutation({
    mutationFn: getCategory,
    onSuccess: (data) => {
      setCategories([{ _id: "", name: "All" }, ...data]);
      setCurrentCategory(categories[0]);
      if (restaurant) {
        changeCategory();
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });
  useEffect(() => {
    if (categories.length == 1) {
      getCategoryMutation.mutate();
    }
    if (userId && restaurant) {
      getFavoriteResMutation.mutate(userId);
    }
  }, [userId, restaurant]);
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    if (restaurant && currentCategory) {
      changeCategory();
    }
  }, [currentCategory]);
  const addToFavoriteRestaurant = useMutation({
    mutationFn: addFavoriteRestaurant,
    onSuccess: () => {
      console.log("Added to favorites");
      setIsFavorite(true);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const removeFavoriteRestaurantMutation = useMutation({
    mutationFn: removeFavoriteRestaurant,
    onSuccess: () => {
      console.log("Removed from favorites");
      setIsFavorite(false);
    },
    onError: (error) => {
      console.error("Error removing favorite restaurant:", error);
    },
  });
  const handleAddToFavorite = () => {
    const data = {
      userId: userId,
      restaurantId: restaurant?._id,
    };
    if (isFavorite) {
      removeFavoriteRestaurantMutation.mutate(data);
    } else {
      addToFavoriteRestaurant.mutate(data);
    }
  };
  const getFavoriteResMutation = useMutation({
    mutationFn: getFavoriteRestaurantIds,
    onSuccess: (data) => {
      console.log("Favorite restaurant IDs:", data);
      const isFavoriteRestaurant = data.some(
        (restaurantId) => restaurantId === restaurant?._id
      );
      setIsFavorite(isFavoriteRestaurant);
    },
    onError: (error) => {
      console.error("Error fetching favorite restaurant IDs:", error);
    },
  });

  const chatInitMutation = useMutation({
    mutationFn: ({ user1, user2 }: { user1: string; user2: string }) =>
      getOrInitializeConversation(user1, user2),
    onSuccess: (data) => {
      console.log("Chat initialization successful:", data);
      setIsStartingChat(false);
      if (data && data.conversationId) {
        router.push({
          pathname: "/customer/chat/[id]",
          params: { id: data.conversationId },
        });
      } else {
        console.error("Missing conversation ID in response:", data);
        alert("Could not start chat. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Error initializing chat:", error);
      setIsStartingChat(false);
      alert("Failed to start chat. Please try again.");
    },
  });

  const handleChatWithRestaurant = () => {
    console.log("Chat button clicked");

    if (!userId) {
      console.log("User not logged in, redirecting to login");
      router.push("/auth/login");
      return;
    }

    if (!restaurant?._id) {
      console.error("Restaurant ID is missing");
      alert("Cannot start chat: restaurant information is missing");
      return;
    }

    console.log(
      `Starting chat between user ${userId} and restaurant ${restaurant._id}`
    );
    setIsStartingChat(true);

    // Add a small delay to ensure state update is visible
    setTimeout(() => {
      chatInitMutation.mutate({
        user1: userId,
        user2: restaurant._id,
      });
    }, 100);
  };

  return (
    <ScrollView className='bg-gray-100 flex-1'>
      <View className='absolute flex-1 flex-row w-screen right-5 items-center justify-between top-5 left-5 z-10'>
        <TouchableOpacity
          onPress={() => router.back()}
          className='bg-white rounded-full p-2 shadow-md'>
          <Icon name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
        <TouchableOpacity
          className='bg-customYellow p-1 rounded-lg'
          style={{ zIndex: 30 }}>
          <Icon name='cart-outline' size={24} color={"black"} />
        </TouchableOpacity>
      </View>
      <View className='relative'>
        {restaurant?.banners && restaurant.banners.length > 0 && (
          <>
            <Carousel
              loop
              width={width}
              height={200}
              autoPlay
              data={restaurant.banners}
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => setCurrentIndex(index)}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  className='w-full h-52 rounded-lg'
                  resizeMode='cover'
                />
              )}
            />
            <View className='absolute bottom-4 left-1/2 -translate-x-1/2 flex-row'>
              {restaurant.banners.map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    currentIndex === index
                      ? "bg-white opacity-100"
                      : "bg-gray-400 opacity-50"
                  }`}
                />
              ))}
            </View>
          </>
        )}
      </View>

      <View className='px-4 py-2'>
        <View className='flex-row items-center justify-between gap-2 mb-2'>
          <Text className='text-3xl font-bold text-gray-900' numberOfLines={2}>
            {restaurant?.name}
          </Text>

          <View className='flex-row items-center gap-4'>
            <TouchableHighlight onPress={handleAddToFavorite}>
              <Icon
                name={isFavorite ? "favorite" : "favorite-border"}
                size={24}
                color={isFavorite ? "#FF6347" : "gray"}
              />
            </TouchableHighlight>
            <TouchableHighlight
              style={{
                padding: 10,
                borderRadius: 20,
              }}
              underlayColor='#f0f0f0'
              onPress={() => {
                console.log("Chat button pressed");
                handleChatWithRestaurant();
              }}>
              {isStartingChat ? (
                <ActivityIndicator size='small' color='blue' />
              ) : (
                <Icon name='chat-bubble-outline' size={24} color='blue' />
              )}
            </TouchableHighlight>
          </View>
        </View>

        <View className='flex-row items-center space-x-2 mb-2'>
          <Icon name='location-on' size={22} color='#FF6347' />
          <Text className='text-lg text-gray-700'>{restaurant?.address}</Text>
        </View>

        <Text className='text-base text-gray-600 leading-6'>
          {restaurant?.description}
        </Text>

        <View className='flex-row items-center mt-4 space-x-2'>
          <Icon name='star' size={24} color={"#FFC107"} />
          <Text className='text-lg font-medium text-gray-800'>
            {restaurant?.rating} 4.5 / 5
          </Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className='flex-row px-4 py-2 '>
        {getCategoryMutation.isPending ? (
          <CategoryButtonSkeleton />
        ) : (
          categories.map((category, index) => (
            <TouchableHighlight
              key={index}
              onPress={() => {
                setCurrentCategory(category);
              }}
              underlayColor='#FACC15'
              className={`rounded-lg px-4 py-2 transition-all border mx-1 border-customYellow duration-300 ${
                category._id == currentCategory._id
                  ? "bg-customYellow"
                  : "bg-white"
              }`}>
              <Text
                className={`text-sm font-semibold ${
                  category._id == currentCategory._id
                    ? "text-white"
                    : "text-customYellow"
                }`}>
                {category.name}
              </Text>
            </TouchableHighlight>
          ))
        )}
      </ScrollView>
      <View>
        {dishesMutation.isPending ? (
          <View className='flex-row flex-wrap p-4 justify-between gap-y-4'>
            {Array.from({ length: 6 }, (_, index) => (
              <DishBoxSkeleton key={index} />
            ))}
          </View>
        ) : dishes.length > 0 ? (
          <View className='flex-row flex-wrap p-4 justify-between gap-y-4'>
            {dishes.map((dish, index) => (
              <DishBox key={index} dish={dish} />
            ))}
          </View>
        ) : (
          <Text className='text-center text-gray-500'>No dishes found</Text>
        )}
      </View>
      {restaurant?._id && <RatingList restaurantId={restaurant?._id} />}
    </ScrollView>
  );
};

export default RestaurantPage;
