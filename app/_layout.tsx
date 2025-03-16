import { Stack, useRouter } from "expo-router";
import "./global.css";
import { useEffect } from "react";
export default function RootLayout() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='login' />
      <Stack.Screen name='index' />
    </Stack>
  );
}
