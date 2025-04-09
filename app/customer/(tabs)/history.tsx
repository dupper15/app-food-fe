import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import OrderComponent from "@/app/components/orderItem";

// Tab options
const TABS = ["Ongoing", "History"];

const OrderHistoryScreen = () => {
  const [activeTab, setActiveTab] = useState(0); // Default to Ongoing tab
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

  const ongoingOrders = React.useMemo(() => {
    if (!historyData) return [];

    // Create a Set to track unique order IDs
    const uniqueOrderIds = new Set();

    return historyData.filter((item) => {
      // Only include orders with 'ongoing' status that we haven't seen before
      if (item.order.status.toLowerCase() === "ongoing") {
        // If we've already seen this order ID, skip it
        if (uniqueOrderIds.has(item.order._id)) {
          return false;
        }
        // Otherwise, add it to our set and include it
        uniqueOrderIds.add(item.order._id);
        return true;
      }
      return false;
    });
  }, [historyData]);

  const completedOrders =
    historyData?.filter(
      (item) =>
        item.order.status.toLowerCase() === "completed" ||
        item.order.status.toLowerCase() === "canceled"
    ) || [];

  // Handle tracking route for ongoing orders
  const handleTrackRoute = (orderId: string) => {
    console.log("Track route for order:", orderId);
    router.navigate(`/customer/tracking/${orderId}` as any);
  };

  // Handle canceling an ongoing order
  const handleCancelOrder = (orderId: string) => {
    console.log("Cancel order:", orderId);
    // Implement cancel order logic
  };

  // Handle rating a completed order
  const handleRateOrder = (orderId: string) => {
    console.log("Rate order:", orderId);
    // Implement rate order logic
  };

  // Handle reordering a completed order
  const handleReorderOrder = (orderId: string) => {
    console.log("Reorder:", orderId);
    // Implement reorder logic
  };

  // Render ongoing order item
  const renderOngoingItem = ({ item }: { item: CompleteHistoryItem }) => (
    <OrderComponent
      item={item}
      mode='ongoing'
      onTrackRoute={handleTrackRoute}
      onCancel={handleCancelOrder}
    />
  );

  // Render history order item
  const renderHistoryItem = ({ item }: { item: CompleteHistoryItem }) => (
    <OrderComponent
      item={item}
      mode='history'
      onRate={handleRateOrder}
      onReorder={handleReorderOrder}
    />
  );

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size='large' color='#FFCC00' />
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
      <StatusBar barStyle='dark-content' />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => setActiveTab(index)}>
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}>
              {tab}
            </Text>
            {activeTab === index && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Order List - conditionally render based on active tab */}
      {activeTab === 0 ? (
        <FlatList
          data={ongoingOrders}
          renderItem={renderOngoingItem}
          keyExtractor={(item) => item.historyItem._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No ongoing orders</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={completedOrders}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.historyItem._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No order history found</Text>
            </View>
          }
        />
      )}
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
});

export default OrderHistoryScreen;
