import { Link, useRouter } from "expo-router";
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
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { setUser } from "@/features/counter/userSlice";
import { getUserIdFromToken } from "@/utils/auth";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/services/api/userApi";
import { CustomToast } from "../components/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchRestaurantByOwner } from "@/services/api/restaurantApi";
import { setRestaurant } from "@/features/counter/restaurantSlice";
import LoginGoogleButton from "../components/loginGoogleButton";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  total_time_spent: number;
  isVerified: boolean;
  userType: "restaurantOwner" | "customer" | string;
  status: "Pending" | "Incomplete" | "Disable" | "Enable";
}
const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data: LoginResponse) => {
      const {
        accessToken,
        refreshToken,
        total_time_spent,
        isVerified,
        status,
      } = data;
      const userId: string = getUserIdFromToken(accessToken)!;
      await AsyncStorage.setItem("usageTime", total_time_spent.toString());
      await AsyncStorage.setItem("startTime", Date.now().toString());
      dispatch(setUser({ userId, refreshToken }));
      AsyncStorage.setItem("userId", String(userId));
      if (isVerified) {
        if (data.userType === "restaurantOwner") {
          await AsyncStorage.setItem("owner_id", String(userId));
          try {
            const result = await fetchRestaurantByOwner(userId);
            if (result?.data?._id) {
              await AsyncStorage.setItem(
                "restaurant_id",
                String(result?.data?._id)
              );
              dispatch(
                setRestaurant({
                  restaurantId: result.data._id,
                  name: result.data.name,
                })
              );
            }
            if (status === "Pending") {
              router.push("/screen/pendingPage");
            } else if (status === "Incomplete") {
              router.push("/authen/createRestaurant");
            } else if (status === "Disable") {
              router.push("/screen/disablePage");
            } else {
              router.push("/restaurant/orderScreen/order");
              router.push("/restaurant/orderScreen/order");
            }
          } catch (error) {
            CustomToast("error", "Error", "Failed to fetch restaurant details");
          }
        }
        if (data.userType === "customer") {
          AsyncStorage.setItem("customer_id", String(userId));
          if (status === "Disable") {
            router.push("/screen/disablePage");
          } else {
            router.push("/customer/(tabs)/home");
          }
          if (status === "Disable") {
            router.push("/screen/disablePage");
          } else {
            router.push("/customer/(tabs)/home");
          }
        }
      } else {
        router.push("/authen/verifiedScreen");
      }
    },
    onError: (data: any) => {
      CustomToast("error", "Error", "Login failed");
    },
  });

  const handleLogin = (): void => {
    mutation.mutate({ email, password });
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
          <View className='flex-1 justify-end'>
            <View className='absolute inset-0 bg-black opacity-40' />
            <View className='bg-white rounded-t-3xl p-8 pb-10 w-full items-center shadow-lg'>
              <Text className='text-4xl font-bold text-gray-800 mb-8'>
                Welcome Back!
              </Text>

              <View className='w-4/5 mb-5'>
                <Text className='text-lg mb-2 text-gray-700'>Email</Text>
                <View className='flex-row items-center border border-gray-300 rounded-lg p-4 bg-white'>
                  <Ionicons
                    name='person-outline'
                    size={20}
                    color='#a1a1aa'
                    className='mr-3'
                  />
                  <TextInput
                    onChangeText={setEmail}
                    placeholder='Enter your email'
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
                    onChangeText={setPassword}
                    placeholder='Enter your password'
                    placeholderTextColor='#a1a1aa'
                    secureTextEntry
                    className='flex-1 text-gray-900'
                  />
                </View>
              </View>

              <View className='w-4/5'>
                <TouchableOpacity
                  onPress={() => {
                    router.push("/authen/forgetPassword");
                  }}
                  className='self-end mb-6'>
                  <Text className='text-blue-500'>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={mutation.isPending}
                className={`w-4/5 p-4 rounded-lg bg-customYellow shadow-sm flex-row justify-center items-center gap-2 ${
                  mutation.isPending ? "opacity-50" : "active:opacity-80"
                }`}>
                {mutation.isPending && (
                  <ActivityIndicator size='small' color='#fff' />
                )}
                <Text className='text-white text-center font-medium'>
                  {mutation.isPending ? "Logging in..." : "Login"}
                </Text>
              </TouchableOpacity>

              <Text className='text-gray-500 my-5'>Or</Text>
              <LoginGoogleButton />
              <Link href='/authen/register' className='mt-8'>
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

export default Login;
