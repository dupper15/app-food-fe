import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation, useRouter } from "expo-router";

interface Item {
  id: string;
  title: string;
  iconName: string;
  color: string;
  path: string;
}

const settingsData = [
  {
    id: "1",
    title: "Edit Restaurant",
    iconName: "person-outline",
    color: "#FFC515",
    path: "EditRestaurant",
  },
  {
    id: "2",
    title: "Menu",
    iconName: "menu-outline",
    color: "#FF5733",
    path: "Menu",
  },
  {
    id: "3",
    title: "Vouchers",
    iconName: "ticket-outline",
    color: "#33FF57",
    path: "Voucher",
  },
  {
    id: "4",
    title: "Rating",
    iconName: "star-outline",
    color: "#FFC515",
    path: "Rating",
  },
  {
    id: "5",
    title: "Dark mode",
    iconName: "invert-mode-outline",
    color: "black",
    path: "DarkMode",
  },
];

export default function ListSetting() {
  const router = useRouter();
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: Item }) => {
    return (
      <TouchableOpacity
        className="flex-row gap-2 items-center px-4 py-5 bg-gray-100"
        onPress={() => navigation.navigate(item.path)}
      >
        <View className="bg-white rounded-full p-2">
          <Ionicons name={item.iconName} size={20} color={item.color} />
        </View>
        <Text className="flex-1 ml-4 text-base">{item.title}</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={settingsData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      className="rounded-2xl"
      scrollEnabled={false}
    />
  );
}
