import ToppingMenu from "@/components/items/toppingItem";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Topping() {
  const router = useRouter();
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleCreateTopping = () => {
    // router.push({
    //   pathname: "/screens/components/toppingModal",
    //   params: {
    //     topping: null,
    //   },
    // });
  };

  useFocusEffect(
    useCallback(() => {
      setRefresh((prev) => !prev);
    }, []),
  );
  return (
    <View className='h-full flex-col bg-white'>
      {/* header */}
      <View className='flex-row w-full h-14 bg-white items-center justify-between px-4 border-b border-gray-100'>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='chevron-back-outline' size={24} color='black' />
        </TouchableOpacity>
        <Text className='font-bold text-2xl'>Topping</Text>
        <TouchableOpacity
          onPress={() => handleCreateTopping()}
          className='flex-row bg-[#FFC515] rounded-md w-8 h-8 items-center justify-center'>
          <FontAwesome6 name='plus' size={18} color='white' />
        </TouchableOpacity>
      </View>

      {/* list rating */}
      <ToppingMenu setRefresh={setRefresh} refresh={refresh} />
    </View>
  );
}
