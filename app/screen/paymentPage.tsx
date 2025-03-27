import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const formatPrice = (price) => `${price.toLocaleString("vi-VN")} VND`;

const PaymentPage = () => {
  const [items, setItems] = useState([
    {
      image:
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      name: "Dish 1",
      price: 10000,
      quantity: 1,
      topping: [
        {
          name: "Topping 1",
          price: 1000,
        },
        {
          name: "Topping 2",
          price: 2000,
        },
      ],
    },
    {
      image:
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      name: "Dish 2",
      price: 15000,
      quantity: 1,
      topping: [
        {
          name: "Topping 3",
          price: 3000,
        },
        {
          name: "Topping 4",
          price: 2500,
        },
      ],
    },
  ]);

  return (
    <View className='flex-1 bg-white '>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View className='flex-row items-center gap-4 bg-white shadow-sm p-4'>
          <Ionicons name='arrow-back' size={24} color='black' />
          <Text className='text-2xl font-medium text-gray-900'>Payment</Text>
        </View>

        <View className='p-1 bg-slate-100'>
          <View className='p-4 bg-white rounded-lg mt-4 mb-4'>
            <Text className='text-2xl font-medium text-gray-900 '>
              Order Summary
            </Text>
            {items.map((item, index) => (
              <View
                key={index}
                className='flex-row gap-4 bg-white mt-4 rounded-lg'>
                <Image
                  source={{ uri: item.image }}
                  className='w-24 h-24 rounded-lg'
                  resizeMode='cover'
                />
                <View className='flex-1'>
                  <Text className='text-xl font-semibold text-gray-800'>
                    {item.name}
                  </Text>
                  <Text className='text-lg text-gray-700'>
                    {item.quantity} x {formatPrice(item.price)}
                  </Text>
                  <View className='flex-row gap-2 flex-wrap mt-1'>
                    {item.topping.map((topping, index) => (
                      <Text key={index} className='text-sm text-gray-500'>
                        + {topping.name} ({formatPrice(topping.price)})
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            ))}
            <View className='mt-2 flex flex-row justify-between'>
              <Text className='text-2xl font-medium text-gray-900'>
                Estimated Time
              </Text>
              <Text className='text-lg text-gray-600'>40 mins</Text>
            </View>
          </View>

          <View className='mt-4 mb-4 bg-white px-2'>
            <Text className='text-2xl font-semibold text-gray-900'>
              Notes (Optional)
            </Text>
            <TextInput
              className='h-24 p-4 bg-slate-100 rounded-lg mt-2 text-lg text-gray-700'
              placeholder='Add a note...'
            />
          </View>

          <View className='mt-4 mb-4 flex-row justify-between items-center bg-white px-2'>
            <Text className='text-2xl font-medium text-gray-900'>Voucher</Text>
            <Text className='text-2xl text-customYellow underline mb-4'>
              Select
            </Text>
          </View>

          <View className='mt-4 mb-4 bg-white p-4 rounded-lg'>
            <Text className='text-2xl font-semibold text-gray-900'>
              Payment Summary
            </Text>
            <Text className='text-lg text-gray-700 mt-2'>
              Total Food Cost: {formatPrice(25000)}
            </Text>
            <Text className='text-lg text-gray-700'>
              Voucher Discount: {formatPrice(5000)}
            </Text>
            <Text className='text-lg font-bold text-gray-900 mt-2'>
              Grand Total: {formatPrice(20000)}
            </Text>
          </View>

          <TouchableOpacity className='mt-6 bg-customYellow mb-4 mx-4 p-4 rounded-lg shadow-sm flex items-center'>
            <Text className='text-xl font-medium text-white'>
              Proceed to Payment
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentPage;
