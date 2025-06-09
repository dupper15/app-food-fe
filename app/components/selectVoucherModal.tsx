import { getVouchers } from "@/services/api/voucherApi";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";

const SelectVoucherModal = ({
  restaurantId,
  totalPrice,
  showModal,
  setShowModal,
  setVoucher,
}) => {
  const translateY = useRef(new Animated.Value(300)).current;

  const [voucherList, setVoucherList] = useState([]);
  const getVoucherMutation = useMutation({
    mutationFn: getVouchers,
    onSuccess: (data) => {
      setVoucherList(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  useEffect(() => {
    if (restaurantId) {
      getVoucherMutation.mutate(restaurantId);
    }
  }, [restaurantId]);
  useEffect(() => {
    if (showModal) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showModal]);
  const sortedVoucherList = Array.isArray(voucherList)
    ? [...voucherList].sort((a, b) => {
        const aEligible = !a.min || a.min <= totalPrice;
        const bEligible = !b.min || b.min <= totalPrice;
        return bEligible - aEligible;
      })
    : [];

  return (
    <Modal
      className='h-screen w-full'
      transparent={true}
      visible={showModal}
      animationType='fade'>
      <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
        <View className='flex-1 justify-end bg-black/50'>
          <Animated.View
            className='w-full flex-1 justify-end'
            style={{ transform: [{ translateY }] }}>
            <View
              className='bg-white w-full rounded-t-2xl p-4'
              style={{ height: "60%" }}>
              <Text className='text-xl font-bold text-center mb-4'>
                Select Voucher
              </Text>

              <ScrollView
                className='flex-1 h-max'
                showsVerticalScrollIndicator={false}>
                {sortedVoucherList.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    disabled={
                      !(
                        typeof item.min === "undefined" ||
                        item.min <= totalPrice
                      )
                    }
                    className={`mb-3 p-4 border border-gray-300 rounded-xl  flex-row items-center justify-between ${
                      typeof item.min === "undefined" || item.min <= totalPrice
                        ? "bg-white"
                        : "bg-slate-200 opacity-70"
                    }`}>
                    <View className='flex-1 pr-4'>
                      <Text className='text-lg font-semibold text-green-600'>
                        {item.name}
                      </Text>
                      <Text className='text-gray-600 italic mb-2'>
                        {item.content}
                      </Text>

                      <View className='space-y-1'>
                        <Text className='text-sm text-gray-500'>
                          Discount:{" "}
                          <Text className='font-semibold text-black'>
                            {item.value}đ
                          </Text>
                        </Text>
                        {item.max && (
                          <Text className='text-sm text-gray-500'>
                            Max Discount:{" "}
                            <Text className='font-semibold text-black'>
                              {item.max}đ
                            </Text>
                          </Text>
                        )}
                        {item.min && (
                          <Text className='text-sm text-gray-500'>
                            Min Order:{" "}
                            <Text className='font-semibold text-black'>
                              {item.min}đ
                            </Text>
                          </Text>
                        )}
                      </View>
                    </View>

                    <TouchableOpacity
                      className='bg-customYellow rounded-lg px-5 py-2'
                      onPress={() => {
                        setVoucher(item);
                        setShowModal(false);
                      }}
                      disabled={
                        !(
                          typeof item.min === "undefined" ||
                          item.min <= totalPrice
                        )
                      }>
                      <Text className='text-black font-semibold'>Apply</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SelectVoucherModal;
