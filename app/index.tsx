import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { ImageBackground, TouchableHighlight, Text, View } from "react-native";

const Start: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = (): void => {
    router.push("/screen/cartPage");
  };
  return (
    <ImageBackground
      source={require("@/assets/images/welcome.gif")}
      className='flex-1 object-cover'>
      <View className='flex-1 justify-end p-10 items-center'>
        <TouchableHighlight
          className='bg-customYellow rounded-lg p-4 text-gray-900 focus:border-[#FFC515] focus:ring-2 focus:ring-[#FFC515]'
          onPress={handleGetStarted}>
          <Text className='font-semibold text-white text-2xl '>
            Get started
          </Text>
        </TouchableHighlight>
      </View>
    </ImageBackground>
  );
};

export default Start;
