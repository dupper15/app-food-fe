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

const DishBox = ({ dish }) => {
  const route = useRouter();
  const handleNavigate = () => {
    route.push({
      pathname: "../screen/dishPage",
      params: {
        data: JSON.stringify(dish),
      },
    });
  };

  return (
    <View>
      <TouchableHighlight
        onPress={handleNavigate}
        className='relative bg-white rounded-lg shadow-lg w-full'>
        <View>
          {dish.best && (
            <View className='absolute -top-2 -left-2 p-1'>
              <Image
                className='w-6 h-6'
                source={require("../../assets/images/best-seller.png")}
              />
            </View>
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
              <TouchableOpacity className='bg-customYellow p-2 rounded-full'>
                <Icon name='shopping-cart' size={20} color='white' />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default DishBox;
