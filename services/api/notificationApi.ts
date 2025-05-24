import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  let token;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("myNotificationChannel", {
      name: "A channel is needed for the permissions prompt to appear",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (!Device.isDevice) {
    alert("Must use physical device for Push Notifications");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }
  
  try {
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
  } catch (e) {
    console.error("Error getting Expo push token:", e);
    token = undefined;
  }
=======
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

  return token;
}
