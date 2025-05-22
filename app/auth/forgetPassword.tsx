import {
  checkCodeNoDeleteCode,
  resetPassword,
  sendCodeByPhone,
} from "@/services/api/userApi";
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
  ScrollView,
} from "react-native";
import { CustomToast } from "../components/toast";

const ForgetPasswordScreen = () => {
  const [isSent, setIsSent] = useState(false);
  const [code, setCode] = useState(["", "", "", ""]);
  const inputs = useRef([]);
  const router = useRouter();
  const [id, setId] = useState("");
  const [isSetPassword, setIsSetPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const handleChange = (text, index) => {
    const newCode = [...code];
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
    mutationFn: sendCodeByPhone,
    onSuccess: (data) => {
      setId(data._id);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleResend = () => {
    const data = { phone: phoneNumber };
    sendVerifyCodeMutation.mutate(data);
  };
  const handleSendCode = () => {
    const data = { phone: phoneNumber };
    sendVerifyCodeMutation.mutate(data);
    setIsSent(true);
  };
  const checkCodeMutation = useMutation({
    mutationFn: checkCodeNoDeleteCode,
    onSuccess: (data) => {
      CustomToast("success", "Successfull", "Verified code successfully");
      setIsSetPassword(true);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleVerify = () => {
    const data = { code: code.join(""), id: id };
    checkCodeMutation.mutate(data);
  };
  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      CustomToast("success", "Successfull", "Password changed successfully");
      router.push("/auth/login");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleChangePassword = () => {
    const data = {
      id,
      code: code.join(""),
      newPassword: password,
      confirmPassword,
    };
    resetPasswordMutation.mutate(data);
  };

  return (
    <KeyboardAvoidingView
      className='flex-1 bg-white px-6'
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className='flex-row items-center mt-6'>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name='arrow-back' size={28} color='black' />
          </TouchableOpacity>
          <Text className='text-xl font-semibold ml-4'>Forgot Password</Text>
        </View>

        <Image
          source={{
            uri: "https://www.lmcp.fr/wp-content/uploads/visuels-site-LMCP.pdf-3.png",
          }}
          style={{ width: "100%", height: 180 }}
          resizeMode='contain'
        />

        <View className='mt-8 items-center w-full'>
          {!isSetPassword ? (
            isSent ? (
              <>
                <Text className='text-base text-gray-600 text-center'>
                  Please enter the code sent to
                </Text>
                <Text className='text-lg font-bold text-center text-yellow-600 mb-6'>
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
                      className='w-14 h-14 text-center border border-gray-300 rounded-xl text-xl bg-gray-100'
                    />
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() => {
                    handleResend();
                  }}>
                  <Text className='text-gray-500 underline mb-6'>
                    Resend code
                  </Text>
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
                  className='border border-gray-300 rounded-xl p-4 w-72 bg-gray-50 mb-6'
                />
              </>
            )
          ) : (
            <>
              <Text className='text-lg font-semibold mb-2 self-start'>
                New Password
              </Text>
              <TextInput
                placeholder='Enter new password'
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className='border border-gray-300 rounded-xl p-4 w-full bg-gray-50 mb-4'
              />

              <Text className='text-lg font-semibold mb-2 self-start'>
                Confirm Password
              </Text>
              <TextInput
                placeholder='Confirm new password'
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className='border border-gray-300 rounded-lg p-4 w-full bg-gray-50 mb-6'
              />
            </>
          )}

          <TouchableOpacity
            onPress={
              isSetPassword
                ? handleChangePassword
                : isSent
                ? handleVerify
                : handleSendCode
            }
            className='bg-yellow-400 rounded-lg px-10 py-3 shadow-sm active:opacity-80'>
            <Text className='text-white text-lg font-bold'>
              {isSetPassword
                ? "Change Password"
                : isSent
                ? "Verify"
                : "Send Code"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgetPasswordScreen;
