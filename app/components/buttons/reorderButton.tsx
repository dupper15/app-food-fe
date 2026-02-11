import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useHistoryRefresh } from "@/screens/customer/(tabs)/history";
import { CompleteHistoryItem } from "@/services/historyService";

interface ReorderButtonProps {
  orderId: string;
  orderItems?: any[];
  style?: object;
  textStyle?: object;
  returnToHistory?: boolean;
}

const ReorderButton = ({
  orderId,
  orderItems,
  style,
  textStyle,
  returnToHistory = true,
}: ReorderButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshHistory } = useHistoryRefresh();

  const handleReorder = async () => {
    try {
      setIsLoading(true);
      console.log("Reordering items for order ID:", orderId);
      console.log("Order items:", orderItems);
      if (orderItems && orderItems.length > 0) {
        // Transform order items to format expected by payment page
        const items = orderItems.map((item) => ({
          dish_id: {
            _id: item.dish._id,
            name: item.dish.name,
            price: item.dish.price,
            image: item.dish.image,
            restaurant_id: item.dish.restaurant_id || item.order?.restaurant_id,
            time: item.dish.time || 15, // Default preparation time if not available
          },
          quantity: item.quantity,
          topping: item.toppings || [],
        }));

        Toast.show({
          type: "success",
          text1: "Re-ordering items",
          text2: "Proceeding to payment page",
        });

        // Navigate to payment page with the order items
        router.push({
          pathname: "/screen/paymentPage",
          params: {
            selectedDish: JSON.stringify(items),
          },
        } as any);
      } else {
        throw new Error("No items to reorder");
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
      disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator size='small' color='#FFFFFF' />
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
