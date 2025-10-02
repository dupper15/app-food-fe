import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Text,
  View,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Stepper } from "react-native-ui-lib";
import { transPrice } from "../../utils/transPrice";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useMutation } from "@tanstack/react-query";
import * as CartApi from "@/apis/cartApi";
import { CustomToast } from "../ui/toast";
import * as DishApi from "@/apis/dishApi";
import { useSelector } from "react-redux";
const EditOIModal = ({
  getCart,
  orderItem,
  showModal,
  setShowModal,
  setEditedItem,
}) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const [dish, setDish] = useState(null);
  const [quantity, setQuantity] = useState(orderItem.quantity || 1);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const userId = useSelector((state) => state.user.userId);
  const getDetailDishMutation = useMutation({
    mutationFn: DishApi.fetchDishById,
    onSuccess: (data) => {
      setDish(data);
    },
    onError: () => {
      CustomToast("error", "Error", "Failed to load dish details");
    },
  });
  useEffect(() => {
    if (orderItem) {
      getDetailDishMutation.mutate(orderItem.dish_id._id);
    }
  }, [orderItem]);
  useEffect(() => {
    if (orderItem) {
      setDish(orderItem.dish_id);
      setQuantity(orderItem.quantity || 1);
      if (orderItem.topping) {
        setSelectedToppings(orderItem.topping.map((t) => t._id));
      }
    }
  }, [orderItem]);

  useEffect(() => {
    if (showModal) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showModal]);
  const deleteItemMutation = useMutation({
    mutationFn: CartApi.deleteCart,
    onSuccess: () => {
      getCart();
      CustomToast("success", "Success", "Delete successfully");
    },
    onError: () => {
      CustomToast("error", "Error", "Delete failed, please try again");
    },
  });
  const deleteItem = () => {
    const data = { userId: userId, orderItemId: orderItem._id };
    deleteItemMutation.mutate(data);
  };
  const toggleTopping = (topping) => {
    if (!topping) return;
    setSelectedToppings((prev = []) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping]
    );
  };
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
  const editCartMutation = useMutation({
    mutationFn: CartApi.editCart,
    onSuccess: () => {
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
  return (
    <Modal transparent={true} visible={showModal} animationType='fade'>
      <TouchableWithoutFeedback
        onPress={() => {
          setShowModal(false);
          setEditedItem(null);
          getCart();
        }}>
        <View className='flex-1 justify-end bg-black/50'>
          <Animated.View style={{ width: "100%", transform: [{ translateY }] }}>
            <View className='bg-white w-full rounded-t-2xl p-4 shadow shadow-black shadow-lg'>
              <View className='flex-row justify-between items-center mb-4'>
                <Text className='text-lg font-bold text-center flex-1 text-gray-800'>
                  Edit Order Item
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    deleteItem();
                    setEditedItem(null);
                    setShowModal(false);
                    getCart();
                  }}>
                  <Icon name='delete' size={24} color='#e74c3c' />
                </TouchableOpacity>
              </View>

              <Image
                source={{ uri: orderItem.dish_id.image }}
                className='w-full h-40 rounded-lg mb-4'
                resizeMode='cover'
              />

              <Text className='text-base font-medium text-gray-800'>
                {orderItem.dish_id.name}
              </Text>

              {dish && dish?.topping?.length > 0 && (
                <View className='mt-6'>
                  <Text className='text-xl font-medium'>Toppings</Text>
                  <Text className='text-md text-gray-500'>
                    * Không bắt buộc
                  </Text>
                  {dish?.topping.map((topping) => (
                    <TouchableOpacity
                      key={topping._id}
                      className='flex-row items-center mt-3  rounded-lg bg-white'
                      onPress={() => toggleTopping(topping._id)}>
                      <View
                        className={`w-6 h-6 border-2 rounded-full items-center justify-center ${
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

              <View className='mx-auto'>
                <Stepper
                  value={quantity}
                  minValue={1}
                  maxValue={99}
                  onValueChange={setQuantity}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  editCart();
                  setEditedItem(null);
                  getCart();
                  setShowModal(false);
                }}
                className='mt-6 bg-yellow-400 py-3.5 rounded-lg shadow-sm shadow-black/20'>
                <Text className='text-center text-white text-lg font-semibold'>
                  Edit - {transPrice(totalPrice)}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditOIModal;
