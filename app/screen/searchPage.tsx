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
import RestaurantBox from "../components/restaurantBox";

const SearchPage = () => {
  const { search, searchedRestaurants } = useLocalSearchParams();
  const router = useRouter();

  const [restaurants, setRestaurants] = useState([]);
  useEffect(() => {
    if (searchedRestaurants) {
      setRestaurants(JSON.parse(searchedRestaurants));
    }
  }, [searchedRestaurants]);
  useEffect(() => {
    console.log("Searched restaurants:", search);
  }, [search]);
  return (
    <View className='flex-1 bg-white p-4'>
      {/* Header Search Box */}
      <View className='flex-row items-center justify-between mb-4 space-x-2'>
        <TouchableOpacity
          onPress={() => router.back()}
          className='flex-1 flex-row items-center bg-slate-100 border border-slate-300 rounded-full px-4 py-2 space-x-2'>
          <Ionicons name='search' size={20} color='#9ca3af' />
          <TextInput
            value={search}
            className='flex-1 text-base text-gray-800'
            placeholderTextColor='#9ca3af'
            returnKeyType='search'
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/customer/(tabs)/home")}>
          <Text className='text-slate-800 font-medium'>Close</Text>
        </TouchableOpacity>
      </View>

      {/* Result Title */}
      <Text className='text-lg font-semibold text-gray-700 mb-2'>
        Answer for "{search}"
      </Text>

      {/* Restaurant Scroll List */}
      {restaurants.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='space-x-3'>
          {restaurants.map((restaurant, index) => (
            <RestaurantBox key={index} restaurant={restaurant} />
          ))}
        </ScrollView>
      ) : (
        <Text className='text-center text-gray-500'>No restaurant found</Text>
      )}
    </View>
  );
};

export default SearchPage;
