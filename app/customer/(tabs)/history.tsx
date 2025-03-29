import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCompleteHistory,
  CompleteHistoryItem,
} from "@/services/historyService";
import { useSelector } from "react-redux";
import { router } from "expo-router";

// Tab options
const TABS = ["Ongoing", "History"];

const OrderHistoryScreen = () => {
  const [activeTab, setActiveTab] = useState(1);
  const userId = useSelector(
    (state: { user: { userId: string } }) => state.user.userId
  );

  // Fetch complete history data
  const {
    data: historyData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userHistory", userId],
    queryFn: () => fetchCompleteHistory(userId),
  });

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          style={[styles.star, i <= rating ? styles.filledStar : {}]}
        >
          ★
        </Text>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Get status color based on order status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#129575";
      case "canceled":
        return "#FF3B30";
      case "pending":
        return "#FF9500";
      default:
        return "#757575";
    }
  };

  const renderOrderItem = ({ item }: { item: CompleteHistoryItem }) => {
    // Get the first dish as the main dish for display
    const mainDish = item.orderItems[0]?.dish;
    const formattedDate = formatDate(item.order.createdAt);
    const statusColor = getStatusColor(item.order.status);

    // Determine if the order has been rated (you might need to add this field to your data model)
    const hasRated = false; // Replace with actual logic
    const handleOrderPress = (item: CompleteHistoryItem) => {
      console.log("item clicked");
      router.navigate(`/customer/history/${item.historyItem._id}` as any);
    };

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => handleOrderPress(item)}
      >
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View style={styles.leftSection}>
              <View style={styles.restaurantImage}>
                {mainDish?.image && (
                  <Image
                    source={{ uri: mainDish.image }}
                    style={styles.dishImage}
                    resizeMode="cover"
                  />
                )}
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.restaurantName}>
                  {/* You might want to fetch restaurant name separately */}
                  {mainDish?.name || "Restaurant Order"}
                </Text>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {item.order.status.charAt(0).toUpperCase() +
                    item.order.status.slice(1)}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>
                    {item.historyItem.cost.toLocaleString()}₫
                  </Text>
                  <Text style={styles.quantityText}>
                    {" "}
                    | x{item.historyItem.sum_dishes}
                  </Text>
                </View>
                {hasRated && renderStars(3)} {/* Replace with actual rating */}
              </View>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.orderNumber}>
                #{item.order._id.slice(-5)}
              </Text>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            {!hasRated && item.order.status.toLowerCase() === "completed" && (
              <TouchableOpacity style={styles.rateButton}>
                <Text style={styles.rateButtonText}>Rate</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.reorderButton}>
              <Text style={styles.reorderButtonText}>Re-Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FFCC00" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Failed to load orders</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => setActiveTab(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
            {activeTab === index && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Order List */}
      <FlatList
        data={historyData}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.historyItem._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
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
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    position: "relative",
  },
  activeTab: {
    borderBottomColor: "#FFCC00",
  },
  tabText: {
    fontSize: 16,
    color: "#9E9E9E",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFCC00",
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    width: "100%",
    backgroundColor: "#FFCC00",
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#F8F8F8",
    overflow: "hidden",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  leftSection: {
    flexDirection: "row",
  },
  restaurantImage: {
    width: 70,
    height: 70,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
  },
  dishImage: {
    width: "100%",
    height: "100%",
  },
  orderInfo: {
    marginLeft: 12,
    justifyContent: "center",
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14,
    color: "#757575",
  },
  quantityText: {
    fontSize: 14,
    color: "#757575",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  orderNumber: {
    fontSize: 14,
    color: "#9E9E9E",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#9E9E9E",
  },
  starsContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  star: {
    fontSize: 18,
    color: "#E0E0E0",
    marginRight: 2,
  },
  filledStar: {
    color: "#FFCC00",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 12,
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

export default OrderHistoryScreen;
