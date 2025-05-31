import { Link } from "expo-router";
import React, { useState } from "react";
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
import RegisterModal from "../components/registerModal";
import { CustomToast } from "../components/toast";
import LoginGoogleButton from "../components/loginGoogleButton";

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUp = (): void => {
    if (password == confirmPassword) {
      setShowModal(true);
    } else {
      CustomToast("error", "Error", "Password does not match");
    }
  };

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
          <View className='flex-1 justify-end pt-4'>
            <View className='absolute inset-0 bg-black opacity-40' />

            <View className='bg-white rounded-t-3xl p-8 pb-10 w-full items-center shadow-lg'>
              <Text className='text-4xl font-bold text-gray-800 mb-8'>
                Create new account
              </Text>

              <View className='w-4/5 mb-5'>
                <Text className='text-lg mb-2 text-gray-700'>Name</Text>
                <View className='flex-row items-center border border-gray-300 rounded-lg p-4 bg-white'>
                  <Ionicons
                    name='person-outline'
                    size={20}
                    color='#a1a1aa'
                    className='mr-3'
                  />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder='Enter your name'
                    placeholderTextColor='#a1a1aa'
                    className='flex-1 text-gray-900'
                  />
                </View>
              </View>

              <View className='w-4/5 mb-5'>
                <Text className='text-lg mb-2 text-gray-700'>Email</Text>
                <View className='flex-row items-center border border-gray-300 rounded-lg p-4 bg-white'>
                  <Ionicons
                    name='mail-outline'
                    size={20}
                    color='#a1a1aa'
                    className='mr-3'
                  />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder='Enter your email'
                    placeholderTextColor='#a1a1aa'
                    className='flex-1 text-gray-900'
                  />
                </View>
              </View>

              <View className='w-4/5 mb-5'>
                <Text className='text-lg mb-2 text-gray-700'>Phone number</Text>
                <View className='flex-row items-center border border-gray-300 rounded-lg p-4 bg-white'>
                  <Ionicons
                    name='call-outline'
                    size={20}
                    color='#a1a1aa'
                    className='mr-3'
                  />
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder='Enter your phone number'
                    placeholderTextColor='#a1a1aa'
                    className='flex-1 text-gray-900'
                  />
                </View>
              </View>

              <View className='w-4/5 mb-5'>
                <Text className='text-lg mb-2 text-gray-700'>Password</Text>
                <View className='flex-row items-center border border-gray-300 rounded-lg p-4 bg-white'>
                  <Ionicons
                    name='lock-closed-outline'
                    size={20}
                    color='#a1a1aa'
                    className='mr-3'
                  />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder='Enter your password'
                    placeholderTextColor='#a1a1aa'
                    secureTextEntry
                    className='flex-1 text-gray-900'
                  />
                </View>
              </View>

              <View className='w-4/5 mb-5'>
                <Text className='text-lg mb-2 text-gray-700'>
                  Confirm password
                </Text>
                <View className='flex-row items-center border border-gray-300 rounded-lg p-4 bg-white'>
                  <Ionicons
                    name='lock-closed-outline'
                    size={20}
                    color='#a1a1aa'
                    className='mr-3'
                  />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder='Confirm your password'
                    placeholderTextColor='#a1a1aa'
                    secureTextEntry
                    className='flex-1 text-gray-900'
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSignUp}
                className='w-4/5 p-4 rounded-lg bg-customYellow shadow-sm active:opacity-80'>
                <Text className='text-white text-center font-medium'>
                  Sign up
                </Text>
              </TouchableOpacity>

              <Text className='text-gray-500 my-5'>Or</Text>
              <LoginGoogleButton />
              <Link href='/authen/login' className='mt-8'>
                <Text className='text-blue-500'>
                  Already have an account? Log in
                </Text>
              </Link>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
      {showModal && (
        <RegisterModal
          setShowModal={setShowModal}
          name={name}
          phone={phone}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
