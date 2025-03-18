import { Stack } from "expo-router";
import "./global.css";
import { SafeAreaView } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className='flex-1'>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='index' />
          <Stack.Screen name='(restaurant)' />
          <Stack.Screen name='(customer)' />
          <Stack.Screen name='login' />
          <Stack.Screen name='register' />
        </Stack>
        <Toaster
          position='bottom-center'
          toastOptions={{
            style: {
              background: "rgba(0, 0, 0, 0.7)",
              color: "#fff",
              fontSize: "14px",
              borderRadius: "16px",
              padding: "4px 8px",
            },
          }}
        />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
