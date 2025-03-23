import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Item } from "./menuItem";
import { useMutation } from "@tanstack/react-query";
import { fetchAllCategory } from "@/services/api/categoryApi";

const DishModal: React.FC<{
  setShowModal: (value: boolean) => void;
  dish: Item | null;
}> = ({ setShowModal, dish }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    dish?.category || null
  );

  const [categories, setCategories] = useState([]);

  const fetchAllCategoryMutation = useMutation({
    mutationFn: fetchAllCategory,
    onSuccess: (data: any) => {
      setCategories(data.data);
    },
    onError: (data: any) => {},
  });

  useEffect(() => {
    fetchAllCategoryMutation.mutate();
  }, []);

  const renderItem = ({ item }: { item: { _id: string; name: string } }) => (
    <TouchableOpacity
      className={`py-2 px-4 rounded-lg ${
        selectedCategory === item.name
          ? "bg-[#FFC515] text-white"
          : "bg-white border border-[#FFC515]"
      }`}
      onPress={() => setSelectedCategory(item.name)}
    >
      <Text
        className={`${
          selectedCategory === item.name ? "text-white" : "text-[#FFC515]"
        } text-base text-center`}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const pickImage = async (fromCamera: boolean) => {
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (galleryStatus !== "granted" || cameraStatus !== "granted") {
      alert("Permission denied. Please allow camera and gallery access.");
      return;
    }

    const result = await (fromCamera
      ? ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        })
      : ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        }));

    if (!result.canceled && result.assets?.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="w-full items-center"
          >
            <View className="bg-white w-3/4 p-6 rounded-lg shadow-lg">
              <Text className="text-slate-900 font-extrabold text-2xl text-center mb-4">
                {dish ? "Edit Dish" : "Create Dish"}
              </Text>
              <View className="w-full flex flex-col gap-3">
                {/* image */}
                <View className="flex-row justify-between items-start gap-2">
                  <TouchableOpacity
                    className="bg-[#389C9A] rounded-md py-1 px-2"
                    onPress={() => pickImage(true)}
                  >
                    <Text className="text-white text-base">Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-[#FFC515] rounded-md py-1 px-2"
                    onPress={() => pickImage(false)}
                  >
                    <Text className="text-white text-base">
                      Choose from Gallery
                    </Text>
                  </TouchableOpacity>
                </View>

                {selectedImage && (
                  <Image
                    source={{ uri: selectedImage }}
                    className="w-full h-40 mt-2 rounded-lg"
                    resizeMode="cover"
                  />
                )}

                {/* name */}
                <View className="flex-col justify-between items-start gap-2">
                  <Text className="font-semibold text-base">Name</Text>
                  <TextInput
                    multiline
                    numberOfLines={4}
                    className="w-full p-2 border border-slate-400 rounded-lg"
                    placeholder={dish?.name || "Enter name"}
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                {/* introduce */}
                <View className="flex-col justify-between items-start gap-2">
                  <Text className="font-semibold text-base">Introduce</Text>
                  <TextInput
                    multiline
                    numberOfLines={4}
                    className="w-full p-2 border border-slate-400 rounded-lg"
                    placeholder={dish?.introduce || "Enter introduce"}
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                {/* category */}
                <View className="flex-col justify-between items-start gap-2">
                  <Text className="font-semibold text-base">Category</Text>
                  {fetchAllCategoryMutation.isError && (
                    <Text className="text-center text-red-500">
                      Failed to load categories
                    </Text>
                  )}

                  {fetchAllCategoryMutation.isSuccess && (
                    <FlatList
                      data={categories}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={renderItem}
                      keyExtractor={(item) => item._id}
                      contentContainerStyle={{ gap: 10 }}
                    />
                  )}
                </View>

                {/* price */}
                <View className="flex-col justify-between items-start gap-2">
                  <Text className="font-semibold text-base">Price</Text>
                  <TextInput
                    className="w-full p-2 border border-slate-400 rounded-lg"
                    placeholder={dish?.price.toString() || "Enter price"}
                    keyboardType="numeric"
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View className="flex-row items-center gap-4 justify-between">
                  <TouchableHighlight
                    onPress={() => setShowModal(false)}
                    className="bg-red-500 p-3 rounded-lg flex-1"
                  >
                    <Text className="text-white text-center font-medium">
                      Cancel
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={() => setShowModal(false)}
                    className="bg-[#389C9A] p-3 rounded-lg flex-1"
                  >
                    <Text className="text-white text-center font-medium">
                      {dish !== null ? "Edit" : "Create"}
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DishModal;
