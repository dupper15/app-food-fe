import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import ReflectForm from "../components/reflectForm";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { getReflectByUserId } from "@/services/api/reflectApi";
import { CustomToast } from "../components/toast";
import { useSelector } from "react-redux";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const Reflect = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isShow, setIsShow] = useState(false);
  const userId = useSelector((state) => state.user.userId);
  const handleToggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
    setIsExpanded((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };
  const [isExpanded, setIsExpanded] = useState<boolean[]>([]);

  const [reflect, setReflect] = useState<any[]>([]);
  const getReflectMutation = useMutation({
    mutationFn: getReflectByUserId,
    onSuccess: (data) => {
      setReflect(data);
    },
    onError: (error) => {
      console.error("Error fetching reflect data:", error);
    },
  });
  useEffect(() => {
    getReflectMutation.mutate(userId);
  }, []);
  const router = useRouter();
  return (
    <View className='flex-1 bg-slate-100'>
      <View className='w-full py-4 px-6 bg-white flex-row items-center justify-between'>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}>
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
        <Text className='text-xl font-semibold text-gray-800'>Reflect</Text>
        <TouchableOpacity
          className='bg-black rounded-md p-1 '
          onPress={() => {
            setIsShow(true);
          }}>
          <Ionicons name='add' size={28} color='#FFC515' />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className='w-full px-4 py-4 space-y-4'>
        <View className='flex-1 gap-4'>
          {reflect.map((item, index) => (
            <View key={item._id} className='bg-white rounded-xl p-4'>
              <TouchableOpacity
                onPress={() => handleToggle(index)}
                className='flex-row justify-between items-center py-2 px-4 bg-white rounded-md mb-2'>
                <Text className='text-base font-medium text-slate-800'>
                  {item.content}
                </Text>
                <Ionicons
                  name={isExpanded[index] ? "chevron-up" : "chevron-down"} // toggle icon
                  size={20}
                  color='#475569'
                />
              </TouchableOpacity>

              {item.images && item.images.length > 0 && (
                <View className='flex-row flex-wrap mt-2 gap-2'>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className='flex-row gap-2'>
                      {item.images.map((image, imgIndex) => (
                        <Image
                          key={imgIndex}
                          source={{ uri: image }}
                          className='w-24 h-24 rounded-lg'
                        />
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}

              {expandedIndex === index && (
                <View className='mt-3 pl-4 space-y-2 border-l-2 border-slate-300'>
                  {item.replies_array.map((reply) => (
                    <Text key={reply._id} className='text-sm text-slate-600'>
                      • {reply.content}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      {isShow && (
        <View className='absolute top-0 left-0 right-0 bottom-0 bg-black/50 justify-center items-center z-50'>
          <View className='w-[90%]'>
            <ReflectForm
              setIsShow={setIsShow}
              getReflectMutation={getReflectMutation}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Reflect;
