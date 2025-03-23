import { Image, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { transPrice } from "./../../utils/transPrice";

const DishBox = ({ dish }) => {
  return (
    <View className='relative bg-white rounded-lg shadow-lg  w-full'>
      {/* Huy hiệu "Best" */}
      {dish.best && (
        <View className='absolute -top-2 -left-2 p-1 '>
          <Image
            className='w-6 h-6'
            source={require("../../assets/images/best-seller.png")}
          />
        </View>
      )}

      {/* Hình ảnh món ăn */}
      <Image className='w-full h-32 rounded-md' source={{ uri: dish.image }} />

      <View className='p-2'>
        {/* Thông tin món ăn */}
        <Text className='text-sm font-semibold mt-1'>{dish.name}</Text>

        {/* Giá và nút thêm vào giỏ hàng */}
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
  );
};

export default DishBox;
