import { Stack, useRouter } from "expo-router";
import "./global.css";
import { SafeAreaView } from "react-native";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export default function RootLayout() {
  const queryClient = new QueryClient();
  const router = useRouter();
  useEffect(() => {
    router.push("/start");
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className='flex-1'>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='start' />
          <Stack.Screen name='(restaurant)' />
          <Stack.Screen name='(customer)' />
          <Stack.Screen name='login' />
          <Stack.Screen name='register' />
        </Stack>
      </SafeAreaView>
    </QueryClientProvider>
  );
}
