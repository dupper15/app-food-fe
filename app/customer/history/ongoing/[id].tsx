import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  MapPin,
  MoreVertical,
  Navigation,
} from "lucide-react-native";
import { fetchCompleteHistory } from "@/services/historyService";
import { useSelector } from "react-redux";

const OrderDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const orderId = typeof id === "string" ? id : "";

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const userId = useSelector(
    (state: { user: { userId: string } }) => state.user.userId
  );

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const historyItems = await fetchCompleteHistory(userId);
        console.log("History Items:", historyItems);

        // Add historyItem._id to the search criteria
        const order = historyItems.find(
          (item) =>
            item.order._id === orderId ||
            item.historyItem.order_id === orderId ||
            item.historyItem._id === orderId
        );

        if (!order) {
          throw new Error("Order not found");
        }

        setOrderDetail(order);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading order details:", err);
        setError("Failed to load order details. Please try again.");
        setIsLoading(false);
      }
    };

    if (orderId) {
      loadOrderDetails();
    } else {
      setError("Invalid order ID");
      setIsLoading(false);
    }
  }, [orderId, userId]);

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FFCC00" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || !orderDetail) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error || "Order not found"}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Calculate totals
  const subtotal = orderDetail.orderItems.reduce(
    (sum: number, item: any) => sum + item.dish.price * item.quantity,
    0
  );

  const toppingTotal = orderDetail.orderItems.reduce(
    (sum: number, item: any) =>
      sum +
      item.toppings.reduce(
        (toppingSum: number, topping: any) => toppingSum + topping.price,
        0
      ) *
        item.quantity,
    0
  );

  const voucherDiscount = orderDetail.vouchers.reduce(
    (sum: number, voucher: any) => sum + voucher.value,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity style={styles.menuButton}>
          <MoreVertical size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Order ID */}
        <View style={styles.idContainer}>
          <Text style={styles.idLabel}>ID: </Text>
          <Text style={styles.idValue}>#{orderDetail.order._id.slice(-5)}</Text>
        </View>

        {/* Restaurant Info */}
        <View style={styles.restaurantContainer}>
          <Image
            source={{
              uri:
                orderDetail.orderItems[0]?.dish.image ||
                "https://via.placeholder.com/50",
            }}
            style={styles.restaurantImage}
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>
              {orderDetail.restaurant.name}
            </Text>
            <Text style={[styles.statusText, { color: "#007AFF" }]}>
              {orderDetail.order.status.charAt(0).toUpperCase() +
                orderDetail.order.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <View style={styles.locationRow}>
            <MapPin size={18} color="#e74c3c" style={styles.locationIcon} />
            <Text style={styles.locationText}>
              {orderDetail.restaurant.address}
            </Text>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Order Detail</Text>

          {/* Order Items */}
          {orderDetail.orderItems.map((item: any, index: number) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.itemQuantity}>
                <Text style={styles.quantityText}>{item.quantity}x</Text>
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.dish.name}</Text>
                {item.toppings.length > 0 && (
                  <View style={styles.toppingsContainer}>
                    {item.toppings.map((topping: any, idx: number) => (
                      <Text key={idx} style={styles.toppingText}>
                        + {topping.name}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
              <Text style={styles.itemPrice}>
                {(item.dish.price * item.quantity).toLocaleString()}đ
              </Text>
            </View>
          ))}

          {/* Order Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tổng tạm phí</Text>
              <Text style={styles.summaryValue}>
                {subtotal.toLocaleString()}đ
              </Text>
            </View>

            {voucherDiscount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Voucher</Text>
                <Text style={styles.summaryValue}>
                  {voucherDiscount.toLocaleString()}đ
                </Text>
              </View>
            )}

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>
                {orderDetail.order.total_price},000đ
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Re-Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.reorderButton}>
          <Text style={styles.reorderButtonText}>Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#757575",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#FFCC00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  menuButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  idContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  idLabel: {
    fontSize: 14,
    color: "#333",
  },
  idValue: {
    fontSize: 14,
    color: "#888",
  },
  restaurantContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
  },
  restaurantInfo: {
    marginLeft: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  locationContainer: {
    marginBottom: 24,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  locationIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  locationText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  itemQuantity: {
    width: 30,
  },
  quantityText: {
    fontSize: 14,
    color: "#555",
  },
  itemDetails: {
    flex: 1,
    paddingRight: 8,
  },
  itemName: {
    fontSize: 14,
    color: "#333",
  },
  toppingsContainer: {
    marginTop: 4,
  },
  toppingText: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: "#333",
    textAlign: "right",
  },
  summaryContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#555",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  reorderButton: {
    backgroundColor: "#FFCC00",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  reorderButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OrderDetailScreen;
