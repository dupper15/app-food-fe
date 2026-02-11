import { OrderOngoingRestaurant } from "@/types/OrderInterface";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import StepIndicator from "react-native-step-indicator";
import { formatCodeOrder } from "./../../../utils/format";
import { useMutation } from "@tanstack/react-query";
import { updateStatusOrderByRestaurant } from "@/apis/orderApi";
import { CustomToast } from "@/components/ui/toast";

const statusText = ["Received", "Preparing", "Ready"];

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#FFC515",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#FFC515",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#FFC515",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#FFC515",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#FFC515",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#FFC515",
};

export default function StatusModal({
  visible,
  onClose,
  data,
  refresh,
  setRefresh,
}: {
  visible: boolean;
  onClose: () => void;
  data: OrderOngoingRestaurant | null;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}) {
  const [step, setStep] = useState(0);

  const mapStatusToStep = (status: string) => {
    switch (status) {
      case "Received":
        return 0;
      case "Preparing":
        return 1;
      case "Ready":
        return 2;
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (visible && data?.status) {
      const newStep = mapStatusToStep(data.status);
      setStep(newStep);
    }
  }, [visible, data?.status]);

  const changeStatusOrder = useMutation({
    mutationFn: (id: string) => updateStatusOrderByRestaurant(id),
    onSuccess: () => {
      CustomToast("success", "Success", "Change status successfully!");
      setRefresh(!refresh);
    },
    onError: () => {
      CustomToast(
        "error",
        "Error",
        "Failed to change status order! Please try again",
      );
    },
  });

  const handleNext = () => {
    changeStatusOrder.mutate(data?._id || "");
    setStep(step + 1);
    onClose();
  };

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className='flex-1 justify-center items-center bg-black/50'>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className='bg-white rounded-lg p-5 w-4/5 shadow-lg items-start'>
              <Text className='text-base font-semibold mb-1'>
                ID: {formatCodeOrder(data?._id || "")}
              </Text>
              <Text className='text-base font-semibold mb-1'>
                Customer: {data?.customer_id?.name}
              </Text>
              {/* Progress bar */}
              <View className='w-full mt-4 mb-6 px-2'>
                <StepIndicator
                  customStyles={customStyles}
                  currentPosition={step}
                  labels={statusText}
                  stepCount={3}
                />
              </View>

              {/* Next step button */}
              <TouchableOpacity
                className='bg-[#FFC515] px-6 py-2 rounded-lg mt-4 w-full'
                onPress={handleNext}>
                <Text className='text-white text-center font-semibold'>
                  Next step
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
