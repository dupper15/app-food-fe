import { textSearch } from "@/apis/searchApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

const Search = () => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<TextInput>(null);
  const [history, setHistory] = useState([]);
  const userId = useSelector((state: any) => state.user.userId);
  const router = useRouter();
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      const length = query.length;
      inputRef.current.setNativeProps({
        selection: { start: length, end: length },
      });
    }
  }, []);

  const searchMutation = useMutation({
    mutationFn: textSearch,
    onSuccess: (data) => {
      const searchedRestaurants = JSON.stringify(data);
      router.push({
        pathname: "/screens/screen/searchPage",
        params: { search: query, searchedRestaurants: searchedRestaurants },
      });
    },
    onError: (error) => {
      console.error("Error searching:", error);
    },
  });
  useEffect(() => {
    if (userId) {
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
        10,
      );

      await AsyncStorage.setItem(key, history.join("|"));
      setHistory(history);
    } catch (e) {
      console.error("Lỗi khi lưu lịch sử:", e);
    }
  };

  return searchMutation.isPending ? (
    <View className='flex-1 justify-center items-center'>
      <ActivityIndicator size='large' color='#1e40af' />
    </View>
  ) : (
    <View className='flex-1 bg-slate-100 p-4'>
      <View className='flex-row items-center mb-4 gap-2'>
        <View className='flex-1 flex-row items-center bg-white border border-slate-300 rounded-full px-4 py-2 gap-2'>
          <Ionicons name='search' size={20} color='#9ca3af' />
          <TextInput
            value={query}
            ref={inputRef}
            onChangeText={setQuery}
            placeholder='Search dishes, restaurants...'
            className='flex-1 text-base mb-2 text-gray-800'
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
            Your history
          </Text>
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.removeItem(`searched${userId}`);
              setHistory([]);
            }}>
            <Text className='text-red-600 font-medium'>Delete all</Text>
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
