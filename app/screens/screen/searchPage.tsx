import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import RestaurantBox from "@/components/items/restaurantBox";

const SearchPage = () => {
  const { search, searchedRestaurants } = useLocalSearchParams();
  const router = useRouter();

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (searchedRestaurants) {
      setRestaurants(JSON.parse(searchedRestaurants));
    }
  }, [searchedRestaurants]);

  return (
    <View className='flex-1 bg-slate-100 px-4 pt-4'>
      <View className='flex-row items-center gap-2 mb-4'>
        <TouchableOpacity
          onPress={() => router.back()}
          className='flex-1 flex-row items-center bg-white border border-slate-300 rounded-full px-4 py-2'>
          <Ionicons name='search' size={20} color='#9ca3af' />
          <Text className='ml-2 text-base text-gray-800 text-left flex-1'>
            {search}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/screens/customer/(tabs)/home")}>
          <Text className='text-slate-800 font-medium'>Close</Text>
        </TouchableOpacity>
      </View>

      <Text className='text-lg font-semibold text-slate-700 mb-2'>
        Results for "{search}"
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {restaurants.length > 0 ? (
          <View className='flex-row flex-wrap justify-between gap-y-4'>
            {restaurants.map((restaurant, index) => (
              <RestaurantBox key={index} restaurant={restaurant} />
            ))}
          </View>
        ) : (
          <View className='flex-1 justify-center items-center mt-20'>
            <Ionicons name='restaurant-outline' size={48} color='#9ca3af' />
            <Text className='mt-2 text-base text-slate-500'>
              No restaurant found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchPage;
