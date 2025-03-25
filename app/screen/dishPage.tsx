import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { transPrice } from "./../../utils/transPrice";

const DishPage = () => {
  const { data } = useLocalSearchParams();
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [dish, setDish] = useState(null);

  useEffect(() => {
    if (data) {
      setDish(JSON.parse(data));
      if (dish) {
        console.log("dis", dish);
      }
    }
  }, [data]);

  const toggleTopping = (topping) => {
    setSelectedToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping]
    );
  };

  return dish ? (
    <ScrollView className='flex-1 bg-gray-100'>
      {/* Nút back */}
      <View className='absolute top-5 left-5 z-10'>
        <TouchableOpacity className='bg-white rounded-full p-2 shadow-md'>
          <Icon name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
      </View>

      {/* Hình ảnh món ăn */}
      <Image
        source={{ uri: dish.image }}
        className='w-full h-60 rounded-b-3xl'
        resizeMode='cover'
      />

      <View className='p-4'>
        <View className='flex-row gap-2'>
          <Text className='text-3xl font-bold text-gray-900'>{dish.name}</Text>
          {dish.best_seller && (
            <Image source={require("../../assets/images/best-seller.png")} />
          )}
        </View>
        <View className='flex-row items-center mt-2'>
          <Icon name='restaurant' size={20} color='#FF6347' />
          <Text className='text-lg text-gray-700 ml-2'>KFC</Text>
        </View>

        <View className='flex-row justify-between items-center mt-4'>
          <Text className='text-xl font-semibold text-gray-800'>
            {transPrice(dish.price)}
          </Text>
          <View className='flex-row items-center'>
            <Icon name='access-time' size={20} color='gray' />
            <Text className='text-gray-600 ml-1'>{dish.time} min</Text>
          </View>
        </View>

        <Text className='text-gray-600 mt-4 leading-6'>{dish.introduce}</Text>

        <Text className='text-xl font-bold mt-6'>
          Toppings (Không bắt buộc)
        </Text>
        {dish.topping?.map((topping) => (
          <TouchableOpacity
            key={topping.name}
            className='flex-row items-center mt-3 border p-3 rounded-lg bg-white'
            onPress={() => toggleTopping(topping.name)}>
            <View
              className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                selectedToppings.includes(topping.name)
                  ? "bg-yellow-400 border-yellow-600"
                  : "border-gray-400"
              }`}>
              {selectedToppings.includes(topping.name) && (
                <Icon name='check' size={16} color='white' />
              )}
            </View>
            <Text className='ml-3 text-gray-800'>{topping.name}</Text>
            <Text className='ml-auto text-gray-700'>${topping.price}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity className='mt-6 bg-red-500 py-3 rounded-lg shadow-lg'>
          <Text className='text-white text-lg font-semibold text-center'>
            Add to cart - {transPrice(dish?.price)}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  ) : (
    <View className='flex-1 justify-center items-center'>
      <Text>Loading...</Text>
    </View>
  );
};

export default DishPage;
