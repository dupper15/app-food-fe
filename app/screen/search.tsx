import { textSearch } from "@/services/api/searchApi";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Search = () => {
  const [query, setQuery] = useState("");
  const searchMutation = useMutation({
    mutationFn: textSearch,
    onSuccess: (data) => {
      console.log("da xong", data);
      const searchedRestaurants = JSON.stringify(data);
      router.push({
        pathname: "/screen/searchPage",
        params: { search: query, searchedRestaurants: searchedRestaurants },
      });
    },
    onError: (error) => {
      console.error("Error searching:", error);
    },
  });
  const handleSearch = () => {
    Keyboard.dismiss();
    searchMutation.mutate(query);
  };
  const router = useRouter();
  return (
    <View className='flex-1 bg-white p-4'>
      <View className='flex-row items-center justify-between mb-4 space-x-2'>
        <View className='flex-1 flex-row items-center bg-slate-100 border border-slate-300 rounded-full px-4 py-2 space-x-2'>
          <Ionicons name='search' size={20} color='#9ca3af' />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder='Tìm kiếm món ăn, nhà hàng...'
            className='flex-1 text-base text-gray-800'
            placeholderTextColor='#9ca3af'
            returnKeyType='search'
            onSubmitEditing={handleSearch}
          />
        </View>

        <TouchableOpacity onPress={() => router.back()}>
          <Text className='text-slate-800 font-medium'>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Search;
