import { formatPrice, formatRatio } from "@/utils/formatPrice";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import DishModal from "./dishModal";
import { Voucher } from "@/interfaces/VoucherInterface";
import VoucherModal from "./voucherModal";

const vouchers: Voucher[] = [
  {
    id: "1",
    name: "Khuyen mai thang 12",
    code: "CTHCGSCN001",
    quantity: 10,
    restaurant_id: "2",
    value: 0.1, // Giá trị hợp lý hơn cho một món ăn
    max: 100000,
    start_date: new Date("2025-03-24"), // Ngày bắt đầu bán
    expire_date: new Date("2025-04-24"),
  },
  {
    id: "2",
    name: "Khuyen mai thang 12",
    code: "CTHCGSCN001",
    quantity: 10,
    value: 100000, // Giá trị hợp lý hơn cho một món ăn
    max: 100,
    restaurant_id: "2",
    start_date: new Date("2025-03-24"), // Ngày bắt đầu bán
    expire_date: new Date("2025-04-24"),
  },
  {
    id: "3",
    name: "Khuyen mai thang 12",
    code: "CTHCGSCN001",
    quantity: 10,
    value: 100000, // Giá trị hợp lý hơn cho một món ăn
    max: 100,
    restaurant_id: "2",
    start_date: new Date("2025-03-24"), // Ngày bắt đầu bán
    expire_date: new Date("2025-04-24"),
  },
];

export default function ListVoucherItem() {
  const [openModal, setOpenModal] = useState(false);
  const [selectVoucher, setSelectVoucher] = useState<Voucher | null>(null);

  const handleEditVoucher = (item: Voucher) => {
    setOpenModal(true);
    setSelectVoucher(item);
  };

  const renderItem = ({ item }: { item: Voucher }) => (
    <TouchableOpacity
      onPress={(e) => e.preventDefault()}
      className="flex-row items-center px-4 py-3"
    >
      <View className="rounded-2xl bg-white shadow-sm w-full p-4 border border-gray-200 gap-3">
        {/* Tên và mã Voucher */}
        <View className="flex-col items-start gap-2">
          <Text className="text-lg font-bold text-black truncate">
            {item.name}
          </Text>
          <Text className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-md">
            {item.code}
          </Text>
        </View>

        {/* Giá trị và số lượng */}
        <View className="flex-row items-center justify-between">
          <Text className="text-base text-[#389C9A] font-semibold">
            Value: {formatRatio(item.value)}
          </Text>
          <Text className="text-base text-[#389C9A] font-semibold">
            Max: {formatRatio(item.max)}
          </Text>
          <Text className="text-base text-[#389C9A] font-semibold">
            Quantity: {item.quantity}
          </Text>
        </View>

        {/* Ngày bắt đầu và ngày hết hạn */}
        <View className="flex-row items-center justify-between text-sm text-gray-500">
          <View className="flex-row items-center gap-1">
            <Ionicons name="calendar-outline" size={16} color="#888" />
            <Text>Start: {item.start_date.toLocaleDateString()}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="calendar-outline" size={16} color="#888" />
            <Text>Expire: {item.expire_date.toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Nút chỉnh sửa */}
        <TouchableOpacity
          onPress={() => handleEditVoucher(item)}
          className="mt-2 w-full bg-[#FFC515] py-2 rounded-lg items-center"
        >
          <Text className="text-white font-semibold">Edit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="bg-white h-full">
      <FlatList
        data={vouchers}
        renderItem={renderItem}
        horizontal={false}
        keyExtractor={(item) => item.id}
        className="pb-20"
      />

      {openModal && (
        <VoucherModal setShowModal={setOpenModal} voucher={selectVoucher} />
      )}
    </View>
  );
}
