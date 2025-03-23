import { formatPrice } from "@/utils/formatPrice";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import DishModal from "./dishModal";

export interface Item {
  id: string;
  name: string;
  image: string;
  introduce: string;
  price: number;
  category: string;
  bestSeller: boolean;
}

const menuData: Item[] = [
  {
    id: "1",
    name: "Cơm thịt heo chiên giòn sốt chua ngọt",
    image: "https://picsum.photos/seed/picsum/200/300",
    introduce: "Món này rất ngon",
    price: 20000,
    category: "Chiên",
    bestSeller: true,
  },
  {
    id: "2",
    name: "Cơm thịt heo chiên giòn sốt chua ngọt",
    image: "https://picsum.photos/seed/picsum/200/300",
    introduce: "Món này rất ngon",
    price: 20000,
    category: "Chiên",
    bestSeller: false,
  },
  {
    id: "3",
    name: "Cơm thịt heo chiên giòn sốt chua ngọt",
    image: "https://picsum.photos/seed/picsum/200/300",
    introduce: "Món này rất ngon",
    price: 20000,
    category: "Chiên",
    bestSeller: false,
  },
  {
    id: "4",
    name: "Cơm thịt heo chiên giòn sốt chua ngọt",
    image: "https://picsum.photos/seed/picsum/200/300",
    introduce: "Món này rất ngon",
    price: 20000,
    category: "Chiên",
    bestSeller: false,
  },
  {
    id: "5",
    name: "Cơm thịt heo chiên giòn sốt chua ngọt",
    image: "https://picsum.photos/seed/picsum/200/300",
    introduce: "Món này rất ngon",
    price: 20000,
    category: "Xào",
    bestSeller: false,
  },
  {
    id: "6",
    name: "Cơm thịt heo chiên giòn sốt chua ngọt",
    image: "https://picsum.photos/seed/picsum/200/300",
    introduce: "Món này rất ngon",
    price: 20000,
    category: "Xào",
    bestSeller: false,
  },
  {
    id: "7",
    name: "Cơm thịt heo chiên giòn sốt chua ngọt",
    image: "https://picsum.photos/seed/picsum/200/300",
    introduce: "Món này rất ngon",
    price: 20000,
    category: "Nướng",
    bestSeller: false,
  },
];

export default function ListMenuItem() {
  const [openModal, setOpenModal] = useState(false);
  const [selectDish, setSelectDish] = useState<Item | null>(null);

  const handleEditDish = (item: Item) => {
    setOpenModal(true);
    setSelectDish(item);
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      onPress={(e) => e.preventDefault()}
      className="flex-row items-center px-4 py-2"
    >
      <View className="rounded-lg items-center justify-center bg-[#f8f8f8] w-48 gap-1">
        <Image
          source={{ uri: item.image }}
          className="w-48 h-28 rounded-t-lg"
        />
        <Text className="text-start mt-2 text-base font-semibold w-full truncate px-2">
          {item.name}
        </Text>
        <View className="flex-row w-full items-center justify-between px-2 mb-3">
          <Text className="text-start mt-2 text-xl text-[#E23637] font-extrabold">
            {formatPrice(item.price)}
          </Text>
          <TouchableOpacity
            onPress={(e) => {
              e.preventDefault(), handleEditDish(item);
            }}
            className="w-10 h-10 items-center justify-center bg-[#FFC515] rounded-full"
          >
            <Ionicons name="pencil-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="bg-white h-full">
      <FlatList
        data={menuData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        className="pb-20"
      />

      {openModal && <DishModal setShowModal={setOpenModal} dish={selectDish} />}
    </View>
  );
}
