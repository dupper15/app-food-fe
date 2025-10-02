import Toast from "react-native-toast-message";

export const CustomToast = (type, text1, text2) => {
  Toast.show({
    type: type, // "success" | "error" | "info"
    text1: text1,
    text2: text2,
  });
};
