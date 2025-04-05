import { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CardItem from "../components/cartItem";
import { useMutation } from "@tanstack/react-query";
import * as CartApi from "@/services/api/cartApi";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { CustomToast } from "../components/toast";
import EditOIModal from "../components/editOIModal";
const CartPage = () => {
  const [selectedDish, setSelectedDish] = useState([]);
  const [editedItem, setEditedItem] = useState(null);
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
  const [cart, setCart] = useState(null);
  const getCartMutation = useMutation({
    mutationFn: CartApi.getCart,
    onSuccess: (data) => {
      setCart(data);
    },
    onError: (error) => {
      console.error("Error fetching cart:", error);
    },
  });
  const userId = useSelector((state: any) => state.user.userId);
  const getCart = async () => {
    getCartMutation.mutate(userId);
  };
  useEffect(() => {
    if (userId) {
      getCart();
    }
  }, [userId]);
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
    if (selectedDish.length > 0) {
      router.push({
        pathname: "./paymentPage",
        params: {
          selectedDish: JSON.stringify(selectedDish),
        },
      });
    } else {
      CustomToast("error", "Error", "Please select at least one item");
    }
  };
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  return (
    <View className='flex-1 bg-gray-100'>
      <View className='flex-row justify-start gap-4 items-center p-4 bg-white shadow-sm'>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
        <Text className='text-2xl font-medium text-gray-900'>My Cart</Text>
      </View>

      {cart && cart.length > 0 ? (
        <ScrollView className='p-4'>
          {cart.map((item, restaurantIndex) => (
            <CardItem
              setShowModal={setShowModal}
              setEditedItem={setEditedItem}
              key={restaurantIndex}
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
      {showModal && editedItem && (
        <EditOIModal
          orderItem={editedItem}
          setShowModal={setShowModal}
          showModal={showModal}
          setEditedItem={setEditedItem}
        />
      )}
    </View>
  );
};

export default CartPage;
