import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const DisablePage = () => {
  const router = useRouter();

  return (
    <View className='flex-1 bg-slate-100'>
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
            uri: "https://cdni.iconscout.com/illustration/premium/thumb/locked-account-9561131-7706453.png",
          }}
          style={{ width: 220, height: 220 }}
          resizeMode='contain'
        />
        <Text className='text-2xl font-bold text-center mt-6 text-gray-800'>
          This page is locked
        </Text>
        <Text className='text-center mt-2 text-gray-600'>
          Your account is not yet activated or has been disabled. Please contact
          support for more information.
        </Text>
        <Text className='text-center mt-4 text-blue-600 font-semibold'>
          Hotline: +84 123 456 789
        </Text>
      </View>
    </View>
  );
};

export default DisablePage;
