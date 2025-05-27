import { useEffect, useState } from "react";
import { Text, TouchableOpacity, ActivityIndicator, View } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/services/firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

const LoginGoogleButton = () => {
  const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "1087945813368-hqjfnktb33a0l8f9gqkn1ulupo2fmrqo.apps.googleusercontent.com",
    webClientId:
      "1087945813368-bak2b20bmgc8iig6ek9annegkq1598ot.apps.googleusercontent.com",
    redirectUri: "https://app-food.firebaseapp.com/__/auth/handler",
  });

  useEffect(() => {
    const signIn = async () => {
      if (response?.type === "success") {
        setLoading(true);
        try {
          const { id_token } = response.params as any;
          const credential = GoogleAuthProvider.credential(id_token);
          const userCredential = await signInWithCredential(auth, credential);
          console.log("Firebase user credential:", userCredential);
        } catch (error) {
          console.error("Firebase sign-in error:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    signIn();
  }, [response]);

  return (
    <TouchableOpacity
      onPress={() => {
        setLoading(true);
        promptAsync().finally(() => {
          setLoading(false);
        });
      }}
      disabled={!request || loading}
      className='bg-red-600 p-4 rounded-lg w-4/5 shadow-sm active:opacity-80 flex-row justify-center items-center'>
      {loading ? (
        <ActivityIndicator color='white' />
      ) : (
        <Text className='text-white text-center font-medium'>
          Login with Google
        </Text>
      )}
    </TouchableOpacity>
  );
};
export default LoginGoogleButton;
