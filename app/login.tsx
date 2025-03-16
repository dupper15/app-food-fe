import { Link } from "expo-router";
import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const LoginScreen: React.FC = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps='handled'>
        <ImageBackground
          source={require("@/assets/images/login.jpg")}
          style={{ flex: 1 }}
          resizeMode='cover'>
          <View className='flex-1 justify-end'>
            <View className='absolute inset-0 bg-black opacity-40' />

            <View className='bg-white rounded-t-3xl p-8 pb-10 w-full items-center shadow-lg'>
              <Text className='text-4xl font-bold text-gray-800 mb-8'>
                Welcome Back!
              </Text>

              <View className='w-4/5 mb-5'>
                <Text className='text-lg mb-2 text-gray-700'>Username</Text>
                <TextInput
                  placeholder='Enter your username'
                  placeholderTextColor='#a1a1aa'
                  className='w-full border border-gray-300 rounded-lg p-4 text-gray-900 focus:border-[#FFC515] focus:ring-2 focus:ring-[#FFC515]'
                />
              </View>

              <View className='w-4/5 mb-6'>
                <Text className='text-lg mb-2 text-gray-700'>Password</Text>
                <TextInput
                  placeholder='Enter your password'
                  placeholderTextColor='#a1a1aa'
                  secureTextEntry
                  className='w-full border border-gray-300 rounded-lg p-4 text-gray-900 focus:border-[#FFC515] focus:ring-2 focus:ring-[#FFC515]'
                />
              </View>

              <TouchableOpacity
                onPress={() => {}}
                className='self-end pr-8 mb-6'>
                <Text className='text-blue-500'>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity className='w-4/5 p-4 rounded-lg bg-[#FFC515] shadow-sm active:opacity-80'>
                <Text className='text-white text-center font-medium'>
                  Login
                </Text>
              </TouchableOpacity>

              <Text className='text-gray-500 my-5'>Or</Text>

              <TouchableOpacity className='bg-red-500 p-4 rounded-lg w-4/5 shadow-sm active:opacity-80'>
                <Text className='text-white text-center font-medium'>
                  Login with Google
                </Text>
              </TouchableOpacity>

              <Link href='/login' className='mt-8'>
                <Text className='text-blue-500'>
                  Don't have an account? Sign up
                </Text>
              </Link>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
