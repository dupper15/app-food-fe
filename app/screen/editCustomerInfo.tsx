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
  ActivityIndicator,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { editCustomerInfo } from "@/services/api/userApi";
import UploadImageModal from "../components/uploadImageModal";

type ReactNativeFile = {
  uri: string;
  name: string;
  type: string;
};

const EditCustomerInfo = () => {
  const [user, setUser] = useState<any>({});
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [avatar, setAvatar] = useState<ReactNativeFile>();
  const [isEdit, setIsEdit] = useState(false);
  const [editUser, setEditUser] = useState<any>({});

  const { data } = useLocalSearchParams();

  useEffect(() => {
    if (data) {
      try {
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;
        setUser(parsedData);
      } catch (error) {
        console.error("Failed to parse data:", error);
      }
    }
  }, [data]);

  const handleSetEdit = () => {
    setEditUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setIsEdit(true);
  };

  const handleRouteBack = () => {
    router.back();
  };

  const handleImagePicker = async (
    _file: { uri: string; name: string; type: string },
    uri: string
  ) => {
    const file = createFileFromUri(uri);
    setAvatar(file);
  };

  const createFileFromUri = (uri: string): ReactNativeFile => {
    const fileExtension = uri.split(".").pop() || "jpg";
    const mimeType = `image/${
      fileExtension === "jpg" ? "jpeg" : fileExtension
    }`;
    const name = `avatar_${Date.now()}.${fileExtension}`;
    return {
      uri,
      name,
      type: mimeType,
    };
  };

  const editCustomerMutation = useMutation({
    mutationFn: editCustomerInfo,
    onSuccess: (data) => {
      setUser(data);
      setEditUser({});
      setAvatar(undefined);
      setIsEdit(false);
    },
    onError: (error) => {
      console.log("Edit error", error);
    },
  });

  const handleSaveInfo = async () => {
    const formData = new FormData();

    formData.append(
      "editUser",
      JSON.stringify({
        name: editUser.name,
        email: editUser.email,
        phone: editUser.phone,
      })
    );
    if (avatar) {
      formData.append("avatar", {
        uri: avatar.uri,
        name: avatar.name,
        type: avatar.type,
      } as any);
    }
    editCustomerMutation.mutate({ userId: user._id, formData });
  };

  const handleCancel = () => {
    setEditUser({});
    setAvatar(undefined);
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
              className='bg-yellow-400 px-4 py-1 rounded-full flex-row justify-center items-center min-w-[70px] h-[35px]'>
              {isEdit && editCustomerMutation.isPending ? (
                <ActivityIndicator size='small' color='#fff' />
              ) : (
                <Text className='text-white font-medium'>
                  {isEdit ? "Save" : "Edit"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className='items-center mt-6'>
            <View className='w-32 h-32 rounded-full overflow-hidden bg-gray-300'>
              <Image
                source={{
                  uri:
                    avatar?.uri ||
                    user.avatar ||
                    require("../../assets/images/default_avatar.jpg"),
                }}
                className='w-full h-full'
                resizeMode='cover'
              />
            </View>
            {isEdit && (
              <TouchableOpacity
                className='absolute -bottom-4 left-1/2 -translate-x-1/2 border border-white bg-yellow-400 p-2 rounded-full'
                onPress={() => setShowModal(true)}>
                <Ionicons name='camera' size={20} color='white' />
              </TouchableOpacity>
            )}
          </View>

          <View className='px-6 mt-6 space-y-4'>
            <View>
              <Text className='text-sm text-gray-500'>Fullname</Text>
              {isEdit ? (
                <TextInput
                  editable={!editCustomerMutation.isPending}
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
                  editable={!editCustomerMutation.isPending}
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
                  editable={!editCustomerMutation.isPending}
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
                  className='bg-white px-5 py-2 border border-customYellow rounded-xl'
                  underlayColor='#f1f5f9'
                  onPress={handleCancel}>
                  <Text className='text-gray-700 font-semibold'>Cancel</Text>
                </TouchableHighlight>
              </View>
            )}
          </View>
        </>
      )}

      {showModal && (
        <UploadImageModal
          setShowModal={setShowModal}
          type={"avatar"}
          handleImagePicker={handleImagePicker}
        />
      )}
    </View>
  );
};

export default EditCustomerInfo;
