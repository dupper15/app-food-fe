import { createStackNavigator } from "@react-navigation/stack";
import Restaurant from "./restaurant";
import EditRestaurant from "./editRestaurant";
import Menu from "./menu";
import Voucher from "./voucher";
import Rating from "./rating";
import DarkMode from "./darkmode";

const Stack = createStackNavigator();

export const RestaurantStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Overview"
        component={Restaurant}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="EditRestaurant" component={EditRestaurant} />
      <Stack.Screen
        name="Menu"
        component={Menu}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Voucher"
        component={Voucher}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Rating" component={Rating} />
      <Stack.Screen name="DarkMode" component={DarkMode} />
    </Stack.Navigator>
  );
};
