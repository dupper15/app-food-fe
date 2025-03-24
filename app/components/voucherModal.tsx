import {
  Button,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { Item } from "./menuItem";
import { useMutation } from "@tanstack/react-query";
import { fetchAllCategory } from "@/services/api/categoryApi";
import { Voucher } from "@/interfaces/VoucherInterface";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const VoucherModal: React.FC<{
  setShowModal: (value: boolean) => void;
  voucher: Voucher | null;
}> = ({ setShowModal, voucher }) => {
  const [vouchers, setVouchers] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const handleConfirmStartDate = (date: Date) => {
    setStartDate(date);
    setShow(false);
  };

  const handleConfirmEndDate = (date: Date) => {
    setEndDate(date);
    setShow(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="w-full items-center"
          >
            <View className="bg-white w-full h-full px-6 pt-20 rounded-lg shadow-lg">
              <Text className="text-slate-900 font-extrabold text-2xl text-center mb-4">
                {voucher ? "Edit Voucher" : "Create Voucher"}
              </Text>
              <View className="w-full flex flex-col gap-3">
                {/* name */}
                <View className="flex-col justify-between items-start gap-2">
                  <Text className="font-semibold text-base">Name</Text>
                  <TextInput
                    multiline
                    numberOfLines={1}
                    className="w-full p-2 border border-slate-400 rounded-lg"
                    placeholder={voucher?.name || "Enter name"}
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View className="flex-row flex items-center gap-3">
                  {/* value */}
                  <View className="flex-col justify-between items-start gap-2">
                    <Text className="font-semibold text-base">Value</Text>
                    <TextInput
                      numberOfLines={1}
                      keyboardType="numeric"
                      className="w-full p-2 border border-slate-400 rounded-lg"
                      placeholder={voucher?.value.toString() || "Enter value"}
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  {/* max */}
                  <View className="flex-col items-start gap-2">
                    <Text className="font-semibold text-base flex-1">Max</Text>
                    <TextInput
                      keyboardType="numeric"
                      className="w-full p-2 border border-slate-400 rounded-lg"
                      placeholder={voucher?.max.toString() || "Enter max"}
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>

                {/* quantity */}
                <View className="flex-col justify-between items-start gap-2">
                  <Text className="font-semibold text-base">Quantity</Text>
                  <TextInput
                    className="w-full p-2 border border-slate-400 rounded-lg"
                    placeholder={
                      voucher?.quantity.toString() || "Enter quantity"
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                {/* start date and end date */}
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
                          voucher?.start_date.toLocaleDateString() ||
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
                          voucher?.expire_date.toLocaleDateString() ||
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
                    onPress={() => setShowModal(false)}
                    className="bg-[#389C9A] p-3 rounded-lg flex-1"
                  >
                    <Text className="text-white text-center font-medium">
                      {voucher !== null ? "Save" : "Create"}
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default VoucherModal;
