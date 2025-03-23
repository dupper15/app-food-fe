import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  Dimensions,
  Touchable,
  TouchableHighlight,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Icon from "react-native-vector-icons/MaterialIcons";
import DishBox from "../components/dishBox";

const { width } = Dimensions.get("window");

const RestaurantPage = () => {
  const { data } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dishes, setDishes] = useState([
    {
      id: 1,
      name: "Bún bò Huế",
      price: 50000,
      image:
        "https://th.bing.com/th/id/OIP._iu9kozRYB1qE0GH4ucRiwAAAA?rs=1&pid=ImgDetMain",
    },
    {
      id: 2,
      name: "Phở bò",
      price: 40000,
      image:
        "https://th.bing.com/th/id/OIP._iu9kozRYB1qE0GH4ucRiwAAAA?rs=1&pid=ImgDetMain",
    },
    {
      id: 3,
      name: "Bún riêu",
      price: 30000,
      image:
        "https://th.bing.com/th/id/OIP._iu9kozRYB1qE0GH4ucRiwAAAA?rs=1&pid=ImgDetMain",
    },
  ]);
  const [categories, setCategories] = useState([
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
    "Drinks",
    "Desserts",
  ]);
  const [currentCategory, setCurrentCategory] = useState(0);
  useEffect(() => {
    if (data) {
      setRestaurant(JSON.parse(data));
    }
  }, [data]);

  return (
    <ScrollView className='bg-gray-100'>
      <View className='relative'>
        {restaurant?.banners && restaurant.banners.length > 0 ? (
          <>
            <Carousel
              loop
              width={width}
              height={200}
              autoPlay
              data={restaurant.banners}
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => setCurrentIndex(index)}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  className='w-full h-52 rounded-lg'
                  resizeMode='cover'
                />
              )}
            />
            {/* Dấu chấm chỉ mục */}
            <View className='absolute bottom-4 left-1/2 -translate-x-1/2 flex-row'>
              {restaurant.banners.map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    currentIndex === index
                      ? "bg-white opacity-100"
                      : "bg-gray-400 opacity-50"
                  }`}
                />
              ))}
            </View>
          </>
        ) : (
          <Text className='text-center text-gray-500'>Loading banners...</Text>
        )}
      </View>

      <View className='p-4'>
        <Text className='text-3xl font-bold text-gray-900 mb-2'>
          {restaurant?.name}
        </Text>

        <View className='flex-row items-center space-x-2 mb-2'>
          <Icon name='location-on' size={22} color='#FF6347' />
          <Text className='text-lg text-gray-700'>{restaurant?.address}</Text>
        </View>

        <Text className='text-base text-gray-600 leading-6'>
          {restaurant?.description}
        </Text>

        <View className='flex-row items-center mt-4 space-x-2'>
          <Icon name='star' size={24} color={"#FFC107"} />
          <Text className='text-lg font-medium text-gray-800'>
            {restaurant?.rating} 4.5 / 5
          </Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className='flex-row px-4 py-2 '>
        {categories.map((category, index) => (
          <TouchableHighlight
            key={index}
            onPress={() => setCurrentCategory(index)}
            underlayColor='#FACC15'
            className={`rounded-lg px-4 py-2 transition-all border mx-1 border-customYellow duration-300 ${
              index === currentCategory ? "bg-customYellow" : "bg-white"
            }`}>
            <Text
              className={`text-sm font-semibold ${
                index === currentCategory ? "text-white" : "text-customYellow"
              }`}>
              {category}
            </Text>
          </TouchableHighlight>
        ))}
      </ScrollView>
      <View>
        {dishes.length > 0 ? (
          <View className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4'>
            {dishes.map((dish) => (
              <DishBox key={dish.id} dish={dish} />
            ))}
          </View>
        ) : (
          <Text className='text-center text-gray-500'>No dishes found</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default RestaurantPage;
