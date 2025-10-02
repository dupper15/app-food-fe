import { useMutation } from "@tanstack/react-query";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { registerCustomer, registerRestaurantOwner } from "@/apis/userApi";
import { router } from "expo-router";
import { useState } from "react";
import { CustomToast } from "../ui/toast";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterModal: React.FC<{
  setShowModal: (value: boolean) => void;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}> = ({ setShowModal, name, email, phone, password, confirmPassword }) => {
  const [loading, setLoading] = useState(false);
  const buyerMutation = useMutation({
    mutationFn: registerCustomer,
    onSuccess: (data) => {
      AsyncStorage.setItem("userId", data._id);
      setLoading(false);
      CustomToast("success", "Successfull", "Register successfully🎉");
      setShowModal(false);
      router.push("/authen/login");
    },
    onError: () => {
      CustomToast("error", "Error", "Register failed 😢");
      setLoading(false);
      setShowModal(false);
    },
  });

  const sellerMutation = useMutation({
    mutationFn: registerRestaurantOwner,
    onSuccess: (data) => {
      AsyncStorage.setItem("userId", data._id);
      CustomToast("success", "Successfull", "Register successfully");
      setLoading(false);
      setShowModal(false);
      router.push("/authen/createRestaurant");
    },
    onError: () => {
      CustomToast("error", "Error", "Register failed 😢");
      setLoading(false);
    },
  });

  const handelBuyer = () => {
    setLoading(true);
    buyerMutation.mutate({ name, email, phone, password, confirmPassword });
  };

  const handelSeller = () => {
    setLoading(true);
    sellerMutation.mutate({ name, email, phone, password, confirmPassword });
  };

  return (
    <Modal transparent animationType='fade' visible={true}>
      <View className='flex-1 justify-center items-center bg-black bg-opacity-40'>
        <View className='bg-white p-6 rounded-lg w-max h-max flex gap-4 mx-4 relative'>
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            className='absolute top-2 right-2 z-10'>
            <Icon name='close' size={24} color='#333' />
          </TouchableOpacity>

          <Text className='text-2xl font-medium text-slate-900'>
            Choose your account type
          </Text>
          <Text className='text-lg text-slate-900'>
            Pick the role that best fits your needs
          </Text>

          <View className='flex flex-row w-full gap-4 justify-center'>
            <TouchableHighlight
              disabled={loading}
              onPress={handelBuyer}
              className='bg-customYellow w-1/2 p-4 rounded-lg shadow-md'>
              {loading ? (
                <ActivityIndicator size='small' color='#000' />
              ) : (
                <Text className='text-center font-medium'>Buyer</Text>
              )}
            </TouchableHighlight>
            <TouchableHighlight
              disabled={loading}
              onPress={handelSeller}
              className='bg-black w-1/2 p-4 rounded-lg shadow-md'>
              {loading ? (
                <ActivityIndicator size='small' color='#FFC515' />
              ) : (
                <Text className='text-center text-customYellow font-medium'>
                  Seller
                </Text>
              )}
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RegisterModal;
