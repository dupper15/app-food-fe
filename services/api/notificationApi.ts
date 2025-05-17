import axiosInstance from "./axiosInstance";

export interface Notification {
  _id: string;
  user_id: string;
  content: string;
  isSeen: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * API service for handling notification operations
 */
export const notificationApi = {
  /**
   * Create a new notification
   * @param notification The notification data to create
   * @returns The created notification object
   */
  createNotification: async (notification: {
    user_id: string;
    content: string;
    isSeen?: boolean;
  }): Promise<Notification> => {
    try {
      const response = await axiosInstance.post(
        "notification/create",
        notification
      );
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  /**
   * Mark a notification as seen
   * @param notificationId ID of the notification to mark as seen
   * @returns The updated notification object
   */
  markAsSeen: async (notificationId: string): Promise<Notification> => {
    try {
      const response = await axiosInstance.post(
        `notification/change-status/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error marking notification as seen:", error);
      throw error;
    }
  },

  /**
   * Fetch all notifications for a specific user
   * @param userId ID of the user
   * @returns Array of notification objects
   */
  getUserNotifications: async (userId: string): Promise<Notification[]> => {
    try {
      // Convert ObjectId to string if needed for the API call
      const response = await axiosInstance.get(`notification/user/${userId}`);
      return response.data.sort((a: Notification, b: Notification) => {
        return (
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
      });
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      throw error;
    }
  },
};

export default notificationApi;
