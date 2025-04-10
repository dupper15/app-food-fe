import {
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

const VoucherModal: React.FC<{
  setShowModal: (value: boolean) => void;
  setRefresh: (value: boolean) => void;
  voucher: VoucherData | null;
}> = ({ setShowModal, setRefresh, voucher }) => {
  const restaurantId = useSelector(
    (state: { restaurant: { restaurantId: string | null } }) =>
      state.restaurant.restaurantId
  );
  const [name, setName] = useState(voucher?.name || "");
  const [content, setContent] = useState(voucher?.content || "");
  const [value, setValue] = useState(voucher?.value?.toString() || "");
  const [max, setMax] = useState(voucher?.max?.toString() || "");
  const [min, setMin] = useState(voucher?.min?.toString() || "");
  const [quantity, setQuantity] = useState(voucher?.quantity?.toString() || "");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [show, setShow] = useState(false);

  const [showError, setShowError] = useState<boolean>(false);
  const [contentError, setContentError] = useState<string>("");

  const handleConfirmStartDate = (date: Date) => {
    setStartDate(date);
    setShow(false);
  };

  const handleConfirmEndDate = (date: Date) => {
    setEndDate(date);
    setShow(false);
  };

  const handleSubmitVoucher = () => {
    if (Number(min) > Number(max)) {
      setShowError(true);
      setContentError("Min value cannot be greater than Max value!");
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
      start_date: startDate.toLocaleDateString(),
      expire_date: endDate.toLocaleDateString(),
    };
    if (voucher) {
      editVoucherMutation.mutate({ id: voucher._id, data: data });
    } else {
      createVoucherMutation.mutate(data);
    }
  };

  const createVoucherMutation = useMutation({
    mutationFn: createVoucher,
    onSuccess: (data) => {
      CustomToast("success", "Success", "Created voucher successfully!");
      setShowModal(false);
      setRefresh(true);
    },
    onError: (error: any) => {
      console.error("Error creating voucher:", error);
      CustomToast("error", "Error", "Created voucher failed! Please try again");
    },
  });

  const editVoucherMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateVoucherDto }) =>
      editVoucher(id, data),
    onSuccess: (data) => {
      CustomToast("success", "Success", "Edited voucher successfully!");
      setShowModal(false);
      setRefresh(true);
    },
    onError: (error: any) => {
      console.error("Error editing voucher:", error);
      CustomToast("error", "Error", "Edited voucher failed! Please try again");
    },
  });

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center items-center"
        >
          <View className="bg-white w-10/12 h-min-[90%] p-4 rounded-lg shadow-lg">
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 24,
              }}
              showsVerticalScrollIndicator={false}
            >
              <Text className="text-slate-900 font-extrabold text-2xl text-center mb-4">
                {voucher ? "Edit Voucher" : "Create Voucher"}
              </Text>
              <View className="w-full flex flex-col gap-3">
                {/* name */}
                <View className="flex-col justify-between items-start gap-2">
                  <Text className="font-semibold text-base">Name</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    multiline
                    numberOfLines={1}
                    className="w-full p-2 border border-slate-400 rounded-lg"
                    placeholder={name || "Enter name"}
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                {/* content */}
                <View className="flex-col justify-between items-start gap-2">
                  <Text className="font-semibold text-base">Content</Text>
                  <TextInput
                    value={content}
                    onChangeText={setContent}
                    multiline
                    numberOfLines={2}
                    className="w-full p-2 border border-slate-400 rounded-lg"
                    placeholder={content || "Enter content"}
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View className="flex-row items-center gap-3">
                  {/* value */}
                  <View className="flex-1 flex-col justify-between gap-2">
                    <Text className="font-semibold text-base">Value</Text>
                    <TextInput
                      value={value}
                      onChangeText={setValue}
                      numberOfLines={1}
                      keyboardType="numeric"
                      className="p-2 border border-slate-400 rounded-lg w-full"
                      placeholder={value || "Enter value"}
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  {/* quantity */}
                  <View className="flex-1 flex-col gap-2">
                    <Text className="font-semibold text-base">Quantity</Text>
                    <TextInput
                      value={quantity}
                      onChangeText={setQuantity}
                      keyboardType="numeric"
                      className="p-2 border border-slate-400 rounded-lg w-full"
                      placeholder={quantity || "Enter quantity"}
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>

                <View className="flex-row items-center gap-3">
                  {/* max */}
                  <View className="flex-1 flex-col justify-between gap-2">
                    <Text className="font-semibold text-base">Max</Text>
                    <TextInput
                      value={max}
                      onChangeText={setMax}
                      numberOfLines={1}
                      keyboardType="numeric"
                      className="p-2 border border-slate-400 rounded-lg w-full"
                      placeholder={max || "Enter max"}
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  {/* min */}
                  <View className="flex-1 flex-col gap-2">
                    <Text className="font-semibold text-base">Min</Text>
                    <TextInput
                      value={min}
                      onChangeText={setMin}
                      keyboardType="numeric"
                      className="p-2 border border-slate-400 rounded-lg w-full"
                      placeholder={min || "Enter min"}
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>

                {/* start date */}
                <View className="flex-col justify-between items-start gap-2">
                  <Text className="font-semibold text-base">Start date</Text>

                  {voucher ? (
                    <TouchableOpacity
                      onPress={() => setShow(true)}
                      className="w-full"
                    >
                      <TextInput
                        className="w-full p-2 border border-slate-400 rounded-lg text-black"
                        value={
                          formatDate(voucher?.start_date) ||
                          startDate.toLocaleDateString()
                        }
                        placeholderTextColor="#94a3b8"
                        onFocus={() => setShow(true)}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TextInput
                      className="w-full p-2 border border-slate-400 rounded-lg text-black"
                      value={startDate.toLocaleDateString()}
                      onFocus={() => setShow(true)}
                      placeholderTextColor="#94a3b8"
                    />
                  )}

                  <DateTimePickerModal
                    isVisible={show}
                    mode="date"
                    onConfirm={handleConfirmStartDate}
                    onCancel={() => setShow(false)}
                  />
                </View>
                {/* end date */}
                <View className="flex-col justify-between items-start gap-2">
                  <Text className="font-semibold text-base">End date</Text>

                  {voucher ? (
                    <TouchableOpacity
                      onPress={() => setShow(true)}
                      className="w-full"
                    >
                      <TextInput
                        className="w-full p-2 border border-slate-400 rounded-lg text-black"
                        value={
                          formatDate(voucher?.expire_date) ||
                          startDate.toLocaleDateString()
                        }
                        placeholderTextColor="#94a3b8"
                        onFocus={() => setShow(true)}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TextInput
                      className="w-full p-2 border border-slate-400 rounded-lg text-black"
                      value={endDate.toLocaleDateString()}
                      onFocus={() => setShow(true)}
                      placeholderTextColor="#94a3b8"
                    />
                  )}

                  <DateTimePickerModal
                    isVisible={show}
                    mode="date"
                    onConfirm={handleConfirmEndDate}
                    onCancel={() => setShow(false)}
                  />
                </View>
                {showError && (
                  <Text className="text-red-500">{contentError}</Text>
                )}
                {/* button cancel and submit */}
                <View className="flex-row items-center gap-4 justify-between">
                  <TouchableHighlight
                    onPress={() => setShowModal(false)}
                    className="bg-red-500 p-3 rounded-lg flex-1"
                  >
                    <Text className="text-white text-center font-medium">
                      Cancel
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={() => handleSubmitVoucher()}
                    className="bg-[#389C9A] p-3 rounded-lg flex-1"
                  >
                    <Text className="text-white text-center font-medium">
                      {voucher !== null ? "Save" : "Create"}
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default VoucherModal;
