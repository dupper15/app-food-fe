import { useState } from "react";
import {
  TextInput,
  TouchableHighlight,
  Text,
  View,
  ScrollView,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { CustomToast } from "./toast";
import UploadImageModal from "./uploadImageModal";
import { sendReflect } from "@/services/api/reflectApi";
import { RootState } from "../store";
import { ActivityIndicator } from "react-native";

type ReactNativeFile = {
  uri: string;
  name: string;
  type: string;
};

const ReflectForm = ({
  setIsShow,
  handleGetReflect,
}: {
  setIsShow: (value: boolean) => void;
  handleGetReflect: (userId: string) => Promise<void>;
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const userId = useSelector((state: RootState) => state.user.userId);
  const [showModal, setShowModal] = useState(false);
  const [imageFiles, setImageFiles] = useState<ReactNativeFile[]>([]);
  const handleAddImage = () => {
    setShowModal(true);
  };
  const uploadMutation = useMutation({
    mutationFn: sendReflect,
    onSuccess: (data) => {
      CustomToast("success", "Gửi phản hồi thành công", "");
      setImages([]);
      setContent("");
      if (userId) {
        handleGetReflect(userId);
      }
      setIsShow(false);
    },
    onError: (error) => {
      CustomToast("error", "Gửi phản hồi thất bại", error.message || "");
    },
  });
  const uploadImage = async () => {
    if (userId) {
      const formData = new FormData();
      formData.append("customer_id", userId);
      formData.append("content", content);
      imageFiles.forEach((file) => {
        formData.append("reflects", {
          uri: file.uri,
          name: file.name,
          type: file.type,
        } as any);
      });

      uploadMutation.mutate(formData);
    }
  };

  const createFileFromUri = (uri: string): ReactNativeFile => {
    const fileExtension = uri.split(".").pop() || "jpg";
    const mimeType = `image/${
      fileExtension === "jpg" ? "jpeg" : fileExtension
    }`;
    const name = `reflect_${Date.now()}.${fileExtension}`;

    return {
      uri,
      name,
      type: mimeType,
    };
  };

  const handleImagePicker = (
    _file: { uri: string; name: string; type: string },
    uri: string
  ) => {
    const file = createFileFromUri(uri);
    setImages((prev) => [...prev, uri]);
    setImageFiles((prev) => [...prev, file]);
    setShowModal(false);
  };

  const handleSubmit = () => {
    uploadImage();
  };

  return (
    <View className='p-4 bg-white rounded-lg shadow-md gap-4'>
      <Text className='text-center text-lg font-bold text-gray-800'>
        Send reflect to us
      </Text>

      <TextInput
        className='border border-gray-300 rounded-lg p-3 text-base text-gray-800'
        placeholder='Text here...'
        placeholderTextColor={"#9ca3af"}
        multiline
        numberOfLines={4}
        value={content}
        onChangeText={setContent}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className='flex-row gap-2'>
        {images.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            className='w-20 h-20 rounded-md bg-gray-200 mr-2'
          />
        ))}
        <TouchableHighlight
          onPress={handleAddImage}
          disabled={uploadMutation.isPending}
          className='w-20 h-20 bg-gray-300 rounded-md justify-center items-center'
          underlayColor='#cbd5e1'>
          <Text className='text-3xl text-white'>+</Text>
        </TouchableHighlight>
      </ScrollView>

      <View className='flex-row justify-between gap-4'>
        <TouchableHighlight
          onPress={() => setIsShow(false)}
          disabled={uploadMutation.isPending}
          className='flex-1 bg-gray-200 py-3 rounded-lg'
          underlayColor='#94a3b8'>
          <Text className='text-center text-black font-medium'>Cancel</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={handleSubmit}
          disabled={uploadMutation.isPending}
          className='flex-1 bg-customYellow py-3 rounded-lg'
          underlayColor='#eab308'>
          {uploadMutation.isPending ? (
            <ActivityIndicator size='small' color='#fff' />
          ) : (
            <Text className='text-center text-white font-medium'>Send</Text>
          )}
        </TouchableHighlight>
      </View>

      {showModal && (
        <UploadImageModal
          setShowModal={setShowModal}
          handleImagePicker={handleImagePicker}
          type='reflect'
        />
      )}
    </View>
  );
};

export default ReflectForm;
