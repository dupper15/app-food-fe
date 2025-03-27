import {
  Image,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { transPrice } from "./../../utils/transPrice";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import * as CartApi from "@/services/api/cartApi";

const DishBox = ({ dish }) => {
  const route = useRouter();
  const [orderItem, setOrderItem] = useState(null);

  const handleNavigate = () => {
    const params = { data: JSON.stringify(dish) };

    if (orderItem) {
      params._orderItem = JSON.stringify(orderItem);
    }

    route.push({
      pathname: "../screen/dishPage",
      params,
    });
  };

  const userId = useSelector((state) => state.user.userId);
  const getOrderItemMutation = useMutation({
    mutationFn: CartApi.getOrderItem,
    onSuccess: (data) => {
      setOrderItem(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const getOrderItem = () => {
    const data = {
      userId,
      dishId: dish._id,
    };
    getOrderItemMutation.mutate(data);
  };
  useEffect(() => {
    if (userId) {
      getOrderItem();
    }
  }, []);

  return (
    <View className='relative'>
      <TouchableHighlight
        onPress={handleNavigate}
        className='relative bg-white rounded-lg shadow-lg w-full'>
        <View>
          {Boolean(dish.best_seller) && (
            <Image
              source={require("@/assets/images/best-seller.png")}
              style={{ width: 60, height: 60 }}
              className='absolute z-10 -top-4 -right-4'
              resizeMode='cover'
            />
          )}

          <Image
            className='w-full h-32 rounded-md'
            source={{ uri: dish.image }}
          />

          <View className='p-2'>
            <Text className='text-sm font-semibold mt-1'>{dish.name}</Text>

            <View className='flex flex-row justify-between items-center mt-1'>
              <Text className='text-lg font-bold text-red-700'>
                {transPrice(dish.price)}
              </Text>
              <TouchableOpacity className='bg-customYellow p-2 rounded-full w-10 h-10 flex items-center justify-center'>
                {orderItem ? (
                  <Text className='text-white font-medium text-lg text-center'>
                    {orderItem.quantity}
                  </Text>
                ) : (
                  <Icon name='shopping-cart' size={20} color='white' />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default DishBox;
