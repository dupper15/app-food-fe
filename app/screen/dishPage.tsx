import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { transPrice } from "./../../utils/transPrice";
import { useRouter } from "expo-router";
import { Stepper } from "react-native-ui-lib";
import { useMutation } from "@tanstack/react-query";
import * as CartApi from "@/services/api/cartApi";
import { CustomToast } from "../components/toast";
import { useSelector } from "react-redux";

const DishPage = () => {
  const { data, _orderItem } = useLocalSearchParams();
  const router = useRouter();
  const userId = useSelector((state) => state.user.userId);

  const [dish, setDish] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderItem, setOrderItem] = useState(null);
  useEffect(() => {
    if (data) {
      setDish(JSON.parse(data));
    }
    if (_orderItem) {
      const parsedOrderItem = JSON.parse(_orderItem);
      setOrderItem(parsedOrderItem);
      setQuantity(parsedOrderItem.quantity || 1);
      if (parsedOrderItem.topping) {
        setSelectedToppings(parsedOrderItem.topping.map((t) => t._id));
      }
    }
  }, [data, _orderItem]);

  useEffect(() => {
    if (dish) {
      const selectedToppingsDetails =
        dish.topping?.filter((t) => selectedToppings.includes(t._id)) || [];
      const toppingsPrice = selectedToppingsDetails.reduce(
        (acc, cur) => acc + (cur.price || 0),
        0
      );
      setTotalPrice(dish.price * quantity + toppingsPrice);
    }
  }, [dish, selectedToppings, quantity]);

  const toggleTopping = (topping) => {
    if (!topping) return;
    setSelectedToppings((prev = []) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping]
    );
  };

  const addToCartMutation = useMutation({
    mutationFn: CartApi.addToCart,
    onSuccess: () => {
      router.back();
      CustomToast("success", "Success", "Add successfully");
    },
    onError: () => {
      CustomToast("error", "Error", "Add failed, please try again");
    },
  });

  const addToCart = () => {
    console.log("add cart");
    if (!dish) return;
    addToCartMutation.mutate({
      userId,
      dish,
      quantity,
      topping: selectedToppings,
    });
  };
  const editCartMutation = useMutation({
    mutationFn: CartApi.editCart,
    onSuccess: () => {
      router.back();
      CustomToast("success", "Success", "Edit successfully");
    },
    onError: () => {
      CustomToast("error", "Error", "Edit failed, please try again");
    },
  });
  const editCart = () => {
    const data = {
      quantity,
      topping: selectedToppings,
      orderItemId: orderItem?._id,
    };
    editCartMutation.mutate(data);
  };

  if (!dish) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className='flex-1 bg-gray-100'>
      <View className='absolute top-5 left-5 z-10'>
        <TouchableOpacity
          onPress={() => router.back()}
          className='bg-white rounded-full p-2 shadow-md'>
          <Icon name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: dish.image }}
        className='w-full h-60'
        resizeMode='cover'
      />

      <View className='p-4'>
        <Text className='text-3xl font-bold text-gray-900'>{dish.name}</Text>
        <Text className='text-lg text-gray-700 mt-2'>KFC</Text>
        <Text className='text-xl font-semibold text-gray-800 mt-4'>
          {transPrice(dish.price)}
        </Text>
        <Text className='text-gray-600 mt-4 leading-6'>{dish.introduce}</Text>

        {dish.topping?.length > 0 && (
          <View className='mt-6'>
            <Text className='text-xl font-medium'>Toppings</Text>
            <Text className='text-md'>* Không bắt buộc</Text>
            {dish.topping.map((topping) => (
              <TouchableOpacity
                key={topping._id}
                className='flex-row items-center mt-3 p-3 rounded-lg bg-white'
                onPress={() => toggleTopping(topping._id)}>
                <View
                  className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                    selectedToppings.includes(topping._id)
                      ? "bg-yellow-400 border-yellow-600"
                      : "border-gray-400"
                  }`}>
                  {selectedToppings.includes(topping._id) && (
                    <Icon name='check' size={16} color='white' />
                  )}
                </View>
                <Text className='ml-3 text-gray-800'>{topping.name}</Text>
                <Text className='ml-auto text-gray-700'>
                  {transPrice(topping.price)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className='flex justify-center items-center mt-6'>
          <Stepper
            value={quantity}
            minValue={1}
            maxValue={99}
            onValueChange={setQuantity}
          />
        </View>

        <TouchableOpacity
          onPress={orderItem ? editCart : addToCart}
          className='mt-6 bg-customYellow py-3 rounded-lg shadow-lg'>
          <Text className='text-white text-lg font-semibold text-center'>
            {orderItem
              ? `Edit - ${transPrice(totalPrice)}`
              : `Add to cart - ${transPrice(totalPrice)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DishPage;
