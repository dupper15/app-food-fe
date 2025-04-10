import { Image, Text, TouchableOpacity, View } from "react-native";
import ListSetting from "@/app/components/settingItem";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface User {
  name: string;
  avatar: string;
}

const user: User = {
  name: "Cao Dương Lâm",
  avatar: "https://picsum.photos/seed/picsum/200/300",
};

export default function Restaurant() {
  return (
    <View className="bg-white px-6 py-8 flex-col h-full gap-4">
      {/* avatar and fullname */}
      <View className="flex-row py-10 items-center gap-10">
        <Image
          source={{ uri: user.avatar }}
          className="rounded-full w-24 h-24"
        />
        <View className="gap-1">
          <Text className="font-semibold text-xl">{user.name}</Text>
          <Text className="text-base text-gray-400">I love fast food</Text>
        </View>
      </View>

      {/* list item setting */}
      <ListSetting />

      {/* logout */}
      <TouchableOpacity className="flex-row gap-2 items-center px-4 py-5 mb-20 bg-gray-100 rounded-2xl">
        <View className="bg-white rounded-full p-2">
          <Ionicons name="log-out-outline" size={20} color="#FF5733" />
        </View>
        <Text className="flex-1 ml-4 text-base">Logout</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
