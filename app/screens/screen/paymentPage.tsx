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
  ActivityIndicator,
} from "react-native";
import SelectVoucherModal from "../components/selectVoucherModal";
import Icon from "react-native-vector-icons/FontAwesome";
import { useMutation } from "@tanstack/react-query";
import { completePayment } from "@/services/api/cartApi";
import { useSelector } from "react-redux";
import Slider from "@react-native-community/slider";
import { getPoint } from "@/services/api/userApi";

const PaymentPage = () => {
  const [items, setItems] = useState([]);
  const { selectedDish, cart_id } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [voucher, setVoucher] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [point, setPoint] = useState(0);
  const [note, setNote] = useState("");
  const [maxPoint, setMaxPoint] = useState(0);
  const userId = useSelector((state: any) => state.user.userId);

  useEffect(() => {
    setTotalPrice(
      items.reduce((total, item) => {
        const itemPrice = item.dish_id.price * item.quantity;
        const toppingPrice = item.topping.reduce(
          (sum, topping) => sum + topping.price,
          0
        );
        return total + itemPrice + toppingPrice;
      }, 0)
    );
  }, [items]);
  useEffect(() => {
    if (selectedDish) {
      const parsedDish = JSON.parse(selectedDish);
      setItems(parsedDish);
    }
  }, [selectedDish]);
  const router = useRouter();
  const handleCaculateVoucher = (voucher) => {
    if (!voucher) return 0;
    if (voucher.value < 1) {
      const tempDiscount = totalPrice * voucher.value;

      if (typeof voucher.max === "undefined") {
        return tempDiscount;
      }

      return Math.min(tempDiscount, voucher.max);
    }
    return voucher.value;
  };
  const getTime = () => {
    let max = 0;
    if (items && items.length > 0) {
      max = items.reduce((max, item) => {
        return Math.max(max, item.dish_id.time);
      }, 0);

      return `${max} mins`;
    }
    return "0 mins";
  };
  const [isLoading, setIsLoading] = useState(false);
  const paymentMutation = useMutation({
    mutationFn: completePayment,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      console.log("Payment success:", data);
      setIsLoading(false);
      router.push("/screen/successPage");
    },
    onError: (error) => {
      console.log("Payment error:", error);
      setIsLoading(false);
    },
  });

  const getIds = (items) => {
    let ids = [];
    items.forEach((item) => {
      ids.push(item._id);
    });
    return ids;
  };
  const handleSubmit = () => {
    const data = {
      array_item: getIds(items),
      voucher_id: voucher ? voucher._id : null,
      total_price: totalPrice - handleCaculateVoucher(voucher),
      customer_id: userId,
      restaurant_id: items[0].dish_id.restaurant_id,
      used_point: point,
      note: note,
    };
    paymentMutation.mutate(data);
  };
  const handleNoteChange = (text) => {
    setNote(text);
  };
  const maxPointMutation = useMutation({
    mutationFn: getPoint,
    onSuccess: (data) => {
      setMaxPoint(data);
    },
    onError: (error) => {
      console.error("Error fetching max point:", error);
    },
  });
  useEffect(() => {
    maxPointMutation.mutate(userId);
  }, [userId]);
  return (
    <View className='flex-1 bg-gray-100'>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View className='flex-row items-center gap-4 bg-white p-4 border-b border-gray-100'>
          <TouchableHighlight onPress={() => router.back()}>
            <Ionicons name='arrow-back' size={24} color='black' />
          </TouchableHighlight>{" "}
          <Text className='text-2xl font-semibold text-gray-900'>Payment</Text>
        </View>

        <View className='px-4 py-2'>
          <View className='p-4 bg-white rounded-lg'>
            <Text className='text-xl font-semibold text-gray-900 mb-2'>
              Order Summary
            </Text>
            {items.map((item, index) => (
              <View
                key={index}
                className='flex-row gap-4 bg-gray-100 p-3 rounded-lg mb-2 '>
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
              <Text className='text-lg font-medium text-gray-900'>
                Estimated prep time:
              </Text>
              <Text className='text-lg text-gray-600'>{getTime()}</Text>
            </View>
          </View>

          <View className='mt-2 bg-white p-4 rounded-lg'>
            <Text className='text-xl font-semibold text-gray-900'>
              Notes (Optional)
            </Text>
            <TextInput
              value={note}
              onChangeText={handleNoteChange}
              placeholderTextColor={"#A0AEC0"}
              className='h-28 p-2 bg-gray-100 rounded-lg mt-2 text-base text-gray-700'
              placeholder='Add a note...'
              multiline
            />
          </View>

          <View className='mt-2 flex-row items-center bg-white p-4 rounded-lg'>
            <Text className='text-xl font-semibold text-gray-900 flex-1'>
              Voucher
            </Text>

            {voucher ? (
              <View className='flex-row items-center space-x-3'>
                <Text className='text-lg text-green-600 font-semibold'>
                  {voucher.name}
                </Text>

                {/* Nút xóa voucher với icon thùng rác */}
                <TouchableOpacity
                  onPress={() => setVoucher(null)}
                  className='bg-white px-3 py-1 rounded-lg '>
                  <Icon name='trash' size={20} color='red' />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setShowModal(true)}>
                <Text className='text-xl text-customYellow underline'>
                  Select
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {maxPoint > 0 && (
            <View className='mt-2 bg-white px-4 py-1 rounded-lg flex items-start'>
              <View className='flex-1 flex-row justify-between items-center w-full'>
                <Text className='text-xl font-semibold text-gray-900 mt-4'>
                  Use Points (Optional)
                </Text>
                <Text className='text-lg font-medium text-gray-600 mt-4'>
                  {point} Points
                </Text>
              </View>
              <Slider
                style={{ width: "100%", height: 40 }} // Đặt chiều rộng và chiều cao cho thanh trượt
                minimumValue={0} // Giá trị nhỏ nhất
                maximumValue={maxPoint} // Giá trị lớn nhất
                step={1} // Bước nhảy (1 điểm tại mỗi lần chọn)
                value={point} // Giá trị hiện tại của thanh trượt
                onValueChange={setPoint} // Hàm cập nhật giá trị khi người dùng thay đổi
                minimumTrackTintColor='#FFC515' // Màu cho phần đã chọn của thanh trượt
                maximumTrackTintColor='#d3d3d3' // Màu cho phần chưa chọn của thanh trượt
                thumbTintColor='#f97316' // Màu của chấm di chuyển trên thanh trượt>
              />
              <View className='flex-1 flex-row justify-between items-center w-full'>
                <Text className='text-lg font-medium text-gray-700 '>0</Text>
                <Text className='text-lg font-medium text-gray-700'>
                  {maxPoint}
                </Text>
              </View>
            </View>
          )}
          <View className='mt-2 bg-white p-4 rounded-lg '>
            <Text className='text-xl font-semibold text-gray-900'>
              Payment Summary
            </Text>
            <Text className='text-lg text-gray-700 mt-2'>
              Total Food Cost: {transPrice(totalPrice)}
            </Text>
            <Text className='text-lg text-gray-700'>
              Voucher Discount: {transPrice(handleCaculateVoucher(voucher))}
            </Text>
            <Text className='text-lg text-gray-700'>
              Points Used: {transPrice(point * 1000)} ({point} points)
            </Text>
            <Text className='text-lg font-bold text-gray-900 mt-2'>
              Grand Total:{" "}
              {transPrice(
                totalPrice - handleCaculateVoucher(voucher) - point * 1000
              )}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className='mt-6 bg-customYellow p-4 rounded-lg shadow-sm flex items-center'>
            {isLoading ? (
              <ActivityIndicator color='white' />
            ) : (
              <Text className='text-xl font-medium text-white'>Payment</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      {showModal && items && (
        <SelectVoucherModal
          restaurantId={items[0].dish_id.restaurant_id}
          totalPrice={totalPrice}
          showModal={showModal}
          setShowModal={setShowModal}
          setVoucher={setVoucher}
        />
      )}
    </View>
  );
};

export default PaymentPage;
