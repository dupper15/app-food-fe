import { Modal, View, TouchableHighlight, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CustomToast } from "./toast";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/services/api/axiosInstance";
import { textSearch } from "@/services/api/searchApi";
import { useRouter } from "expo-router";

type ReactNativeFile = {
  uri: string;
  name: string;
  type: string;
};

type ImageSearchProps = {
  setShowModal: (visible: boolean) => void;
};

const ImageSearch: React.FC<ImageSearchProps> = ({ setShowModal }) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const searchMutation = useMutation({
    mutationFn: textSearch,
    onSuccess: (data) => {
      const searchedRestaurants = JSON.stringify(data);
      router.push({
        pathname: "/screen/searchPage",
        params: { search: searchText, searchedRestaurants },
      });
      setShowModal(false);
    },
    onError: (error) => {
      console.error("Error searching:", error);
    },
  });

  const uploadImage = async (file: ReactNativeFile) => {
    const formData = new FormData();
    formData.append("image", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    const response = await axiosInstance.post("search/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  const { mutate: uploadImageMutate } = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      const searchString = data.toString().trim().slice(0, -1);
      setSearchText(searchString);
    },
    onError: (error: any) => {
      CustomToast("error", "Upload thất bại", error.message || "");
    },
  });

  useEffect(() => {
    if (searchText !== "") {
      searchMutation.mutate(searchText);
    }
  }, [searchText]);

  const createFileFromUri = (uri: string): ReactNativeFile => {
    const fileExtension = uri.split(".").pop() || "jpg";
    const mimeType = `image/${
      fileExtension === "jpg" ? "jpeg" : fileExtension
    }`;
    const name = `search_${Date.now()}.${fileExtension}`;

    return {
      uri,
      name,
      type: mimeType,
    };
  };

  const handleImagePicked = (uri: string) => {
    setImageUrl(uri);
    const file = createFileFromUri(uri);
    uploadImageMutate(file);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      CustomToast("error", "Permission denied", "");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      handleImagePicked(uri);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      CustomToast("error", "Permission denied", "");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      handleImagePicked(uri);
    }
  };

  return (
    <Modal animationType='slide' visible>
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

export default ImageSearch;
