import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
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
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import OrderComponent from "@/app/components/orderItem";
import RatingPopup from "@/app/components/rating";
import ratingApi from "@/services/api/ratingApi";

// Tab options
const TABS = ["Ongoing", "History"];

// Create a context for history refresh
export const HistoryRefreshContext = createContext<{
  refreshHistory: () => Promise<any>; // Changed from Promise<void> to Promise<any>
}>({
  refreshHistory: async () => {},
});

// Custom hook to use history refresh
export const useHistoryRefresh = () => useContext(HistoryRefreshContext);

const OrderHistoryScreen = () => {
  const [ratingVisible, setRatingVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [existingRatingId, setExistingRatingId] = useState<string | null>(null);
  const { refresh } = useLocalSearchParams();
  const userId = useSelector(
    (state: { user: { userId: string } }) => state.user.userId
  );

  // Fetch complete history data
  const {
    data: historyData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userHistory", userId],
    queryFn: () => fetchCompleteHistory(userId),
    refetchOnWindowFocus: true,
  });

  // Force refetch when screen is focused
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Handle the refresh parameter
  useEffect(() => {
    if (refresh === "true") {
      console.log("Refreshing history data due to refresh parameter");
      refetch();
    }
  }, [refresh, refetch]);

  // Function to refresh history data
  const refreshHistory = useCallback(async () => {
    console.log("Refreshing history data...");
    return refetch();
  }, [refetch]);

  // Handle rating order
  const handleRateOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setRatingVisible(true);
  };

  const handleSubmitRating = async (
    rating: number,
    feedback: string,
    images: string[],
    ratingId?: string
  ) => {
    try {
      if (ratingId) {
        // Update existing rating
        await ratingApi.updateRating(ratingId, {
          content: feedback,
          rating: rating,
          image: images,
        });
      } else {
        // Create new rating
        await ratingApi.createRating({
          order_id: selectedOrderId,
          customer_id: userId,
          content: feedback,
          rating: rating,
          image: images,
        });
      }
      // Refetch data after rating submission
      await refetch();
      setRatingVisible(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const ongoingOrders = React.useMemo(() => {
    if (!historyData) return [];

    // Create a Set to track unique order IDs
    const uniqueOrderIds = new Set();

    // Statuses that are considered "ongoing" (case-insensitive comparison)
    const ongoingStatuses = ["pending", "received", "preparing", "ready"];

    return historyData.filter((item) => {
      const orderStatus = item.order.status.toLowerCase();
      // Check if the order status is one of the ongoing statuses
      if (ongoingStatuses.includes(orderStatus)) {
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

  const completedOrders = React.useMemo(() => {
    if (!historyData) return [];

    // Only include completed or canceled orders (case-insensitive comparison)
    return historyData.filter((item) => {
      const orderStatus = item.order.status.toLowerCase();
      return orderStatus === "completed" || orderStatus === "cancel";
    });
  }, [historyData]);

  // Helper function to capitalize first letter of status
  const capitalizeStatus = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Handle tracking route for ongoing orders
  const handleTrackRoute = (orderId: string) => {
    console.log("Track route for order:", orderId);
    router.navigate(`/customer/history/ongoing/track-route/${orderId}` as any);
  };

  // Render ongoing order item
  const renderOngoingItem = ({ item }: { item: CompleteHistoryItem }) => (
    <OrderComponent
      item={item}
      mode="ongoing"
      onTrackRoute={handleTrackRoute}
      status={capitalizeStatus(item.order.status)}
    />
  );

  // Render history order item
  const renderHistoryItem = ({ item }: { item: CompleteHistoryItem }) => (
    <OrderComponent
      item={item}
      mode="history"
      onRate={handleRateOrder}
      status={capitalizeStatus(item.order.status)}
    />
  );

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
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <HistoryRefreshContext.Provider value={{ refreshHistory }}>
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
        <RatingPopup
          visible={ratingVisible}
          onClose={() => setRatingVisible(false)}
          onSubmit={handleSubmitRating}
          orderId={selectedOrderId}
          userId={userId}
        />
      </SafeAreaView>
    </HistoryRefreshContext.Provider>
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
