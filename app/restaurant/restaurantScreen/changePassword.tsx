import { CustomToast } from "@/app/components/toast";
import { InputField } from "@/app/screen/changePasswordPage";
import { changePassword } from "@/services/api/userApi";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function ChangePassword() {
  const userId = useSelector(
    (state: { user: { userId: string } }) => state.user.userId
  );
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showError, setShowError] = useState<boolean>(false);
  const [contentError, setContentError] = useState<string>("");

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      CustomToast("success", "Success", "Password changed successfully");
      setIsLoading(false);
    },
    onError: () => {
      CustomToast(
        "error",
        "Error",
        "Current password incorrect! Please try again"
      );
      setIsLoading(false);
    },
  });
  const handleChangePassword = () => {
    const data = { userId, currentPassword, newPassword, confirmPassword };
    if (!currentPassword || !newPassword || !confirmPassword) {
      setShowError(true);
      setContentError("All fields are required!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setShowError(true);
      setContentError(
        "New password not match with confirm password! Please try again"
      );
      return;
    }
    setShowError(false);
    changePasswordMutation.mutate(data);
    setIsLoading(true);
  };
  return (
    <View className="flex-1 bg-white">
      {/* header */}
      <View className="flex-row w-full h-14 bg-white items-center px-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl text-center flex-1">
          Change Password
        </Text>
        <View className="w-2" />
      </View>
      {/* Body */}
      <View className="flex-1 w-full px-6 py-8 items-center space-y-5">
        <Image
          source={{
            uri: "https://th.bing.com/th/id/R.02a07991f13f2ba8915f2f3165bb9a3c?rik=stZdjsYm7DbrWQ&pid=ImgRaw&r=0",
          }}
          style={{ width: 160, height: 160 }}
          resizeMode="contain"
        />

        <InputField
          icon="lock-closed-outline"
          placeholder="Enter current password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <InputField
          icon="lock-closed-outline"
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <InputField
          icon="lock-closed-outline"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {showError && <Text className="text-red-500">{contentError}</Text>}

        <TouchableOpacity
          onPress={handleChangePassword}
          activeOpacity={0.8}
          className="w-full bg-yellow-400 rounded-xl py-3 mt-4 "
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center font-semibold text-white text-base">
              Change Password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
