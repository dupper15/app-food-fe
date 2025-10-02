import { Text, View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useFocusEffect, useRouter } from "expo-router";
import ListMenuItem from "@/app/components/menuItem";
import { useCallback, useState } from "react";

export default function Menu() {
  const router = useRouter();
  const [refresh, setRefresh] = useState(false);

  const handleCreateDish = () => {
    router.push({
      pathname: "/components/dishModal",
      params: {
        dish: null,
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      setRefresh((prev) => !prev);
    }, [])
  );

  return (
    <View className='h-full flex-col  bg-slate-100'>
      {/* header */}
      <View className='flex-row w-full h-14 bg-white items-center justify-between px-4 border-b border-gray-100'>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='chevron-back-outline' size={24} color='black' />
        </TouchableOpacity>
        <Text className='font-bold text-2xl'>Menu</Text>
        <TouchableOpacity
          className='flex-row bg-[#FFC515] rounded-md w-8 h-8 items-center justify-center'
          onPress={() => handleCreateDish()}>
          <FontAwesome6 name='plus' size={18} color='white' />
        </TouchableOpacity>
      </View>

      {/* list dishes in menu */}
      <ListMenuItem setRefresh={setRefresh} refresh={refresh} />
    </View>
  );
}
