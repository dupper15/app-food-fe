import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { NotificationInterface } from "@/types/NotificationInterface";

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
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "20932e09-1784-4225-9faa-86badb78b1d3",
      })
    ).data;
    console.log("Expo Push Token:", token);
  } catch (e) {
    console.error("Error getting Expo push token:", e);
    token = undefined;
  }
  return token;
}

export const useNotificationListener = () => {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const orderId = response.notification.request.content.data.orderId;
        console.log("Notification response received:", response);
        if (orderId) {
          router.push({
            pathname: "/screens/customer/(tabs)/notification",
            params: { orderId: orderId as string },
          });
        } else {
          router.push("/screens/customer/(tabs)/notification");
        }
      }
    );

    return () => subscription.remove();
  }, []);
};

export const fetchAllNotifcationsByUser = async (
  id: string
): Promise<NotificationInterface[]> => {
  const response = await axiosInstance.get(`/notification/user/${id}`);
  return response.data;
};

export const updateNotification = async (
  id: string
): Promise<NotificationInterface> => {
  const response = await axiosInstance.post(
    `/notification/change-status/${id}`
  );
  return response.data;
};
