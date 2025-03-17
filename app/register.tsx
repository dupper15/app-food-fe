import { Link, useRouter } from "expo-router";
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
import { Ionicons } from "@expo/vector-icons";

const RegisterScreen: React.FC = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/customer/home");
  };

  const InputField = ({ label, placeholder, icon, secure = false }) => (
    <View className='w-4/5 mb-5'>
      <Text className='text-lg mb-2 text-gray-700'>{label}</Text>
      <View className='flex-row items-center border border-gray-300 rounded-lg p-4 bg-white'>
        <Ionicons name={icon} size={20} color='#a1a1aa' className='mr-3' />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor='#a1a1aa'
          secureTextEntry={secure}
          className='flex-1 text-gray-900'
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className='flex-1'>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps='handled'>
        <ImageBackground
          source={require("@/assets/images/login.jpg")}
          className='flex-1 object-cover'>
          <View className='flex-1 justify-end'>
            <View className='absolute inset-0 bg-black opacity-40' />

            <View className='bg-white rounded-t-3xl p-8 pb-10 w-full items-center shadow-lg'>
              <Text className='text-4xl font-bold text-gray-800 mb-8'>
                Create new account
              </Text>

              <InputField
                label='Name'
                placeholder='Enter your name'
                icon='person-outline'
              />
              <InputField
                label='Email'
                placeholder='Enter your email'
                icon='mail-outline'
              />
              <InputField
                label='Phone number'
                placeholder='Enter your phone number'
                icon='call-outline'
              />
              <InputField
                label='Password'
                placeholder='Enter your password'
                icon='lock-closed-outline'
                secure
              />
              <InputField
                label='Confirm password'
                placeholder='Confirm your password'
                icon='lock-closed-outline'
                secure
              />

              <View className='flex-row justify-end items-center w-4/5'>
                <TouchableOpacity onPress={() => {}} className='self-end mb-6'>
                  <Text className='text-blue-500'>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleNavigate}
                className='w-4/5 p-4 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-sm active:opacity-80'>
                <Text className='text-white text-center font-medium'>
                  Sign up
                </Text>
              </TouchableOpacity>

              <Text className='text-gray-500 my-5'>Or</Text>

              <TouchableOpacity className='bg-red-600 p-4 rounded-lg w-4/5 shadow-sm active:opacity-80'>
                <Text className='text-white text-center font-medium'>
                  Login with Google
                </Text>
              </TouchableOpacity>

              <Link href='/login' className='mt-8'>
                <Text className='text-blue-500'>
                  Already have an account? Log in
                </Text>
              </Link>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
