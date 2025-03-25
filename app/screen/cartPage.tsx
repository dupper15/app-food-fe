import { useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CardItem from "../components/cartItem";

const CartPage = () => {
  const [selectedDish, setSelectedDish] = useState([]);

  const toggleCheckbox = (restaurantIndex: number, itemIndex: number) => {
    const selectedRestaurant = cart[restaurantIndex];
    const selectedItem = selectedRestaurant.order_items[itemIndex];

    if (selectedDish.length > 0) {
      const currentRestaurant = cart.find((res) =>
        res.order_items.some((item) => selectedDish.includes(item))
      );
      if (currentRestaurant && currentRestaurant !== selectedRestaurant) {
        setSelectedDish([selectedItem]);
        return;
      }
    }

    if (selectedDish.includes(selectedItem)) {
      setSelectedDish(selectedDish.filter((item) => item !== selectedItem));
    } else {
      setSelectedDish([...selectedDish, selectedItem]);
    }
  };

  const toggleRestaurantCheckbox = (restaurantIndex: number) => {
    const selectedRestaurant = cart[restaurantIndex];
    const restaurantItems = selectedRestaurant.order_items;

    if (selectedDish.length > 0) {
      const currentRestaurant = cart.find((res) =>
        res.order_items.some((item) => selectedDish.includes(item))
      );
      if (currentRestaurant && currentRestaurant !== selectedRestaurant) {
        setSelectedDish([...restaurantItems]);
        return;
      }
    }

    const allSelected = restaurantItems.every((item) =>
      selectedDish.includes(item)
    );

    setSelectedDish(allSelected ? [] : [...restaurantItems]);
  };
  const [cart, setCart] = useState([
    {
      restaurant_id: { name: "Burger King" },
      order_items: [
        {
          dish_id: {
            name: "Cheeseburger",
            price: 5.99,
            image:
              "https://th.bing.com/th/id/R.a2f90a353f8477ff36567a0f458a26df?rik=WafrhYO%2fvOvCWA&pid=ImgRaw&r=0",
          },
          topping: [
            {
              name: "Cheese",
              price: 0.99,
            },
            {
              name: "Bacon",
              price: 1.99,
            },
          ],
          quantity: 1,
        },
        {
          dish_id: {
            name: "Fries",
            price: 2.99,
            image:
              "https://th.bing.com/th/id/R.a2f90a353f8477ff36567a0f458a26df?rik=WafrhYO%2fvOvCWA&pid=ImgRaw&r=0",
          },
          topping: [],
          quantity: 1,
        },
      ],
    },
    {
      restaurant_id: { name: "KFC" },
      order_items: [
        {
          dish_id: {
            name: "Fried Chicken",
            price: 7.99,
            image:
              "https://th.bing.com/th/id/R.a2f90a353f8477ff36567a0f458a26df?rik=WafrhYO%2fvOvCWA&pid=ImgRaw&r=0",
          },
          topping: [],
          quantity: 1,
        },
        {
          dish_id: {
            name: "Coleslaw",
            price: 1.99,
            image:
              "https://th.bing.com/th/id/R.a2f90a353f8477ff36567a0f458a26df?rik=WafrhYO%2fvOvCWA&pid=ImgRaw&r=0",
          },
          topping: [],
          quantity: 1,
        },
      ],
    },
  ]);

  const updateQuantity = (
    restaurantIndex: number,
    itemIndex: number,
    value: number
  ) => {
    const newCart = [...cart];
    newCart[restaurantIndex].order_items[itemIndex].quantity = value;
    setCart(newCart);
  };
  const handleCheckout = () => {
    console.log("Order confirmed", selectedDish);
  };
  return (
    <View className='flex-1 bg-gray-100'>
      <View className='flex-row justify-start gap-4 items-center p-4 bg-white shadow-sm'>
        <Ionicons name='arrow-back' size={24} color='black' />
        <Text className='text-2xl font-medium text-gray-900'>My Cart</Text>
      </View>

      {cart.length > 0 ? (
        <ScrollView className='p-4'>
          {cart.map((item, restaurantIndex) => (
            <CardItem
              selectedDish={selectedDish}
              item={item}
              restaurantIndex={restaurantIndex}
              toggleRestaurantCheckbox={toggleRestaurantCheckbox}
              toggleCheckbox={toggleCheckbox}
              updateQuantity={updateQuantity}
            />
          ))}
          <TouchableOpacity
            className='m-4 bg-customYellow p-4 rounded-lg shadow-sm'
            onPress={() => {
              handleCheckout();
              console.log("heloo");
            }}>
            <Text className='text-lg font-semibold text-white text-center'>
              Order Now
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View className='flex-1 justify-center items-center'>
          <Text className='text-lg text-gray-500'>
            You have no items in your cart
          </Text>
        </View>
      )}
    </View>
  );
};

export default CartPage;
