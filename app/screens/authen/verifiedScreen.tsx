import { checkCode, sendVerificationCode } from "@/services/api/userApi";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { CustomToast } from "../components/toast";
import { RootState } from "../store";

const VerifiedScreen = () => {
  const [isSent, setIsSent] = useState<boolean>(false);
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);
  const router = useRouter();
  const userId = useSelector((state: RootState) => state.user.userId);
  const [phoneNumber, setPhoneNumber] = useState("");
  const handleChange = (text: string, index: number) => {
    const newCode: string[] = [...code];
    if (/^\d$/.test(text)) {
      newCode[index] = text;
      setCode(newCode);
      if (index < 3) inputs.current[index + 1]?.focus();
    } else if (text === "") {
      newCode[index] = "";
      setCode(newCode);
    }
  };
  const sendVerifyCodeMutation = useMutation({
    mutationFn: sendVerificationCode,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleSendCode = (): void => {
    setIsSent(true);
    const data = { phone: phoneNumber, id: userId };
    sendVerifyCodeMutation.mutate(data);
  };
  const handleResend = (): void => {
    const data = { phone: phoneNumber, id: userId };
    sendVerifyCodeMutation.mutate(data);
  };
  const checkCodeMutation = useMutation({
    mutationFn: checkCode,
    onSuccess: (data) => {
      CustomToast("success", "Successfull", "Verified code successfully");
      router.push("/authen/login");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleVerify = (): void => {
    const data = { code: code.join(""), id: userId };
    checkCodeMutation.mutate(data);
  };
  const isLoading =
    sendVerifyCodeMutation.isPending || checkCodeMutation.isPending;

  return (
    <KeyboardAvoidingView
      className='flex-1 bg-white px-6 '
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View className='flex-row items-center mb-6 pt-4'>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={28} color='black' />
        </TouchableOpacity>
        <Text className='text-xl font-semibold ml-4'>Verification</Text>
      </View>

      <Image
        source={{
          uri: "https://www.lmcp.fr/wp-content/uploads/visuels-site-LMCP.pdf-3.png",
        }}
        style={{ width: "100%", height: 180 }}
        resizeMode='contain'
      />

      <View className='mt-6 items-center w-full'>
        {isSent ? (
          <>
            <Text className='text-base text-center text-gray-600'>
              Please enter the code sent to
            </Text>
            <Text className='text-lg font-bold text-center mb-6'>
              {phoneNumber}
            </Text>

            <View className='flex-row justify-between w-[80%] mb-6'>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  keyboardType='numeric'
                  maxLength={1}
                  editable={!isLoading}
                  className='w-14 h-14 text-center border-2 border-gray-300 rounded-xl text-xl bg-gray-50'
                />
              ))}
            </View>

            <TouchableOpacity onPress={handleResend} disabled={isLoading}>
              <Text className='text-gray-500 underline mb-6'>Resend code</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text className='text-2xl font-bold text-center text-gray-800 mb-4'>
              Enter your phone number
            </Text>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder='Phone number'
              keyboardType='phone-pad'
              editable={!isLoading}
              className='border border-gray-300 rounded-xl p-4 w-72 bg-gray-50 mb-6'
            />
          </>
        )}

        <TouchableOpacity
          onPress={isSent ? handleVerify : handleSendCode}
          className='bg-yellow-400 rounded-lg px-10 py-3 mt-2 active:opacity-80 flex-row justify-center items-center'
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color='white' />
          ) : (
            <Text className='text-white text-lg font-bold'>
              {isSent ? "Verify" : "Send code"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VerifiedScreen;
