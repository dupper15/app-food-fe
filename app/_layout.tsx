import { Stack } from "expo-router";
import "./global.css";
import { SafeAreaView } from "react-native";
export default function RootLayout() {
  return (
    <SafeAreaView className='flex-1'>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='start' />
        <Stack.Screen name='(restaurant)' />
        <Stack.Screen name='(customer)' />
        <Stack.Screen name='login' />
        <Stack.Screen name='register' />
      </Stack>
    </SafeAreaView>
  );
}
