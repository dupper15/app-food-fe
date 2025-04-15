import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CreateVoucherDto, VoucherData } from "@/interfaces/VoucherInterface";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CustomToast } from "./toast";
import { createVoucher, editVoucher } from "@/services/api/voucherApi";
import { useSelector } from "react-redux";
import { formatDate } from "@/utils/format";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Topping, ToppingCreate } from "@/interfaces/ToppingInterface";
import { createTopping, editTopping } from "@/services/api/toppingApi";

export default function ToppingModal() {
  const restaurantId = useSelector(
    (state: { restaurant: { restaurantId: string | null } }) =>
      state.restaurant.restaurantId
  );
  // parse topping
  const route = useRoute();
  const router = useRouter();
  const { topping } = route.params as {
    topping: string;
  };
  const parsedTopping: Topping = topping ? JSON.parse(topping) : null;

  const [name, setName] = useState<string>(parsedTopping?.name);
  const [price, setPrice] = useState(parsedTopping?.price.toString());

  const [showError, setShowError] = useState<boolean>(false);
  const [contentError, setContentError] = useState<string>("");

  const handleSubmitVoucher = () => {
    if (!name || !price) {
      setShowError(true);
      setContentError("All fields are required!");
      return;
    }
    const data: ToppingCreate = {
      restaurant_id: restaurantId || "",
      name: name,
      price: Number(price),
    };
    if (topping) {
      editToppingMutation.mutate({ id: parsedTopping._id, data: data });
    } else {
      createToppingMutation.mutate(data);
    }
  };

  const createToppingMutation = useMutation({
    mutationFn: createTopping,
    onSuccess: () => {
      CustomToast("success", "Success", "Created topping successfully!");
      router.back();
    },
    onError: () => {
      console.error = () => {};
      CustomToast("error", "Error", "Created topping failed! Please try again");
    },
  });

  const editToppingMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ToppingCreate }) =>
      editTopping(id, data),
    onSuccess: () => {
      CustomToast("success", "Success", "Edited topping successfully!");
      router.back();
    },
    onError: () => {
      console.error = () => {};
      CustomToast("error", "Error", "Edited topping failed! Please try again");
    },
  });

  return (
    <View className="h-full flex-col bg-white">
      {/* header */}
      <View className="flex-row w-full h-14 bg-white items-center px-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl text-center flex-1">
          {topping ? "Edit Topping" : "Create Topping"}
        </Text>
        <View className="w-2" />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex flex-col gap-4">
            {/* Name */}
            <View>
              <Text className="font-semibold text-base mb-1">Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                className="w-full p-2 border border-slate-400 rounded-lg"
                placeholder="Enter name"
                placeholderTextColor="#94a3b8"
              />
            </View>

            {/* Price */}
            <View>
              <Text className="font-semibold text-base mb-1">Price</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                className="w-full p-2 border border-slate-400 rounded-lg"
                placeholder="Enter content"
                placeholderTextColor="#94a3b8"
              />
            </View>

            {showError && <Text className="text-red-500">{contentError}</Text>}

            {/* Submit & Cancel */}
            <View className="flex-row gap-4 mt-4">
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-red-500 p-3 rounded-lg flex-1"
              >
                <Text className="text-white text-center font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmitVoucher}
                className="bg-[#389C9A] p-3 rounded-lg flex-1"
              >
                <Text className="text-white text-center font-medium">
                  {topping ? "Save" : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
