// UpdateUsageTime.tsx
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { setUsageTime } from "@/services/api/userApi";

export function UpdateUsageTime() {
  const appState = useRef(AppState.currentState);

  const setUsageTimeMutation = useMutation({
    mutationFn: setUsageTime,
    onSuccess: (data) => {
      console.log("Usage time updated:", data);
    },
    onError: (error) => {
      console.error("Error updating usage time:", error);
    },
  });

  const updateUsageTime = async () => {
    try {
      const startTime = await AsyncStorage.getItem("startTime");
      if (!startTime) return;

      const endTime = Date.now();
      const delta = endTime - Number(startTime);
      if (delta <= 0) return;

      const usageTime = await AsyncStorage.getItem("usageTime");
      const previousUsageTime = usageTime ? Number(usageTime) : 0;
      const newUsageTime = previousUsageTime + delta;

      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const data = { userId, usageTime: newUsageTime };
        setUsageTimeMutation.mutate(data);
      }

      await AsyncStorage.setItem("usageTime", newUsageTime.toString());
    } catch (error) {
      console.error("Error updating usage time:", error);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.current === "active" &&
          nextAppState.match(/inactive|background/)
        ) {
          await updateUsageTime();
        } else if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          await AsyncStorage.setItem("startTime", Date.now().toString());
          console.log("App active, startTime reset");
        }

        appState.current = nextAppState;
      }
    );

    AsyncStorage.setItem("startTime", Date.now().toString());

    return () => {
      subscription.remove();
    };
  }, []);

  return null;
}
