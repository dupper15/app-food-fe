import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const SuccessPage = () => {
  const router = useRouter();
  const handleGoHome = () => {
    router.push("/screens/customer/(tabs)/home");
  };
  return (
    <View className='flex-1'>
      <ImageBackground
        source={require("../../../assets/images/Order Succesfully.png")}
        className='flex-1 justify-end items-center px-6 pb-6'
        resizeMode='cover'>
        <View className='flex flex-row justify-center items-center gap-4 '>
          <TouchableOpacity
            className='bg-customYellow py-3 px-6 rounded-full shadow-md flex-row items-center gap-2'
            onPress={() => handleGoHome()}>
            <Ionicons name='home-outline' size={20} color='white' />
            <Text className='text-white text-lg font-semibold'>Go Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className='bg-white py-3 px-6 rounded-full shadow-md border border-customYellow flex-row items-center gap-2'
            onPress={() => console.log("Track your order pressed")}>
            <Ionicons name='location-outline' size={20} color='#FACC15' />
            <Text className='text-customYellow text-lg font-semibold'>
              Track Order
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SuccessPage;
