import {
  Modal,
  View,
  TouchableHighlight,
  Text,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { CustomToast } from "./toast";

const UploadImageModal: React.FC<{
  setShowModal: (value: boolean) => void;
  handleImagePicker: (value: File) => void;
}> = ({ setShowModal, handleImagePicker }) => {
  const createFileFromUri = async (uri: string): Promise<File> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new File([blob], "image.jpg", { type: blob.type });
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      CustomToast("error", "Error", "Permission denied");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const file = await createFileFromUri(result.assets[0].uri);
      handleImagePicker(file);
      setShowModal(false);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      CustomToast("error", "Error", "Permission denied");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const file = await createFileFromUri(result.assets[0].uri);
      handleImagePicker(file);
      setShowModal(false);
    }
  };

  return (
    <Modal animationType='slide' visible={true}>
      <View className='flex-1 bg-black bg-opacity-50 justify-center items-center'>
        <View className='bg-white w-3/4 p-6 rounded-lg shadow-lg'>
          <Text className='text-slate-900 font-medium text-xl text-center mb-4'>
            Upload Image
          </Text>
          <View className='w-full flex flex-col gap-3'>
            <TouchableHighlight
              onPress={openCamera}
              className='bg-customYellow p-3 rounded-lg'
              underlayColor='#FFD700'>
              <Text className='text-white text-center font-medium'>
                Open Camera
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={openGallery}
              className='bg-customYellow p-3 rounded-lg'
              underlayColor='#FFD700'>
              <Text className='text-white text-center font-medium'>
                Choose from Gallery
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => setShowModal(false)}
              className='bg-red-500 p-3 rounded-lg'
              underlayColor='#FF6347'>
              <Text className='text-white text-center font-medium'>Cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UploadImageModal;
