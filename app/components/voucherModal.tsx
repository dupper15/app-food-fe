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

export default function VoucherModal() {
  const restaurantId = useSelector(
    (state: { restaurant: { restaurantId: string | null } }) =>
      state.restaurant.restaurantId
  );
  // parse voucher
  const route = useRoute();
  const router = useRouter();
  const { voucher } = route.params as {
    voucher: string;
  };
  const parsedVoucher: VoucherData = voucher ? JSON.parse(voucher) : null;

  const [name, setName] = useState<string>(parsedVoucher?.name);
  const [content, setContent] = useState(parsedVoucher?.content);
  const [value, setValue] = useState(parsedVoucher?.value?.toString());
  const [max, setMax] = useState(parsedVoucher?.max?.toString());
  const [min, setMin] = useState(parsedVoucher?.min?.toString());
  const [quantity, setQuantity] = useState(parsedVoucher?.quantity?.toString());
  const [startDate, setStartDate] = useState<Date>(
    parsedVoucher?.start_date ? new Date(parsedVoucher.start_date) : new Date()
  );
  const [endDate, setEndDate] = useState<Date>(
    parsedVoucher?.expire_date
      ? new Date(parsedVoucher.expire_date)
      : new Date()
  );
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const [showError, setShowError] = useState<boolean>(false);
  const [contentError, setContentError] = useState<string>("");

  const handleConfirmStartDate = (date: Date) => {
    setStartDate(date);
    setShowStart(false);
  };

  const handleConfirmEndDate = (date: Date) => {
    setEndDate(date);
    setShowEnd(false);
  };

  const handleSubmitVoucher = () => {
    if (
      !name ||
      !content ||
      !quantity ||
      !value ||
      !max ||
      !min ||
      !startDate ||
      !endDate
    ) {
      setShowError(true);
      setContentError("All fields are required!");
      return;
    }
    if (Number(min) > Number(max)) {
      setShowError(true);
      setContentError("Min value cannot be greater than Max value!");
      return;
    }
    if (Number(quantity) <= 0 || isNaN(Number(quantity))) {
      setShowError(true);
      setContentError("Quantity must be a valid number greater than 0!");
      return;
    }
    const data: CreateVoucherDto = {
      restaurant_id: restaurantId || "",
      name: name,
      content: content,
      quantity: Number(quantity),
      value: Number(value),
      max: Number(max),
      min: Number(min),
      start_date: startDate.toISOString(),
      expire_date: endDate.toISOString(),
    };
    if (voucher) {
      editVoucherMutation.mutate({ id: parsedVoucher._id, data: data });
    } else {
      createVoucherMutation.mutate(data);
    }
  };

  const createVoucherMutation = useMutation({
    mutationFn: createVoucher,
    onSuccess: () => {
      CustomToast("success", "Success", "Created voucher successfully!");
      router.back();
    },
    onError: () => {
      console.error = () => {};
      CustomToast("error", "Error", "Created voucher failed! Please try again");
    },
  });

  const editVoucherMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateVoucherDto }) =>
      editVoucher(id, data),
    onSuccess: () => {
      CustomToast("success", "Success", "Edited voucher successfully!");
      router.back();
    },
    onError: () => {
      console.error = () => {};
      CustomToast("error", "Error", "Edited voucher failed! Please try again");
    },
  });

  return (
    <View className="flex-1 bg-white pt-20">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-slate-900 font-extrabold text-2xl text-center mb-4">
            {voucher ? "Edit Voucher" : "Create Voucher"}
          </Text>

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

            {/* Content */}
            <View>
              <Text className="font-semibold text-base mb-1">Content</Text>
              <TextInput
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={2}
                className="w-full p-2 border border-slate-400 rounded-lg"
                placeholder="Enter content"
                placeholderTextColor="#94a3b8"
              />
            </View>

            {/* Value & Quantity */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="font-semibold text-base mb-1">Value</Text>
                <TextInput
                  value={value}
                  onChangeText={setValue}
                  keyboardType="numeric"
                  className="p-2 border border-slate-400 rounded-lg"
                  placeholder="Enter value"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View className="flex-1">
                <Text className="font-semibold text-base mb-1">Quantity</Text>
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  className="p-2 border border-slate-400 rounded-lg"
                  placeholder="Enter quantity"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            {/* Max & Min */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="font-semibold text-base mb-1">Max</Text>
                <TextInput
                  value={max}
                  onChangeText={setMax}
                  keyboardType="numeric"
                  className="p-2 border border-slate-400 rounded-lg"
                  placeholder="Enter max"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View className="flex-1">
                <Text className="font-semibold text-base mb-1">Min</Text>
                <TextInput
                  value={min}
                  onChangeText={setMin}
                  keyboardType="numeric"
                  className="p-2 border border-slate-400 rounded-lg"
                  placeholder="Enter min"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            {/* Start Date */}
            <View className="flex-col justify-between items-start gap-2">
              <Text className="font-semibold text-base">Start date</Text>
              <TextInput
                className="w-full p-2 border border-slate-400 rounded-lg text-black"
                value={startDate.toLocaleDateString()}
                placeholderTextColor="#94a3b8"
                editable={true}
                onFocus={() => {
                  Keyboard.dismiss();
                  setShowStart(true);
                }}
              />
              <DateTimePickerModal
                isVisible={showStart}
                mode="date"
                date={startDate}
                onConfirm={handleConfirmStartDate}
                onCancel={() => setShowStart(false)}
              />
            </View>

            {/* End Date */}
            <View className="flex-col justify-between items-start gap-2">
              <Text className="font-semibold text-base">End date</Text>
              <TextInput
                className="w-full p-2 border border-slate-400 rounded-lg text-black"
                value={endDate.toLocaleDateString()}
                placeholderTextColor="#94a3b8"
                editable={true}
                onFocus={() => {
                  Keyboard.dismiss();
                  setShowEnd(true);
                }}
              />
              <DateTimePickerModal
                isVisible={showEnd}
                mode="date"
                date={endDate}
                onConfirm={handleConfirmEndDate}
                onCancel={() => setShowEnd(false)}
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
                  {voucher ? "Save" : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
