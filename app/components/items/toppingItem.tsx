import { Topping } from "@/types/ToppingInterface";
import { deleteTopping, fetchAllToppingByRestaurant } from "@/apis/toppingApi";
import { formatPrice } from "@/utils/format";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import ConfirmDeleteModal from "../modals/deleteModal";
import { useRouter } from "expo-router";
import { CustomToast } from "../ui/toast";

interface ListMenuItemProps {
  setRefresh: (value: boolean) => void;
  refresh: boolean;
}

export default function ToppingMenu({
  setRefresh,
  refresh,
}: ListMenuItemProps) {
  const restaurantId = useSelector(
    (state: { restaurant: { restaurantId: string } }) =>
      state.restaurant.restaurantId
  );
  const router = useRouter();
  const [toppings, setToppings] = useState([]);
  const [selectTopping, setSelectTopping] = useState<Topping | null>();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const hasFetched = useRef(false);

  const fetchAllToppingMutaion = useMutation({
    mutationFn: (id: string) => fetchAllToppingByRestaurant(id),
    onSuccess: (data: any) => {
      setToppings(data.reverse());
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const deleteToppingMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteTopping(id);
    },
    onSuccess: (data: any) => {
      CustomToast("success", "Succes", "Deleted topping successfully!");
      setRefresh(true);
      setDeleteModalVisible(false);
      setSelectTopping(null);
    },
    onError: () => {
      console.error = () => {};
      CustomToast("error", "Error", "Failed to delete topping");
    },
  });

  useEffect(() => {
    if (!restaurantId) return;

    if (refresh) {
      fetchAllToppingMutaion.mutate(restaurantId);
      setRefresh(false);
      return;
    }

    if (!hasFetched.current) {
      fetchAllToppingMutaion.mutate(restaurantId);
      hasFetched.current = true;
    }
  }, [restaurantId, refresh]);

  const handleEditTopping = (item: Topping) => {
    router.push({
      pathname: "/components/modals/toppingModal",
      params: {
        topping: JSON.stringify(item),
      },
    });
    setSelectTopping(item);
  };

  const handleDeleteTopping = (id: string) => {
    deleteToppingMutation.mutate(id);
  };

  const openDeleteConfirmation = (item: Topping) => {
    setSelectTopping(item);
    setDeleteModalVisible(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteModalVisible(false);
    setSelectTopping(null);
  };

  const confirmDelete = () => {
    if (selectTopping) {
      handleDeleteTopping(selectTopping._id);
    }
  };

  const renderItem = ({ item }: { item: Topping }) => (
    <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-200'>
      <Text className='flex-1 text-base font-semibold'>{item.name}</Text>

      <Text className='w-20 text-base text-left text-gray-500'>
        {formatPrice(item.price)}
      </Text>

      <View className='flex-row ml-2 gap-2'>
        <TouchableOpacity
          onPress={(e) => {
            e.preventDefault();
            openDeleteConfirmation(item);
          }}
          className='w-8 h-8 items-center justify-center bg-[#FFC515] rounded-full'>
          <MaterialCommunityIcons
            name='delete-outline'
            size={20}
            color='white'
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(e) => {
            e.preventDefault();
            handleEditTopping(item);
          }}
          className='w-8 h-8 items-center justify-center bg-[#FFC515] rounded-full'>
          <Ionicons name='pencil-outline' size={20} color='white' />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className='bg-white h-full'>
      {isLoading ? (
        <ActivityIndicator size='large' color='#FFC515' className='mt-10' />
      ) : (
        <FlatList
          data={toppings}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDelete}
        itemName={selectTopping?.name || ""}
      />
    </View>
  );
}
