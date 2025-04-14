import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Khai báo các route name ở đây
type RootStackParamList = {
  EditRestaurant: undefined;
  Menu: undefined;
  Topping: undefined;
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
  iconType?: "ionicons" | "materialCommunityIcons" | "entypo";
}

const settingsData: Item[] = [
  {
    id: "1",
    title: "Edit Restaurant",
    iconName: "restaurant-outline",
    color: "#FFC515",
    path: "EditRestaurant",
    iconType: "ionicons",
  },
  {
    id: "2",
    title: "Vouchers",
    iconName: "ticket-outline",
    color: "#33FF57",
    path: "Voucher",
    iconType: "ionicons",
  },
  {
    id: "3",
    title: "Rating",
    iconName: "star-outline",
    color: "#FFC515",
    path: "Rating",
    iconType: "ionicons",
  },
  {
    id: "4",
    title: "Dark mode",
    iconName: "light-up",
    color: "black",
    path: "DarkMode",
    iconType: "entypo",
  },
];

const settingsData2: Item[] = [
  {
    id: "5",
    title: "Menu",
    iconName: "fast-food-outline",
    color: "#FF5733",
    path: "Menu",
    iconType: "ionicons",
  },
  {
    id: "6",
    title: "Topping",
    iconName: "food-drumstick",
    color: "#FF5733",
    path: "Topping",
    iconType: "materialCommunityIcons",
  },
];

export default function ListSetting() {
  const navigation = useNavigation<NavigationProp>();

  const renderIcon = (item: Item) => {
    switch (item.iconType) {
      case "materialCommunityIcons":
        return (
          <MaterialCommunityIcons
            name={item.iconName as any}
            size={20}
            color={item.color}
          />
        );
      case "entypo":
        return (
          <Entypo name={item.iconName as any} size={20} color={item.color} />
        );
      default:
        return (
          <Ionicons name={item.iconName as any} size={20} color={item.color} />
        );
    }
  };

  const renderItem = ({ item }: { item: Item }) => {
    return (
      <TouchableOpacity
        className="flex-row gap-2 items-center px-4 py-5 bg-gray-100"
        onPress={() => navigation.navigate(item.path)}
      >
        <View className="bg-white rounded-full p-2">{renderIcon(item)}</View>
        <Text className="flex-1 ml-4 text-base">{item.title}</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </TouchableOpacity>
    );
  };

  return (
    <View className="gap-8">
      <FlatList
        data={settingsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        className="rounded-xl"
        scrollEnabled={false}
      />
      <FlatList
        data={settingsData2}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        className="rounded-xl"
        scrollEnabled={false}
      />
    </View>
  );
}
