import ListVoucherItem from "@/app/components/voucherItem";
import VoucherModal from "@/app/components/voucherModal";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Voucher() {
  const route = useRouter();

  const [openModal, setOpenModal] = useState(false);

  const handleCreateVoucher = () => {
    setOpenModal(true);
  };

  return (
    <View className="h-full flex-col  bg-white">
      {/* header */}
      <View className="flex-row w-full h-14 bg-white items-center justify-between px-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => route.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl">Voucher</Text>
        <TouchableOpacity
          className="bg-black rounded-md w-8 h-8 items-center justify-center"
          onPress={() => handleCreateVoucher()}
        >
          <FontAwesome6 name="plus" size={18} color="#FFC515" />
        </TouchableOpacity>
      </View>

      {/* list voucher */}
      <ListVoucherItem />

      {openModal && <VoucherModal setShowModal={setOpenModal} voucher={null} />}
    </View>
  );
}
