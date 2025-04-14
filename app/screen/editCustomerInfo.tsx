import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { editCustomerInfo } from "@/services/api/userApi";

const EditCustomerInfo = () => {
  const [user, setUser] = useState({});
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [editUser, setEditUser] = useState({});
  const handleSetEdit = () => {
    setIsEdit((prev) => !prev);
  };

  const handleRouteBack = () => {
    router.back();
  };

  const { data } = useLocalSearchParams();

  useEffect(() => {
    if (data) {
      try {
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;
        console.log("parsedData", parsedData);
        setUser(parsedData);
      } catch (error) {
        console.error("Failed to parse data:", error);
      }
    }
  }, [data]);
  const editCustomerMutation = useMutation({
    mutationFn: editCustomerInfo,
    onSuccess: (data) => {
      console.log("Edit success", data);
      setUser(data);
      setEditUser({});
      setIsEdit(false);
    },
    onError: (error) => {
      console.log("Edit error", error);
    },
  });
  const handleSaveInfo = async () => {
    const data = { userId: user._id, editUser };
    editCustomerMutation.mutate(data);
  };
  const handleCancel = () => {
    setEditUser({});
    setIsEdit(false);
  };
  return (
    <View className='flex-1 bg-slate-100'>
      {user && (
        <>
          <View className='flex-row items-center justify-between bg-white px-4 py-3'>
            <TouchableOpacity onPress={handleRouteBack}>
              <Ionicons name='arrow-back' size={24} color='black' />
            </TouchableOpacity>
            <Text className='text-lg font-bold text-gray-800'>
              Personal Info
            </Text>
            <TouchableOpacity
              onPress={isEdit ? handleSaveInfo : handleSetEdit}
              className='bg-yellow-400 px-4 py-1 rounded-full'>
              <Text className='text-white font-medium'>
                {isEdit ? "Save" : "Edit"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className='items-center mt-6'>
            <View className='w-32 h-32 rounded-full overflow-hidden bg-gray-300'>
              <Image
                source={{
                  uri:
                    user.avatar ||
                    " https://th.bing.com/th/id/OIP.vg41yG82qw84ziz5nS-CWQHaHa?rs=1&pid=ImgDetMain",
                }}
                className='w-full h-full'
                resizeMode='cover'
              />
            </View>
            <TouchableOpacity className='absolute -bottom-4 left-1/2 -translate-x-1/2 border border-white bg-yellow-400 p-2 rounded-full'>
              <Ionicons name='camera' size={20} color='white' />
            </TouchableOpacity>
          </View>

          <View className='px-6 mt-6 space-y-4'>
            <View>
              <Text className='text-sm text-gray-500'>Fullname</Text>
              {isEdit ? (
                <TextInput
                  defaultValue={user.name}
                  value={editUser.name}
                  onChangeText={(text) =>
                    setEditUser({ ...editUser, name: text })
                  }
                  className='bg-white px-3 py-2 rounded-md mt-1'
                />
              ) : (
                <Text className='text-base font-medium text-gray-800 mt-1'>
                  {user.name}
                </Text>
              )}
            </View>

            <View>
              <Text className='text-sm text-gray-500'>Email</Text>
              {isEdit ? (
                <TextInput
                  defaultValue={user.email}
                  value={editUser.email}
                  onChangeText={(text) =>
                    setEditUser({ ...editUser, email: text })
                  }
                  className='bg-white px-3 py-2 rounded-md mt-1'
                  keyboardType='email-address'
                />
              ) : (
                <View className='flex-row items-center mt-1'>
                  <MaterialIcons name='email' size={16} color='gray' />
                  <Text className='ml-2 text-base font-medium text-gray-700'>
                    {user.email}
                  </Text>
                </View>
              )}
            </View>

            <View>
              <Text className='text-sm text-gray-500'>Phone</Text>
              {isEdit ? (
                <TextInput
                  defaultValue={user.phone}
                  value={editUser.phone}
                  onChangeText={(text) =>
                    setEditUser({ ...editUser, phone: text })
                  }
                  className='bg-white px-3 py-2 rounded-md mt-1'
                  keyboardType='phone-pad'
                />
              ) : (
                <View className='flex-row items-center mt-1'>
                  <Ionicons name='call' size={16} color='gray' />
                  <Text className='ml-2 text-base font-medium text-gray-700'>
                    {user.phone}
                  </Text>
                </View>
              )}
            </View>

            <View className='border-t border-gray-300 pt-4'>
              <Text className='text-sm text-gray-500'>Total Orders</Text>
              <View className='flex-row items-center mt-1'>
                <FontAwesome5 name='shopping-cart' size={16} color='gray' />
                <Text className='ml-2 text-base font-semibold text-gray-800'>
                  {user.total_orders}
                </Text>
              </View>
            </View>

            <View>
              <Text className='text-sm text-gray-500'>Total Points</Text>
              <View className='flex-row items-center mt-1'>
                <Ionicons name='star' size={16} color='#facc15' />
                <Text className='ml-2 text-base font-semibold text-gray-800'>
                  {user.total_points}
                </Text>
              </View>
            </View>

            {isEdit && (
              <View className='flex flex-row justify-center items-center gap-4 mt-4'>
                <TouchableHighlight
                  className='bg-white px-5 py-2 border border-customYellow rounded-md shadow-lg'
                  underlayColor='#f1f5f9'
                  onPress={handleCancel}>
                  <Text className='text-gray-700 font-semibold'>Cancel</Text>
                </TouchableHighlight>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default EditCustomerInfo;
