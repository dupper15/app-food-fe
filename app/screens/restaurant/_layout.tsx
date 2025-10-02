import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Order from "./orderScreen/order";
import History from "./historyScreen/history";
import Notification from "./notification";
import Revenue from "./revenueScreen/revenue";
import { RestaurantStackNavigator } from "./restaurantScreen/_layout";

const Tab = createBottomTabNavigator();

export default function CustomerLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 45,
          paddingBottom: 0,
        },
        tabBarActiveTintColor: "#FFC515",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";

          if (route.name === "Order") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "History") {
            iconName = focused ? "time" : "time-outline";
          } else if (route.name === "Notification") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route.name === "Revenue") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          } else if (route.name === "Restaurant") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name='Order' component={Order} />
      <Tab.Screen name='History' component={History} />
      <Tab.Screen name='Notification' component={Notification} />
      <Tab.Screen name='Revenue' component={Revenue} />
      <Tab.Screen name='Restaurant' component={RestaurantStackNavigator} />
    </Tab.Navigator>
  );
}
