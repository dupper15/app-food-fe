import ListVoucherItem from "@/components/items/voucherItem";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Voucher() {
  const router = useRouter();
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleCreateVoucher = () => {
    // router.push({
    //   pathname: "/components/voucherModal",
    //   params: {
    //     voucher: null,
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
        <Text className='font-bold text-2xl'>Voucher</Text>
        <TouchableOpacity
          className='bg-[#FFC515] rounded-md w-8 h-8 items-center justify-center'
          onPress={handleCreateVoucher}>
          <FontAwesome6 name='plus' size={18} color='white' />
        </TouchableOpacity>
      </View>

      {/* list voucher */}
      <ListVoucherItem setRefresh={setRefresh} refresh={refresh} />
    </View>
  );
}
