import React from "react";
import { View, Text } from "react-native";
import { BaseToast, ErrorToast } from "react-native-toast-message";

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red" }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
      }}
    />
  ),
  customToast: (props) => {
    const { text1, text2 } = props; // ✅ Đúng: Lấy giá trị từ props
    return (
      <View style={{ backgroundColor: "blue", padding: 10, borderRadius: 8 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>{text1}</Text>
        <Text style={{ color: "white" }}>{text2}</Text>
      </View>
    );
  },
};

export default toastConfig;
