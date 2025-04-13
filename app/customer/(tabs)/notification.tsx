import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import notificationApi, { Notification } from "@/services/api/notificationApi";
import { Ionicons } from "@expo/vector-icons";

const NotificationsScreen = () => {
  const [processedSession, setProcessedSession] = useState(false);
  const userId = useSelector(
    (state: { user: { userId: string } }) => state.user.userId
  );
  const queryClient = useQueryClient();

  // Fetch notifications using the provided API
  const {
    data: notifications,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userNotifications", userId],
    queryFn: () => notificationApi.getUserNotifications(userId),
  });

  // Mutation to mark a notification as seen
  const markSeenMutation = useMutation({
    mutationFn: (notificationId: string) =>
      notificationApi.markAsSeen(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userNotifications", userId],
      });
    },
  });

  useFocusEffect(
    useCallback(() => {
      // Refresh notifications data when tab is selected
      refetch();

      // Reset the processing flag when coming into focus
      setProcessedSession(false);

      return () => {
        // This runs when the screen goes out of focus
        // Only process unseen notifications once per focus session
        if (!processedSession && notifications && notifications.length > 0) {
          const unseenNotifications = notifications.filter(
            (notification) => !notification.isSeen
          );

          if (unseenNotifications.length > 0) {
            // Mark that we've processed notifications for this session
            setProcessedSession(true);
            // Only mark the first unseen notification to avoid cascading updates
            markSeenMutation.mutate(unseenNotifications[0]._id);
          }
        }
      };
    }, [userId, notifications, processedSession])
  );

  // Handle notification press - mark as seen if not already
  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isSeen) {
      markSeenMutation.mutate(notification._id);
    }
  };

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return "Unknown time";

    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  // Render a notification item
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isSeen && styles.unreadNotification,
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationIcon}>
        <Ionicons
          name="notifications-circle"
          size={24}
          color={!item.isSeen ? "#FFCC00" : "#9E9E9E"}
        />
      </View>
      <View style={styles.notificationContent}>
        <Text
          style={[
            styles.notificationText,
            !item.isSeen && styles.unreadNotificationText,
          ]}
        >
          {item.content}
        </Text>
        <View style={styles.notificationMeta}>
          <Ionicons name="time-outline" size={14} color="#9E9E9E" />
          <Text style={styles.timeText}>
            {item.createdAt
              ? formatRelativeTime(item.createdAt)
              : "Unknown time"}
          </Text>
          {item.isSeen && (
            <View style={styles.seenIndicator}>
              <Ionicons name="checkmark" size={14} color="#129575" />
              <Text style={styles.seenText}>Seen</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FFCC00" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Failed to load notifications</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() =>
            queryClient.invalidateQueries({
              queryKey: ["userNotifications", userId],
            })
          }
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications && notifications.length > 0 && (
          <View style={styles.notificationCount}>
            <Text style={styles.notificationCountText}>
              {notifications.filter((n) => !n.isSeen).length} new
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={48}
              color="#E0E0E0"
            />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubText}>
              We'll notify you when something important happens
            </Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  notificationCount: {
    backgroundColor: "#FFCC00",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  notificationCountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
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
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#F8F8F8",
    marginBottom: 12,
  },
  unreadNotification: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FFCC00",
  },
  notificationIcon: {
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 8,
  },
  unreadNotificationText: {
    fontWeight: "500",
  },
  notificationMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    color: "#9E9E9E",
    marginLeft: 4,
  },
  seenIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  seenText: {
    fontSize: 12,
    color: "#129575",
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#757575",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#9E9E9E",
    textAlign: "center",
    marginTop: 8,
  },
});

export default NotificationsScreen;
