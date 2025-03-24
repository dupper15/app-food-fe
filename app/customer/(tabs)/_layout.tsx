import { Tabs } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FFC515",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "home";

          if (route.name === "home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "favorite") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "notification") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route.name === "personal") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "history") {
            iconName = focused ? "time" : "time-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="favorite" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="notification" />
      <Tabs.Screen name="personal" />
    </Tabs>
  );
}
