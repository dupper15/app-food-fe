import { Stack, useRouter } from "expo-router";
import "./global.css";
import { SafeAreaView } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import toastConfig from "@/services/toastConfig";
import { Provider } from "react-redux";
import { store } from "./store";
export default function RootLayout() {
  const queryClient = new QueryClient();
  const showToast = () => {
    Toast.show({
      type: "success", // "success" | "error" | "info"
      text1: "Hello!",
      text2: "This is a toast message 👋",
    });
  };

  const router = useRouter();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView className='flex-1'>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='(restaurant)' />
            <Stack.Screen name='(customer)' />
            <Stack.Screen name='(auth)' />
          </Stack>
        </SafeAreaView>
        <Toast config={toastConfig} />
      </QueryClientProvider>
    </Provider>
  );
}
