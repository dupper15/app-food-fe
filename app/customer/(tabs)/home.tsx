import { RestaurantData } from "@/interfaces/RestaurantInterface";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import * as ResApi from "@/services/api/restaurantApi";
import Category from "@/app/components/category";
import RestaurantBox from "@/app/components/restaurantBox";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ImageSearch from "@/app/components/imageSearch";
import CriteriaComponent from "@/app/components/criteriaComponent";

export default function Home() {
  const userId = useSelector(
    (state: { user: { userId: string } }) => state.user.userId
  );

  const [restaurantHistory, setRestaurantHistory] = useState<RestaurantData[]>(
    []
  );
  const [isImageSearch, setIsImageSearch] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [rcmRestaurant, setRcmRestaurant] = useState<RestaurantData[]>([]);
  const getRestaurantHistoryMutation = useMutation({
    mutationFn: ResApi.getRestaurantHistory,
    onSuccess: (data: any) => {
      setRestaurantHistory(data);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
  const getRcmRestaurantMutaion = useMutation({
    mutationFn: ResApi.getRcmRestaurant,
    onSuccess: (data: any) => {
      setRcmRestaurant(data);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
  const getRestaurantHistory = async () => {
    getRestaurantHistoryMutation.mutate(userId);
  };
  const getRcmRestaurant = async () => {
    getRcmRestaurantMutaion.mutate(userId);
  };
  useEffect(() => {
    if (userId) {
      getRestaurantHistory();
      getRcmRestaurant();
    }
  }, [userId]);
  const navigateCart = () => {
    router.push("/screen/cartPage");
  };
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const bannerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50], // trượt lên
    extrapolate: "clamp",
  });

  const bannerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const blackViewHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [160, 70], // Chiều cao giảm từ 160px xuống 30px khi cuộn
    extrapolate: "clamp", // Giới hạn không cho giá trị vượt qua 160px và 30px
  });
  const handlePickCriteria = (restaurantCriteria: string, header: string) => {
    const params = {
      restaurantCriteria: JSON.stringify(restaurantCriteria),
      header,
    };

    router.push({
      pathname: "/screen/restaurantSelection",
      params,
    });
  };
  return (
    <View className='flex-1 bg-gray-100 pb-4'>
      <Animated.View
        style={{
          height: blackViewHeight,
          zIndex: 10,
          paddingTop: 8,
          paddingHorizontal: 8,
        }}>
        <View className='flex-row items-center w-full gap-2'>
          <View className='flex-1 flex-row items-center w-full bg-white rounded-lg pr-2 gap-2 border border-gray-300'>
            <TouchableOpacity
              className='flex-1 flex-row items-center px-4 py-2 rounded-full'
              onPress={() => router.push("/screen/search")}>
              <Icon name='search' size={20} color='#94a3b8' className='mr-2' />
              <Text className='text-slate-400'>Search for meals...</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsImageSearch(true)}
              className='pl-3'>
              <Ionicons name='camera' size={24} color='#FFC515' />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={navigateCart}
            className='bg-customYellow p-2 rounded-lg'
            style={{ zIndex: 30 }}>
            <Icon name='cart-outline' size={20} color='black' />
          </TouchableOpacity>
          <TouchableOpacity
            className='p-2 bg-black rounded-lg'
            style={{ zIndex: 30 }}
            activeOpacity={0.7}
            onPress={() => {
              console.log("Chat button pressed");
              router.push("/customer/chat");
            }}>
            <Ionicons
              name='chatbubble-ellipses-outline'
              size={20}
              color='#FFC515'
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View
        style={{
          position: "absolute",
          top: 80,
          left: "4.5%",
          width: "91%",
          height: 176,
          borderRadius: 16,

          overflow: "hidden",
          zIndex: 40,
          transform: [{ translateY: bannerTranslateY }],
          opacity: bannerOpacity,
        }}>
        <Image
          source={{
            uri: "https://img.freepik.com/premium-vector/social-media-food-design-restaurant-banner-post-template-business-promotion_784890-596.jpg",
          }}
          style={{ width: "100%", height: "100%" }}
          resizeMode='cover'
        />
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        style={{
          flex: 1,
          paddingLeft: 16,
          paddingRight: 0,
          paddingTop: 110,
          paddingBottom: 32,
        }}>
        <Category handlePickCriteria={handlePickCriteria} />
        <View className='flex-1 gap-4 pr-6 mt-2'>
          <CriteriaComponent handlePickCriteria={handlePickCriteria} />
        </View>

        <View className='mt-4 gap-2 mr-2'>
          <Text className='text-slate-900 text-lg font-medium'>
            Order again
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className='flex-row gap-4'>
              {restaurantHistory.map((restaurant, index) => (
                <RestaurantBox key={index} restaurant={restaurant} />
              ))}
            </View>
          </ScrollView>
        </View>

        <View className='mt-4 gap-2 mr-2'>
          <Text className='text-slate-900 text-lg font-medium'>For you</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className='flex-row gap-4'>
              {rcmRestaurant.map((restaurant, index) => (
                <RestaurantBox key={index} restaurant={restaurant} />
              ))}
            </View>
          </ScrollView>
        </View>
        <View className='mt-4 gap-2 mr-2 '>
          <Text className='text-slate-900 text-lg font-medium'>All</Text>
          <View className='flex-row flex-wrap justify-between gap-y-4 gap-x-4'>
            {rcmRestaurant.map((restaurant, index) => (
              <RestaurantBox key={index} restaurant={restaurant} />
            ))}
          </View>
        </View>
      </Animated.ScrollView>
      {isImageSearch && <ImageSearch setShowModal={setIsImageSearch} />}
    </View>
  );
}
