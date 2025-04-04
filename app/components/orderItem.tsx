import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { CompleteHistoryItem } from "@/services/historyService";

interface OrderComponentProps {
  item: CompleteHistoryItem;
  mode: "ongoing" | "history";
  onTrackRoute?: (orderId: string) => void;
  onCancel?: (orderId: string) => void;
  onRate?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
}

const OrderComponent = ({
  item,
  mode,
  onTrackRoute,
  onCancel,
  onRate,
  onReorder,
}: OrderComponentProps) => {
  const handleOrderPress = () => {
    if (mode === "ongoing") {
      router.navigate(`/customer/history/ongoing/${item.order._id}` as any);
    } else {
      router.navigate(`/customer/history/${item.historyItem._id}` as any);
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "cancelled" || statusLower === "canceled")
      return "#FF3B30"; // Red
    if (statusLower === "completed") return "#34C759"; // Green
    return "#007AFF"; // Blue for ongoing/processing
  };

  return (
    <TouchableOpacity style={styles.orderCard} onPress={handleOrderPress}>
      {/* Restaurant Name and Order Number */}
      <View style={styles.restaurantHeader}>
        <Text style={styles.restaurantName}>{item.restaurant.name}</Text>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>#{item.order._id.slice(-5)}</Text>
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.order.status) },
            ]}
          >
            {item.order.status}
          </Text>
        </View>
      </View>

      {/* Order Items */}
      {item.orderItems.map((orderItem, index) => (
        <View key={index} style={styles.orderItemRow}>
          <View style={styles.dishImageContainer}>
            {orderItem.dish.image ? (
              <Image
                source={{ uri: orderItem.dish.image }}
                style={styles.dishImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage} />
            )}
          </View>

          <View style={styles.dishInfo}>
            <Text style={styles.dishName}>{orderItem.dish.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>
                {orderItem.dish.price.toLocaleString()}đ
              </Text>
              <Text style={styles.quantityText}> x{orderItem.quantity}</Text>
            </View>
          </View>
        </View>
      ))}

      {/* Total Price */}
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceLabel}>Total Price:</Text>
        <Text style={styles.totalPriceValue}>
          {item.order.total_price.toLocaleString()},000đ
        </Text>
      </View>

      {/* Action Buttons - Different based on mode */}
      <View style={styles.actionButtons}>
        {mode === "ongoing" ? (
          // Ongoing mode buttons
          <>
            <TouchableOpacity
              style={styles.rateButton}
              onPress={() => onTrackRoute && onTrackRoute(item.order._id)}
            >
              <Text style={styles.rateButtonText}>Track Route</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reorderButton}
              onPress={() => onCancel && onCancel(item.order._id)}
            >
              <Text style={styles.reorderButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          // History mode buttons
          <>
            {item.order.status.toLowerCase() === "completed" && (
              <TouchableOpacity
                style={styles.rateButton}
                onPress={() => onRate && onRate(item.order._id)}
              >
                <Text style={styles.rateButtonText}>Rate</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.reorderButton}
              onPress={() => onReorder && onReorder(item.order._id)}
            >
              <Text style={styles.reorderButtonText}>Re-Order</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#F8F8F8",
    padding: 16,
    overflow: "hidden",
  },
  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderInfo: {
    alignItems: "flex-end",
  },
  orderNumber: {
    fontSize: 14,
    color: "#9E9E9E",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  orderItemRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  dishImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
  },
  dishImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E0E0E0",
  },
  dishInfo: {
    marginLeft: 12,
    justifyContent: "center",
    flex: 1,
  },
  dishName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceText: {
    fontSize: 14,
    color: "#000000",
  },
  quantityText: {
    fontSize: 14,
    color: "#757575",
  },
  totalPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    marginTop: 8,
  },
  totalPriceLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  totalPriceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#129575",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  trackButton: {
    backgroundColor: "#FFCC00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  trackButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#757575",
    fontWeight: "600",
    fontSize: 14,
  },
  rateButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFCC00",
    marginRight: 8,
  },
  rateButtonText: {
    color: "#FFCC00",
    fontWeight: "600",
    fontSize: 14,
  },
  reorderButton: {
    backgroundColor: "#FFCC00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  reorderButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default OrderComponent;
