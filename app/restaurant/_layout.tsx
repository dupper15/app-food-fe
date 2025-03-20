import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Restaurant from "./screens/restaurant";
import Revenue from "./screens/revenue";
import Notification from "./screens/notification";
import Order from "./screens/order";
import History from "./screens/history";

const Tab = createBottomTabNavigator();

export default function RestaurantLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "bag-check";

          if (route.name === "Order") {
            iconName = focused ? "bag-check" : "bag-check-outline";
          } else if (route.name === "Restaurant") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          } else if (route.name === "Notification") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route.name === "Revenue") {
            iconName = focused ? "pie-chart" : "pie-chart-outline";
          } else if (route.name === "History") {
            iconName = focused ? "time" : "time-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Order" component={Order} />
      <Tab.Screen name="Notification" component={Notification} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Revenue" component={Revenue} />
      <Tab.Screen name="Restaurant" component={Restaurant} />
    </Tab.Navigator>
  );
}
