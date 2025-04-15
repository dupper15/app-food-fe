import {
  formatCode,
  formatDate,
  formatPrice,
  formatRatio,
} from "@/utils/format";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import { VoucherData } from "@/interfaces/VoucherInterface";
import VoucherModal from "./voucherModal";
import { useMutation } from "@tanstack/react-query";
import { deleteVoucher, getAllVouchers } from "@/services/api/voucherApi";
import { CustomToast } from "./toast";
import { useSelector } from "react-redux";
import ConfirmDeleteModal from "./deleteModal";
import { useRouter } from "expo-router";

interface ListVoucherItemProps {
  setRefresh: (value: boolean) => void;
  refresh: boolean;
}

export default function ListVoucherItem({
  setRefresh,
  refresh,
}: ListVoucherItemProps) {
  const router = useRouter();
  const [selectVoucher, setSelectVoucher] = useState<VoucherData | null>(null);
  const restaurantId = useSelector(
    (state: { restaurant: { restaurantId: string | null } }) =>
      state.restaurant.restaurantId
  );
  const [vouchers, setVouchers] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  const handleEditVoucher = (item: VoucherData) => {
    router.push({
      pathname: "/components/voucherModal",
      params: {
        voucher: JSON.stringify(item),
      },
    });
    setSelectVoucher(item);
  };

  const fetchAllVoucherMutation = useMutation({
    mutationFn: getAllVouchers,
    onSuccess: (data) => {
      setVouchers(data.reverse());
      setIsLoading(false);
      setRefresh(false);
    },
    onError: (error: any) => {
      console.error("Error loading voucher:", error);
      CustomToast(
        "error",
        "Error",
        "Loading vouchers failed! Please try again"
      );
    },
  });

  const deleteVoucherMutation = useMutation({
    mutationFn: deleteVoucher,
    onSuccess: (data: any) => {
      CustomToast("success", "Succes", "Deleted voucher successfully!");
      setRefresh(true);
      setDeleteModalVisible(false);
      setSelectVoucher(null);
    },
    onError: (error: any) => {
      console.error("Error deleting voucher:", error);
      CustomToast("error", "Error", "Failed to delete voucher");
    },
  });

  useEffect(() => {
    if (!restaurantId) return;

    if (refresh) {
      fetchAllVoucherMutation.mutate(restaurantId);
      setRefresh(false);
      return;
    }

    if (!hasFetched.current) {
      fetchAllVoucherMutation.mutate(restaurantId);
      hasFetched.current = true;
    }
  }, [restaurantId, refresh]);

  const handleDeleteVoucher = (id: string) => {
    deleteVoucherMutation.mutate(id);
  };

  const openDeleteConfirmation = (item: VoucherData) => {
    setSelectVoucher(item);
    setDeleteModalVisible(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteModalVisible(false);
    setSelectVoucher(null);
  };

  const confirmDelete = () => {
    if (selectVoucher) {
      handleDeleteVoucher(selectVoucher._id);
    }
  };

  const renderItem = ({ item }: { item: VoucherData }) => (
    <View className="flex-row items-center px-4 py-3">
      <View className="rounded-2xl bg-white shadow-sm w-full p-4 border border-gray-200 gap-3">
        {/* name, code and content */}
        <View className="flex-col items-start gap-2">
          <Text className="text-lg font-bold text-black truncate">
            {item.name}
          </Text>
          <Text className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-md">
            {formatCode(item._id)}
          </Text>
          <Text className="text-md font-semibold text-black truncate">
            {item.content}
          </Text>
        </View>
        {/* value, max and quantity*/}
        <View className="flex-row items-center justify-start gap-4">
          <Text className="text-base text-[#389C9A] font-semibold">
            Value: {formatRatio(item.value)}
          </Text>
          <Text className="text-base text-[#389C9A] font-semibold">
            Quantity: {item.quantity}
          </Text>
        </View>
        {/* value, max and quantity*/}
        <View className="flex-row items-center justify-start gap-4">
          <Text className="text-base text-[#389C9A] font-semibold">
            Max: {formatPrice(item.max)}
          </Text>
          <Text className="text-base text-[#389C9A] font-semibold">
            Min: {formatPrice(item.min)}
          </Text>
        </View>
        {/* start date and end date */}
        <View className="flex-row items-center justify-between text-sm text-gray-500">
          <View className="flex-row items-center gap-1">
            <Ionicons name="calendar-outline" size={16} color="#888" />
            <Text>Start: {formatDate(item.start_date)}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="calendar-outline" size={16} color="#888" />
            <Text>Expire: {formatDate(item.expire_date)}</Text>
          </View>
        </View>
        {/* delete and edit */}
        <View className="flex-row items-center gap-4 justify-between">
          <TouchableHighlight
            onPress={() => openDeleteConfirmation(item)}
            className="bg-red-500 p-3 rounded-lg flex-1"
          >
            <Text className="text-white text-center font-medium">Delete</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => handleEditVoucher(item)}
            className="bg-[#FFC515] p-3 rounded-lg flex-1"
          >
            <Text className="text-white text-center font-medium">Edit</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );

  return (
    <View className="bg-white h-full">
      {isLoading ? (
        <ActivityIndicator size="large" color="#FFC515" className="mt-10" />
      ) : (
        <FlatList
          data={vouchers}
          renderItem={renderItem}
          horizontal={false}
          keyExtractor={(item) => item._id}
          className="pb-20"
        />
      )}

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDelete}
        itemName={selectVoucher?.name || ""}
      />
    </View>
  );
}
