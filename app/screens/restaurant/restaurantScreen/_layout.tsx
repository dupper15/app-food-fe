import { createStackNavigator } from "@react-navigation/stack";
import Restaurant from "./restaurant";
import EditRestaurant from "./editRestaurant";
import Menu from "./menu";
import Voucher from "./voucher";
import Rating from "./rating";
import VoucherModal from "@/components/modals/voucherModal";
import Topping from "./topping";
import ChangePassword from "./changePassword";

const Stack = createStackNavigator();

export const RestaurantStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Overview'
        component={Restaurant}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='EditRestaurant'
        component={EditRestaurant}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Menu'
        component={Menu}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Voucher'
        component={Voucher}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Rating'
        component={Rating}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Topping'
        component={Topping}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='ChangePassword'
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen name='VoucherModal' component={VoucherModal} />
    </Stack.Navigator>
  );
};
