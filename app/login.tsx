import { Link } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, ImageBackground } from "react-native";

export default function LoginScreen() {
  return (
    <ImageBackground 
      source={require('@/assets/images/login.jpg')} 
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View className="flex-1 justify-end">
        <View className="absolute inset-0 bg-black opacity-40" />

        <View className="bg-white rounded-t-3xl p-6 w-full h-max items-center  shadow-lg">
          <Text className="text-4xl font-bold text-slate-800 mb-6">Login</Text>

          <View className="w-4/5 mb-4">
            <Text className="text-lg mb-2 text-slate-800">Username</Text>
            <TextInput
              placeholder="Enter your username"
              className="w-full border border-slate-300 rounded-lg p-3 text-slate-600"
            />
          </View>

          <View className="w-4/5 mb-4">
            <Text className="text-lg mb-2 text-slate-800">Password</Text>
            <TextInput
              placeholder="Enter your password"
              secureTextEntry
              className="w-full border border-slate-300 rounded-lg p-3 text-slate-600"
            />
          </View>

          <TouchableOpacity onPress={() => {}} className="self-end pr-8 mb-6">
            <Text className="text-blue-500">Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity className="w-3/4 bg-[#FFC515] p-4 rounded-lg shadow-md active:bg-yellow-500">
            <Text className="text-white text-center font-medium">Login</Text>
          </TouchableOpacity>

          <Text className="text-slate-500 my-4">Or</Text>

          <TouchableOpacity className="bg-red-600 p-4 rounded-lg w-3/4 shadow-md active:bg-red-700">
            <Text className="text-white text-center font-medium">Login with Google</Text>
          </TouchableOpacity>

          <Link href="/login" className="mt-6">
            <Text className="text-blue-500">Don't have an account? Sign up</Text>
          </Link>
        </View>
      </View>
    </ImageBackground>
  );
}
