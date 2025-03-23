import { Stack } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function CustomerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen name="tabs" />
      <Stack.Screen name="chat" />
    </Stack>
  );
}
