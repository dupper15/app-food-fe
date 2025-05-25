import { textSearch } from "@/services/api/searchApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

const Search = () => {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const userId = useSelector((state: any) => state.user.userId);
  const router = useRouter();
  const searchMutation = useMutation({
    mutationFn: textSearch,
    onSuccess: (data) => {
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
  useEffect(() => {
    console.log("vo roi");
    if (userId) {
      console.log("User ID:", userId);
      getHistory();
    }
  }, [userId]);
  const getHistory = async () => {
    try {
      const value = await AsyncStorage.getItem(`searched${userId}`);
      if (value !== null) {
        setHistory(value.split("|"));
      }
    } catch (error) {
      console.error("Error retrieving history:", error);
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    saveToHistory(query);
    Keyboard.dismiss();
    searchMutation.mutate(query);
  };

  const saveToHistory = async (newQuery) => {
    try {
      const key = `searched${userId}`;
      const value = await AsyncStorage.getItem(key);
      let history = value ? value.split("|") : [];

      history = [newQuery, ...history.filter((q) => q !== newQuery)].slice(
        0,
        10
      );

      await AsyncStorage.setItem(key, history.join("|"));
      setHistory(history);
    } catch (e) {
      console.error("Lỗi khi lưu lịch sử:", e);
    }
  };

  return (
    <View className='flex-1 bg-white p-4'>
      <View className='flex-row items-center mb-4 gap-2'>
        <View className='flex-1 flex-row items-center bg-slate-100 border border-slate-300 rounded-full px-4 py-2 gap-2'>
          <Ionicons name='search' size={20} color='#9ca3af' />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder='Search dishes, restaurantts...'
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

      {history.length > 0 && (
        <View className='flex-row justify-between items-center mb-2'>
          <Text className='text-lg font-semibold text-slate-800'>
            Lịch sử tìm kiếm
          </Text>
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.removeItem(`searched${userId}`);
              setHistory([]);
            }}>
            <Text className='text-red-600 font-medium'>Xoá hết</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='flex flex-wrap flex-col gap-2'>
          {history.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setQuery(item);
                handleSearch();
              }}
              className='bg-slate-100 rounded-full px-4 py-2'>
              <Text className='text-slate-800'>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Search;
