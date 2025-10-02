import { Text, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

const LoginGoogleButton = () => {
  const { signInWithGoogle, loading, error, isReady } = useGoogleAuth();
  return (
    <TouchableOpacity
      onPress={signInWithGoogle}
      disabled={!isReady || loading}
      className='bg-red-600 p-4 rounded-lg w-4/5 shadow-sm active:opacity-80 flex-row justify-center items-center'>
      {loading ? (
        <ActivityIndicator color='white' />
      ) : (
        <Text className='text-white text-center font-medium'>
          Login with Google
        </Text>
      )}
      {error && <Text className='text-red-500 text-sm mt-2'>{error}</Text>}
    </TouchableOpacity>
  );
};
export default LoginGoogleButton;
