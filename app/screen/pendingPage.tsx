import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PendingPage = () => {
  const router = useRouter();

  return (
    <View className='flex-1 bg-white'>
      <View className='w-full py-4 px-6 bg-white flex-row items-center justify-between'>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
        <Text className='text-lg font-semibold'>Notice</Text>
        <View style={{ width: 24 }} />
      </View>

      <View className='flex-1 items-center justify-center px-6'>
        <Image
          source={{
            uri: "https://thumbs.dreamstime.com/b/pending-payment-abstract-concept-vector-illustration-pending-payment-abstract-concept-vector-illustration-money-hold-payment-242037789.jpg",
          }}
          style={{ width: 220, height: 220 }}
          resizeMode='contain'
        />
        <Text className='text-2xl font-bold text-center mt-6 text-gray-800'>
          Your account is under review
        </Text>
        <Text className='text-center mt-2 text-gray-600'>
          Thank you for registering. Your restaurant account is currently
          pending approval. We will notify you once it is activated.
        </Text>
        <Text className='text-center mt-4 text-blue-600 font-semibold'>
          Hotline: +84 123 456 789
        </Text>
      </View>
    </View>
  );
};

export default PendingPage;
