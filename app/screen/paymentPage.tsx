import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { transPrice } from "@/utils/transPrice";
import {
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
} from "react-native";

const PaymentPage = () => {
  const [items, setItems] = useState([]);
  const { selectedDish } = useLocalSearchParams();

  useEffect(() => {
    if (selectedDish) {
      const parsedDish = JSON.parse(selectedDish);
      setItems(parsedDish);
    }
  }, [selectedDish]);
  const router = useRouter();
  return (
    <View className='flex-1 bg-gray-100'>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View className='flex-row items-center gap-4 bg-white shadow-md p-4 border-b border-gray-200'>
          <TouchableHighlight onPress={() => router.back()}>
            <Ionicons name='arrow-back' size={24} color='black' />
          </TouchableHighlight>{" "}
          <Text className='text-2xl font-semibold text-gray-900'>Payment</Text>
        </View>

        <View className='p-4'>
          <View className='p-4 bg-white rounded-lg shadow-sm'>
            <Text className='text-2xl font-semibold text-gray-900 mb-2'>
              Order Summary
            </Text>
            {items.map((item, index) => (
              <View
                key={index}
                className='flex-row gap-4 bg-gray-50 p-3 rounded-lg mb-3 shadow-sm'>
                <Image
                  source={{ uri: item.dish_id.image }}
                  className='w-24 h-24 rounded-lg'
                  resizeMode='cover'
                />
                <View className='flex-1'>
                  <Text className='text-lg font-bold text-gray-800'>
                    {item.dish_id.name}
                  </Text>
                  <Text className='text-lg text-gray-700 font-medium'>
                    {transPrice(item.quantity * item.dish_id.price)}
                  </Text>
                  <View className='flex-row gap-2 flex-wrap mt-1'>
                    {item.topping.map((topping, index) => (
                      <Text key={index} className='text-sm text-gray-500'>
                        + {topping.name} {transPrice(topping.price)}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            ))}
            <View className='mt-3 flex flex-row justify-between border-t pt-3 border-gray-200'>
              <Text className='text-xl font-medium text-gray-900'>
                Estimated Time
              </Text>
              <Text className='text-lg text-gray-600'>40 mins</Text>
            </View>
          </View>

          <View className='mt-4 bg-white p-4 rounded-lg shadow-sm'>
            <Text className='text-xl font-semibold text-gray-900'>
              Notes (Optional)
            </Text>
            <TextInput
              className='h-20 p-4 bg-gray-100 rounded-lg mt-2 text-lg text-gray-700'
              placeholder='Add a note...'
              multiline
            />
          </View>

          <View className='mt-4 flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm'>
            <Text className='text-xl font-medium text-gray-900'>Voucher</Text>
            <Text className='text-xl text-blue-500 underline'>Select</Text>
          </View>

          <View className='mt-4 bg-white p-4 rounded-lg shadow-sm'>
            <Text className='text-2xl font-semibold text-gray-900'>
              Payment Summary
            </Text>
            <Text className='text-lg text-gray-700 mt-2'>
              Total Food Cost: {transPrice(25000)}
            </Text>
            <Text className='text-lg text-gray-700'>
              Voucher Discount: {transPrice(5000)}
            </Text>
            <Text className='text-lg font-bold text-gray-900 mt-2'>
              Grand Total: {transPrice(20000)}
            </Text>
          </View>

          <TouchableOpacity className='mt-6 bg-customYellow p-4 rounded-lg shadow-sm flex items-center'>
            <Text className='text-xl font-medium text-white'>Payment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentPage;
