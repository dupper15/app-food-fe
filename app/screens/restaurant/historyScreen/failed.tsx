import { fetchAllHistoryFailed } from "@/apis/historyApi";
import { formatCodeOrder, formatDate, formatPrice } from "@/utils/format";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";

export default function Failed({
  data,
  refresh,
  setRefresh,
}: {
  data: any[];
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}) {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);

  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    setItems(data);
  }, [data]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchKeyword =
        item.customer_id?.name
          ?.toLowerCase()
          .includes(searchKeyword.toLowerCase()) ||
        formatCodeOrder(item._id)
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
      return matchKeyword;
    });
  }, [items, searchKeyword]);

  const handleNavigateOrderDetails = (item: any) => {
    console.log(item);
    router.push({
      pathname: "/screens/screen/orderdetail",
      params: { id: item._id },
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleNavigateOrderDetails(item)}>
      <View className='bg-white rounded-lg p-4 flex-row items-center mb-3 border-l-4 border-l-amber-400'>
        <Image
          source={{ uri: item.customer_id?.avatar }}
          className='w-12 h-12 rounded-full bg-gray-200 mr-3'
        />

        <View className='flex-1'>
          <View className='flex-row justify-between'>
            <Text className='font-bold text-gray-800'>
              {item.customer_id?.name || "Unknown"}
            </Text>

            <Text className='text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-md'>
              {formatCodeOrder(item._id)}
            </Text>
          </View>

          <View className='flex-row gap-2'>
            <Text className='font-bold text-gray-800'>Reason:</Text>
            <Text className='font-semibold text-[#E23637]'>{item.reason}</Text>
          </View>

          <View className='flex-row flex-wrap mt-1'>
            <Text className='text-gray-600 text-sm mr-3'>
              {item.sum_dishes} x item
            </Text>
            <Text className='text-[#389C9A] text-sm font-semibold mr-3'>
              {formatPrice(item.cost)}
            </Text>
            <Text className='text-gray-600 text-sm'>
              {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (data.length === 0) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text className='text-gray-500'>No data available</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 px-4'>
      <TextInput
        placeholder='Search by name or order code'
        value={searchKeyword}
        onChangeText={setSearchKeyword}
        className='border border-gray-300 rounded-md px-4 py-2 mt-3 mb-2 bg-white'
      />
      <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <Text className='text-center text-gray-500 mt-4'>
            No matching results found.
          </Text>
        }
      />
    </View>
  );
}
