import { Modal, View, TouchableHighlight, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CustomToast } from "./toast";

const UploadImageModal: React.FC<{
  setShowModal: (value: boolean) => void;
  type: string;
  handleImagePicker: (
    file: { uri: string; name: string; type: string },
    uri: string
  ) => void;
}> = ({ setShowModal, handleImagePicker, type }) => {
  const createFileFromUri = (uri: string, type: string) => {
    const fileExtension = uri.split(".").pop() || "jpg";
    const mimeType = `image/${
      fileExtension === "jpg" ? "jpeg" : fileExtension
    }`;
    const name = `${type}_${Date.now()}.${fileExtension}`;

    return {
      uri,
      name,
      type: mimeType,
    };
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
      const uri = result.assets[0].uri;
      const file = createFileFromUri(uri, type);
      handleImagePicker(file, uri);
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
      const uri = result.assets[0].uri;
      const file = createFileFromUri(uri, type);
      handleImagePicker(file, uri);
      setShowModal(false);
    }
  };

  return (
    <Modal animationType="slide" visible={true}>
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
        <View className="bg-white w-3/4 p-6 rounded-lg shadow-lg">
          <Text className="text-slate-900 font-medium text-xl text-center mb-4">
            Upload Image
          </Text>
          <View className="w-full flex flex-col gap-3">
            <TouchableHighlight
              onPress={openCamera}
              className="bg-customYellow p-3 rounded-lg"
              underlayColor="#FFD700"
            >
              <Text className="text-white text-center font-medium">
                Open Camera
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={openGallery}
              className="bg-customYellow p-3 rounded-lg"
              underlayColor="#FFD700"
            >
              <Text className="text-white text-center font-medium">
                Choose from Gallery
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => setShowModal(false)}
              className="bg-red-500 p-3 rounded-lg"
              underlayColor="#FF6347"
            >
              <Text className="text-white text-center font-medium">Cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UploadImageModal;
