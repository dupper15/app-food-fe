import { useEffect } from "react";
import {
  Image,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Res from "@/types/RestaurantInterface";
import { useRouter } from "expo-router";
const { width } = Dimensions.get("window");
const RestaurantBox: React.FC<{ restaurant: Res.RestaurantData }> = ({
  restaurant,
}) => {
  const route = useRouter();
  const handleNavigate = () => {
    route.push({
      pathname: "/screens/screen/restaurantPage",
      params: {
        data: JSON.stringify(restaurant),
      },
    });
  };
  return (
    <TouchableHighlight
      underlayColor='#F3F4F6'
      className='rounded-lg bg-white'
      onPress={() => handleNavigate()}>
      <View
        style={{
          width: width * 0.45,
          position: "relative",
          height: width * 0.5,
        }}>
        <Image
          source={{ uri: restaurant.owner_id?.avatar }}
          className='w-full  rounded-t-lg'
          resizeMode='cover'
          style={{ aspectRatio: 16 / 9 }}
        />

        <View className='p-2'>
          <Text className='text-lg font-semibold text-gray-900 mb-1 whitespace-nowrap overflow-hidden text-ellipsis'>
            {restaurant.name}
          </Text>
        </View>
        <View className='flex-row justify-between items-center absolute bottom-2 left-2'>
          <View className='flex-row items-center gap-1'>
            <Icon name='star' size={24} color={"#FFC515"} />
            <Text className='text-gray-700 text-base'>{restaurant.rating}</Text>
          </View>
        </View>
        <View className='bg-customYellow p-2 rounded-full absolute right-2 bottom-2'>
          <Icon name='shopping-cart' size={24} color={"white"} />
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default RestaurantBox;
