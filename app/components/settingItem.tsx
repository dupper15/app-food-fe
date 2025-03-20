import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Item {
  id: string;
  title: string;
  iconName: string;
  color: string;
}

const settingsData = [
  {
    id: "1",
    title: "Edit Restaurant",
    iconName: "person-outline",
    color: "#FFC515",
  },
  {
    id: "2",
    title: "Menu",
    iconName: "menu-outline",
    color: "#FF5733",
  },
  {
    id: "3",
    title: "Vouchers",
    iconName: "ticket-outline",
    color: "#33FF57",
  },
  {
    id: "4",
    title: "Rating",
    iconName: "star-outline",
    color: "#FFC515",
  },
  {
    id: "5",
    title: "Dark mode",
    iconName: "invert-mode-outline",
    color: "black",
  },
];

export default function ListSetting() {
  const renderItem = ({ item }: { item: Item }) => {
    return (
      <TouchableOpacity className="flex-row gap-2 items-center px-4 py-5 bg-gray-100">
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
