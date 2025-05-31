import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Checkbox } from "react-native-paper";
import { Stepper } from "react-native-ui-lib";
import { transPrice } from "./../../utils/transPrice";
interface Topping {
  name: string;
  price: number;
  [key: string]: any;
}

interface Dish {
  name: string;
  image: string;
  price: number;
  [key: string]: any;
}

interface OrderItem {
  dish_id: Dish;
  quantity: number;
  topping?: Topping[];
  [key: string]: any;
}

interface Restaurant {
  name: string;
  [key: string]: any;
}

interface CartItem {
  restaurant_id: Restaurant;
  order_items: OrderItem[];
}

interface Props {
  selectedDish: OrderItem[];
  item: CartItem;
  restaurantIndex: number;
  toggleRestaurantCheckbox: (restaurantIndex: number) => void;
  toggleCheckbox: (restaurantIndex: number, itemIndex: number) => void;
  updateQuantity: (
    restaurantIndex: number,
    itemIndex: number,
    value: number
  ) => void;
  setEditedItem: (item: OrderItem) => void;
  setShowModal: (show: boolean) => void;
}
const CardItem = ({
  selectedDish,
  item,
  restaurantIndex,
  toggleRestaurantCheckbox,
  toggleCheckbox,
  updateQuantity,
  setEditedItem,
  setShowModal,
}: Props) => {
  return (
    <View className='mb-2 bg-white p-4 rounded-lg '>
      <View className='flex-row items-center justify-between mb-4'>
        <View className='flex-row gap-2'>
          <View className='rounded-full border border-gray-200'>
            <Checkbox
              status={
                item.order_items.every((orderItem: any) =>
                  selectedDish.includes(orderItem)
                )
                  ? "checked"
                  : "unchecked"
              }
              onPress={() => toggleRestaurantCheckbox(restaurantIndex)}
            />
          </View>
          <Text className='text-xl font-semibold'>
            {item.restaurant_id.name}
          </Text>
        </View>
        <View className='flex-row items-center'>
          <Ionicons name='walk' size={20} color='#FFC515' />
          <Text className='text-gray-500 ml-1'>25 mins</Text>
        </View>
      </View>

      {item.order_items.map((orderItem: any, itemIndex: any) => (
        <TouchableOpacity
          onPress={() => {
            setShowModal(true);
            setEditedItem(orderItem);
          }}
          key={itemIndex}>
          <View className='flex-row items-center mb-4 '>
            <View className='rounded-full border border-gray-200'>
              <Checkbox
                status={
                  selectedDish.includes(orderItem) ? "checked" : "unchecked"
                }
                onPress={() => toggleCheckbox(restaurantIndex, itemIndex)}
              />
            </View>
            <Image
              source={{ uri: orderItem.dish_id.image }}
              className='w-16 h-16 rounded-lg ml-2'
            />
            <View className='ml-4 flex-1'>
              <Text className='text-lg font-medium'>
                {orderItem.dish_id.name}
              </Text>
              <View className='flex-col gap-2'>
                <Text className='text-gray-600'>
                  {transPrice(
                    orderItem.dish_id.price * orderItem.quantity +
                      (orderItem.topping ?? []).reduce(
                        (sum: number, topping: any) => sum + topping.price,
                        0
                      )
                  )}
                </Text>
                {orderItem.topping && (
                  <Text className='text-gray-500 truncate'>
                    (
                    {orderItem.topping
                      .map((topping: any) => topping.name)
                      .join(", ")}
                    )
                  </Text>
                )}
              </View>
            </View>
            <Stepper
              value={orderItem.quantity}
              minValue={1}
              maxValue={99}
              onValueChange={(value) =>
                updateQuantity(restaurantIndex, itemIndex, value)
              }
            />
          </View>
        </TouchableOpacity>
      ))}
      <View className='flex-row justify-between items-center mt-4'>
        <Text className='text-lg font-semibold'>Total Price:</Text>
        <Text className='text-lg font-semibold text-green-600'>
          {transPrice(
            item.order_items.reduce(
              (sum, orderItem) =>
                sum +
                orderItem.dish_id.price * orderItem.quantity +
                (orderItem.topping?.reduce(
                  (toppingSum, topping) => toppingSum + topping.price,
                  0
                ) || 0),
              0
            )
          )}
        </Text>
      </View>
    </View>
  );
};
export default CardItem;
