import { useEffect, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/services/config/firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError(null);
        try {
          const { id_token } = response.params as any;
          const credential = GoogleAuthProvider.credential(id_token);
          const userCredential = await signInWithCredential(auth, credential);
          console.log("Firebase user credential:", userCredential);
        } catch (error) {
          console.error("Firebase sign-in error:", error);
          setError(error instanceof Error ? error.message : "Sign-in failed");
        } finally {
          setLoading(false);
        }
      }
    };
    signIn();
  }, [response]);

  const signInWithGoogle = async () => {
    if (!request || loading) return;

    setLoading(true);
    setError(null);
    try {
      await promptAsync();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Authentication failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithGoogle,
    loading,
    error,
    isReady: !!request,
  };
};
