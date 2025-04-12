import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Khai báo các route name ở đây
type RootStackParamList = {
  EditRestaurant: undefined;
  Menu: undefined;
  Voucher: undefined;
  Rating: undefined;
  DarkMode: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Item {
  id: string;
  title: string;
  iconName: string;
  color: string;
  path: keyof RootStackParamList;
}

const settingsData: Item[] = [
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
  const navigation = useNavigation<NavigationProp>();

  const renderItem = ({ item }: { item: Item }) => {
    return (
      <TouchableOpacity
        className="flex-row gap-2 items-center px-4 py-5 bg-gray-100"
        onPress={() => navigation.navigate(item.path)}
      >
        <View className="bg-white rounded-full p-2">
          <Ionicons name={item.iconName as any} size={20} color={item.color} />
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
      className="rounded-xl"
      scrollEnabled={false}
    />
  );
}
