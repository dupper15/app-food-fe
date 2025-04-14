import { formatPrice } from "@/utils/format";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import DishModal from "./dishModal";
import { DishData } from "@/interfaces/DishInterface";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { deleteDish, fetchAllDishByRestaurant } from "@/services/api/dishApi";
import { CustomToast } from "./toast";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ConfirmDeleteModal from "./deleteModal";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

interface ListMenuItemProps {
  setRefresh: (value: boolean) => void;
  refresh: boolean;
}

export default function ListMenuItem({
  setRefresh,
  refresh,
}: ListMenuItemProps) {
  const restaurantId = useSelector(
    (state: { restaurant: { restaurantId: string | null } }) =>
      state.restaurant.restaurantId
  );

  const router = useRouter();
  const [selectDish, setSelectDish] = useState<DishData | null>(null);

  const [dishes, setDishes] = useState<DishData[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAllDishByRestaurantMution = useMutation({
    mutationFn: async (id: string) => {
      return await fetchAllDishByRestaurant(id);
    },
    onSuccess: (data: any) => {
      setDishes(data.reverse());
      setRefresh(false);
      setIsLoading(false);
    },
    onError: (error: any) => {
      console.error("Error fetching dishes:", error);
      CustomToast("error", "Error", "Failed to fetch dishes");
    },
  });

  const deleteDishMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteDish(id);
    },
    onSuccess: (data: any) => {
      CustomToast("success", "Succes", "Deleted dish successfully!");
      setRefresh(true);
      setDeleteModalVisible(false);
      setSelectDish(null);
    },
    onError: (error: any) => {
      console.error("Error deleting dish:", error);
      CustomToast("error", "Error", "Failed to delete dish");
    },
  });

  useEffect(() => {
    if (!restaurantId) return;

    if (dishes.length === 0 || refresh) {
      fetchAllDishByRestaurantMution.mutate(restaurantId);
    }

    if (refresh) {
      setRefresh(false);
    }
  }, [refresh, restaurantId]);

  const handleCreateDish = () => {
    router.push({
      pathname: "/components/dishModal",
      params: {
        dish: null,
      },
    });
  };

  const handleEditDish = (item: DishData) => {
    router.push({
      pathname: "/components/dishModal",
      params: {
        dish: JSON.stringify(item),
      },
    });
    setSelectDish(item);
  };

  const handleDeleteDish = (id: string) => {
    deleteDishMutation.mutate(id);
  };

  const openDeleteConfirmation = (item: DishData) => {
    setSelectDish(item);
    setDeleteModalVisible(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteModalVisible(false);
    setSelectDish(null);
  };

  const confirmDelete = () => {
    if (selectDish) {
      handleDeleteDish(selectDish._id);
    }
  };

  const renderItem = ({ item }: { item: DishData }) => (
    <TouchableOpacity
      onPress={(e) => e.preventDefault()}
      className="flex-row items-center mt-4 mx-2"
    >
      <View className="rounded-lg items-center justify-center shadow-sm bg-[#f8f8f8] w-48 gap-1">
        <Image
          source={{ uri: item.image }}
          className="w-48 h-28 rounded-t-lg"
          resizeMode="cover"
        />
        <View className="flex-row items-center justify-start space-x-2 px-2 w-full">
          <View className="flex-1 flex-row items-center">
            <Text className="text-base font-semibold truncate">
              {item.name}
            </Text>
          </View>

          <View className="flex-row items-center justify-center gap-1">
            <Entypo name="time-slot" size={18} color="black" />
            <Text className="text-base text-gray-600">{item.time}m</Text>
          </View>
        </View>
        <View className="flex-row w-full items-center justify-between px-2 mb-3">
          <Text className="text-start mt-2 text-xl text-[#E23637] font-extrabold">
            {formatPrice(item.price)}
          </Text>
          <View className="flex-row mt-2 gap-1">
            <TouchableOpacity
              onPress={(e) => {
                e.preventDefault();
                openDeleteConfirmation(item);
              }}
              className="w-8 h-8 items-center justify-center bg-[#FFC515] rounded-full"
            >
              <MaterialCommunityIcons
                name="delete-outline"
                size={20}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => {
                e.preventDefault();
                handleEditDish(item);
              }}
              className="w-8 h-8 items-center justify-center bg-[#FFC515] rounded-full"
            >
              <Ionicons name="pencil-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="bg-white h-full relative">
      {isLoading ? (
        <ActivityIndicator size="large" color="#FFC515" className="mt-10" />
      ) : (
        <FlatList
          data={dishes}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDelete}
        itemName={selectDish?.name || ""}
      />
    </View>
  );
}
