import { RestaurantData } from "@/interfaces/RestaurantInterface";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
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
    <View className='flex-1 bg-gray-100'>
      <Animated.View
        style={{
          background: "linear-gradient(to bottom, black, #333333)",
          height: blackViewHeight,
          zIndex: 10,
          paddingTop: 16,
          paddingHorizontal: 16,
        }}>
        <View className='flex-row items-center w-full space-x-2'>
          <View className='flex-1 flex-row items-center bg-white rounded-lg pr-2 border border-gray-300'>
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
          { useNativeDriver: true }
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

        <View className='flex-1 gap-4 pr-6 '>
          <View className='flex-row justify-between items-center gap-4'>
            <TouchableOpacity
              onPress={() => handlePickCriteria("Near me", "Near me")}
              className='flex-1 bg-customYellow rounded-lg p-4 relative pb-10'>
              <Text className='text-black text-lg font-medium'>Near me</Text>
              <Text className='text-black text-sm font-normal'>
                Just in few minutes
              </Text>
              <Icon
                name='location-outline'
                size={40}
                color={"black"}
                className='absolute bottom-2 right-2'
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handlePickCriteria("Recommended", "Recommended")}
              className='flex-1 bg-black rounded-lg p-4 relative pb-10'>
              <Text className='text-customYellow text-lg font-medium'>
                Recommended
              </Text>
              <Text className='text-customYellow text-sm font-normal'>
                You may also like
              </Text>
              <Icon
                name='thumbs-up-outline'
                size={40}
                color={"#FFC515"}
                className='absolute bottom-2 right-2'
              />
            </TouchableOpacity>
          </View>

          <View className='flex-row justify-between items-center gap-4'>
            <TouchableOpacity
              onPress={() =>
                handlePickCriteria("Multiple deals", "Multiple deals")
              }
              className='flex-1 bg-black rounded-lg p-4 relative pb-10'>
              <Text className='text-customYellow text-lg font-medium'>
                Multiple deals
              </Text>
              <Text className='text-customYellow text-sm font-normal'>
                Save your money
              </Text>
              <Icon
                name='pricetag-outline'
                size={40}
                color={"#FFC515"}
                className='absolute bottom-2 right-2'
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handlePickCriteria("Multiple buyers", "Multiple buyers")
              }
              className='flex-1 bg-customYellow rounded-lg p-4 relative pb-10'>
              <Text className='text-black text-lg font-medium'>
                Multiple buyers
              </Text>
              <Text className='text-black text-sm font-normal'>
                Can be consulted
              </Text>
              <Icon
                name='people-outline'
                size={40}
                color={"black"}
                className='absolute bottom-2 right-2'
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className='mt-32 gap-2'>
          <Text className='text-slate-900 text-lg font-medium'>
            Order again
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {restaurantHistory.map((restaurant, index) => (
              <RestaurantBox key={index} restaurant={restaurant} />
            ))}
          </ScrollView>
        </View>

        <View className='mt-6 gap-2'>
          <Text className='text-slate-900 text-lg font-medium'>For you</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {rcmRestaurant.map((restaurant, index) => (
              <RestaurantBox key={index} restaurant={restaurant} />
            ))}
          </ScrollView>
        </View>
      </Animated.ScrollView>
      {isImageSearch && <ImageSearch setShowModal={setIsImageSearch} />}
    </View>
  );
}
