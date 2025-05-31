import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/services/api/userApi";
import { CustomToast } from "../components/toast";
import { useSelector } from "react-redux";

export const InputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
}: {
  icon: any;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}) => (
  <View className='flex-row items-center w-full bg-white border border-gray-300 rounded-xl px-4 py-3 space-x-2'>
    <Ionicons name={icon} size={20} color='#A0AEC0' />
    <TextInput
      placeholder={placeholder}
      secureTextEntry
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor='#A0AEC0'
      className='flex-1 text-base text-gray-800'
    />
  </View>
);

const ChangePasswordPage = () => {
  const userId = useSelector(
    (state: { user: { userId: string } }) => state.user.userId
  );
  const router = useRouter();
  const handleRouteBack = () => {
    router.back();
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      CustomToast("success", "Success", "Password changed successfully");
      router.back();
    },
    onError: (error) => {
      CustomToast("error", "Error", error.message);
    },
  });
  const handleChangePassword = () => {
    const data = { userId, currentPassword, newPassword, confirmPassword };
    changePasswordMutation.mutate(data);
  };
  return (
    <View className='flex-1 bg-slate-100'>
      {/* Header */}
      <View className='w-full py-4 px-6 bg-white shadow-sm flex-row items-center gap-4'>
        <TouchableOpacity onPress={handleRouteBack}>
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
        <Text className='text-2xl font-semibold text-gray-800'>
          Change Password
        </Text>
      </View>

      {/* Body */}
      <View className='flex-1 w-full px-6 py-8 items-center gap-y-5'>
        <Image
          source={{
            uri: "https://th.bing.com/th/id/R.02a07991f13f2ba8915f2f3165bb9a3c?rik=stZdjsYm7DbrWQ&pid=ImgRaw&r=0",
          }}
          style={{ width: 160, height: 160 }}
          resizeMode='contain'
        />

        <InputField
          icon='lock-closed-outline'
          placeholder='Enter current password'
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <InputField
          icon='lock-closed-outline'
          placeholder='Enter new password'
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <InputField
          icon='lock-closed-outline'
          placeholder='Confirm new password'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          onPress={handleChangePassword}
          disabled={changePasswordMutation.isPending}
          activeOpacity={0.8}
          className='w-full bg-yellow-400 rounded-xl py-3 mt-4 shadow-sm'>
          {changePasswordMutation.isPending ? (
            <ActivityIndicator color='#000' />
          ) : (
            <Text className='text-center font-semibold text-black text-base'>
              Change Password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePasswordPage;
