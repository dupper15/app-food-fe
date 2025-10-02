import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ConfirmDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  onClose,
  onConfirm,
  itemName,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-5 w-4/5 shadow-lg">
          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-2">
              <Ionicons name="warning-outline" size={32} color="#E23637" />
            </View>
            <Text className="text-xl font-bold text-center">
              Confirm Delete
            </Text>
          </View>

          <Text className="text-center text-gray-700 mb-6">
            Are you sure you want to delete "{itemName}"? This action cannot be
            undone.
          </Text>

          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 mr-2 py-3 bg-gray-200 rounded-lg items-center"
            >
              <Text className="font-semibold text-gray-700">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 ml-2 py-3 bg-[#E23637] rounded-lg items-center"
            >
              <Text className="font-semibold text-white">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmDeleteModal;
