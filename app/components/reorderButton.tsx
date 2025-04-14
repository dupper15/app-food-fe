import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { reorder } from "@/services/api/orderApi";
import Toast from "react-native-toast-message";
import { useHistoryRefresh } from "../customer/(tabs)/history";

interface ReorderButtonProps {
  orderId: string;
  style?: object;
  textStyle?: object;
  returnToHistory?: boolean;
}

const ReorderButton = ({
  orderId,
  style,
  textStyle,
  returnToHistory = true,
}: ReorderButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshHistory } = useHistoryRefresh();

  const handleReorder = async () => {
    try {
      setIsLoading(true);
      const response = await reorder(orderId);
      if (response) {
        Toast.show({
          type: "success",
          text1: "Reorder Successful",
          text2: "Your order has been placed successfully.",
        });

        // Refresh history data
        await refreshHistory();

        if (returnToHistory) {
          // Navigate to history tab
          router.replace("/customer/(tabs)/history" as any);
        }
      } else {
        throw new Error("Failed to create reorder");
      }
    } catch (error) {
      console.error("Error reordering:", error);
      Alert.alert(
        "Reorder Failed",
        "There was a problem processing your reorder. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.reorderButton, style]}
      onPress={handleReorder}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={[styles.reorderButtonText, textStyle]}>Re-Order</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reorderButton: {
    backgroundColor: "#FFCC00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  reorderButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default ReorderButton;
