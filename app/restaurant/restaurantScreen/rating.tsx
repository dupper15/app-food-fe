import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Rating() {
  const router = useRouter();
  return (
    <View className="h-full flex-col bg-white">
      {/* header */}
      <View className="flex-row w-full h-14 bg-white items-center px-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl text-center flex-1">Rating</Text>
        <View className="w-2" />
      </View>

      {/* list rating */}
    </View>
  );
}
