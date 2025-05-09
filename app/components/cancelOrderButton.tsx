import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { cancelOrder } from "@/services/api/orderApi";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { useHistoryRefresh } from "../customer/(tabs)/history";

interface CancelOrderButtonProps {
  orderId: string;
  onSuccess?: () => void;
  buttonStyle?: object;
  textStyle?: object;
  confirmMessage?: string;
  returnToHistory?: boolean;
}

const CancelOrderButton = ({
  orderId,
  onSuccess,
  buttonStyle,
  textStyle,
  confirmMessage = "Are you sure you want to cancel this order?",
  returnToHistory = true,
}: CancelOrderButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshHistory } = useHistoryRefresh();

  const handleCancelOrder = async () => {
    Alert.alert(
      "Cancel Order",
      confirmMessage,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setIsLoading(true);
              await cancelOrder(orderId);

              // Refresh history data
              await refreshHistory();

              setIsLoading(false);

              Toast.show({
                type: "success",
                text1: "Order Cancelled",
                text2: "Your order has been successfully cancelled.",
              });

              if (onSuccess) {
                onSuccess();
              }

              if (returnToHistory) {
                router.replace("/customer/(tabs)/history" as any);
              }
            } catch (error) {
              setIsLoading(false);
              console.error("Error cancelling order:", error);
              Alert.alert("Error", "Failed to cancel order. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={handleCancelOrder}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>Cancel Order</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default CancelOrderButton;
