import { Text, View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import ListMenuItem from "@/app/components/menuItem";
import { useState } from "react";
import DishModal from "@/app/components/dishModal";
import { DishData } from "@/interfaces/DishInterface";

export default function Menu() {
  const route = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleCreateDish = () => {
    setOpenModal(true);
  };
  return (
    <View className="h-full flex-col  bg-white">
      {/* header */}
      <View className="flex-row w-full h-14 bg-white items-center justify-between px-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => route.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl">Menu</Text>
        <TouchableOpacity
          className="bg-black rounded-md w-8 h-8 items-center justify-center"
          onPress={() => handleCreateDish()}
        >
          <FontAwesome6 name="plus" size={18} color="#FFC515" />
        </TouchableOpacity>
      </View>

      {/* list dishes in menu */}
      <ListMenuItem setRefresh={setRefresh} refresh={refresh} />

      {openModal && (
        <DishModal
          setShowModal={setOpenModal}
          setRefresh={setRefresh}
          dish={null}
        />
      )}
    </View>
  );
}
