import { RestaurantData } from "@/interfaces/RestaurantInterface";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import * as ResApi from "../../apis/restaurantApi";
import Category from "../components/category";
import RestaurantBox from "../components/restaurantBox";
import { useRouter } from "expo-router";
export default function Home() {
  const userId = useSelector(
    (state: { user: { userId: string } }) => state.user.userId
  );

  const [restaurantHistory, setRestaurantHistory] = useState<RestaurantData[]>(
    []
  );
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
  const router = useRouter();
  return (
    <View className='flex-1 bg-gray-100'>
      <View className='h-40 bg-gradient-to-b from-black to-gray-600 px-4 py-8'>
        <View className='flex-row justify-between items-center gap-2'>
          <View className='flex-1 flex-row bg-white rounded-lg px-3 py-1 items-center border border-gray-300'>
            <Icon name='search' size={20} color={"#94a3b8"} />
            <TextInput
              placeholder='Search for products...'
              placeholderTextColor={"#94a3b8"}
              className='flex-1 pl-2 text-slate-900'
            />
            <TouchableOpacity>
              <Icon name='camera' size={24} color={"#FFC515"} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className='bg-customYellow p-1 rounded-lg'
            onPress={() => router.push("/screen/cartPage")}>
            <Icon name='cart-outline' size={24} color={"black"} />
          </TouchableOpacity>

          <TouchableOpacity className='bg-black p-1 rounded-lg'>
            <Icon
              name='chatbubble-ellipses-outline'
              size={24}
              color={"#FFC515"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className='absolute top-20 left-1/2 -translate-x-1/2 w-11/12 h-44 rounded-lg shadow-lg bg-white z-10 overflow-hidden'>
        <Image
          source={{
            uri: "https://img.freepik.com/premium-vector/social-media-food-design-restaurant-banner-post-template-business-promotion_784890-596.jpg",
          }}
          className='w-full h-full'
          resizeMode='cover'
        />
      </View>

      <ScrollView className='flex-1 mt-28 px-4 py-6 pr-0'>
        <Category />

        <View className='flex-1 gap-4 pr-6 '>
          <View className='flex-row justify-between items-center gap-4'>
            <TouchableOpacity className='flex-1 bg-customYellow rounded-lg p-4 relative pb-10'>
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

            <TouchableOpacity className='flex-1 bg-black rounded-lg p-4 relative pb-10'>
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
            <TouchableOpacity className='flex-1 bg-black rounded-lg p-4 relative pb-10'>
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

            <TouchableOpacity className='flex-1 bg-customYellow rounded-lg p-4 relative pb-10'>
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
      </ScrollView>
    </View>
  );
}
