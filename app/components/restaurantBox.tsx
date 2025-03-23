import { useEffect } from "react";
import { Image, Text, TouchableHighlight, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Res from "../../interfaces/RestaurantInterface";
import { useRouter } from "expo-router";

const RestaurantBox: React.FC<{ restaurant: Res.RestaurantData }> = ({
  restaurant,
}) => {
  const route = useRouter();
  const handleNavigate = () => {
    route.push({
      pathname: "../screen/restaurantPage",
      params: {
        data: JSON.stringify(restaurant),
      },
    });
  };
  return (
    <TouchableHighlight
      className='rounded-lg bg-white shadow-md w-48'
      onPress={() => handleNavigate()}>
      <View style={{ minHeight: 180 }}>
        <Image
          source={{ uri: restaurant.owner_id?.avatar }}
          className='w-full h-40 rounded-t-lg'
          resizeMode='cover'
          style={{ aspectRatio: 16 / 9 }}
        />

        <View className='p-2'>
          <Text className='text-lg font-semibold text-gray-900 mb-1'>
            {restaurant.name}
          </Text>

          <View className='flex-row justify-between items-center'>
            <View className='flex-row items-center gap-1'>
              <Icon name='star' size={24} color={"#FFC515"} />
              <Text className='text-gray-700 text-base'>
                {restaurant.rating}
              </Text>
            </View>

            <TouchableHighlight
              className='bg-customYellow p-2 rounded-full'
              underlayColor={"#FFD700"}>
              <Icon name='shopping-cart' size={24} color={"white"} />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default RestaurantBox;
