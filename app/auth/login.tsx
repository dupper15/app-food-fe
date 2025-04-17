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

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data: any) => {
      const { accessToken, refreshToken } = data;
      const userId = getUserIdFromToken(accessToken);

      dispatch(setUser({ userId, refreshToken }));
      CustomToast("success", "Success", "Login success");
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
          router.push("/restaurant/orderScreen/order");
        } catch (error) {
          console.error("Error fetching restaurant details:", error);
          CustomToast("error", "Error", "Failed to fetch restaurant details");
        }
      }
      if (data.userType === "customer") {
        AsyncStorage.setItem("customer_id", String(userId));
        router.push("/customer/(tabs)/home");
      }
    },
    onError: (data: any) => {
      console.log(data);
      CustomToast("error", "Error", "Login failed");
    },
  });

  const handleLogin = () => {
    mutation.mutate({ email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ImageBackground
          source={require("@/assets/images/login.jpg")}
          className="flex-1 object-cover"
        >
          <View className="flex-1 justify-end">
            <View className="absolute inset-0 bg-black opacity-40" />
            <View className="bg-white rounded-t-3xl p-8 pb-10 w-full items-center shadow-lg">
              <Text className="text-4xl font-bold text-gray-800 mb-8">
                Welcome Back!
              </Text>

              <View className="w-4/5 mb-5">
                <Text className="text-lg mb-2 text-gray-700">Email</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg p-4 bg-white">
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#a1a1aa"
                    className="mr-3"
                  />
                  <TextInput
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#a1a1aa"
                    className="flex-1 text-gray-900"
                  />
                </View>
              </View>

              <View className="w-4/5 mb-5">
                <Text className="text-lg mb-2 text-gray-700">Password</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg p-4 bg-white">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#a1a1aa"
                    className="mr-3"
                  />
                  <TextInput
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#a1a1aa"
                    secureTextEntry
                    className="flex-1 text-gray-900"
                  />
                </View>
              </View>

              <View className="w-4/5">
                <TouchableOpacity onPress={() => {}} className="self-end mb-6">
                  <Text className="text-blue-500">Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                className="w-4/5 p-4 rounded-lg bg-customYellow shadow-sm active:opacity-80"
              >
                <Text className="text-white text-center font-medium">
                  Login
                </Text>
              </TouchableOpacity>

              <Text className="text-gray-500 my-5">Or</Text>

              <TouchableOpacity className="bg-red-600 p-4 rounded-lg w-4/5 shadow-sm active:opacity-80">
                <Text className="text-white text-center font-medium">
                  Login with Google
                </Text>
              </TouchableOpacity>

              <Link href="/auth/register" className="mt-8">
                <Text className="text-blue-500">
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
