import { Stack } from "expo-router";
import "./global.css";
import { SafeAreaView } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import toastConfig from "@/services/toastConfig";
import { Provider } from "react-redux";
import { store } from "./store";
import { UpdateUsageTime } from "./components/UpdateUsageTime";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          <UpdateUsageTime />
          <Toast config={toastConfig} />
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
