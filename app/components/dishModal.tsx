import {
  Alert,
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
import { useMutation } from "@tanstack/react-query";
import { fetchAllCategory } from "@/services/api/categoryApi";
import { DishData } from "@/interfaces/DishInterface";
import { fetchAllToppingByRestaurant } from "@/services/api/toppingApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Topping } from "@/interfaces/ToppingInterface";
import { Category } from "@/interfaces/CategoryInterface";
import { createDish, editDish } from "@/services/api/dishApi";
import { useSelector } from "react-redux";
import { CustomToast } from "./toast";

const DishModal: React.FC<{
  setShowModal: (value: boolean) => void;
  setRefresh: (value: boolean) => void;
  dish: DishData | null;
}> = ({ setShowModal, setRefresh, dish }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    dish?.category_id || null
  );
  const [selectedTopping, setSelectedTopping] = useState<string[]>(
    dish?.topping || []
  );

  const restaurantId = useSelector(
    (state: { restaurant: { restaurantId: string | null } }) =>
      state.restaurant.restaurantId
  );
  const [name, setName] = useState(dish?.name || "");
  const [introduce, setIntroduce] = useState(dish?.introduce || "");
  const [price, setPrice] = useState(dish?.price || "");
  const [time, setTime] = useState(dish?.time || "");
  const [toppings, setToppings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(dish?.image || "");

  const fetchAllCategoryMutation = useMutation({
    mutationFn: fetchAllCategory,
    onSuccess: (data: any) => {
      setCategories(data.data);
    },
    onError: (data: any) => {},
  });

  const fetchAllToppingMutaion = useMutation({
    mutationFn: (id: string) => fetchAllToppingByRestaurant(id),
    onSuccess: (data: any) => {
      console.log(data);
      setToppings(data);
    },
    onError: (data: any) => {},
  });

  const createDishMutation = useMutation({
    mutationFn: createDish,
    onSuccess: (data: any) => {
      CustomToast("success", "Success", "Created dish successfully!");
      setShowModal(false);
      setRefresh(true);
    },
    onError: (error: any) => {
      console.error("Error creating dish:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to create dish"
      );
    },
  });

  const editDishMutation = useMutation({
    mutationFn: ({ data, id }: { data: FormData; id: string }) =>
      editDish(data, id),
    onSuccess: (data: any) => {
      CustomToast("success", "Success", "Edited dish successfully!");
      setShowModal(false);
      setRefresh(true);
    },
    onError: (error: any) => {
      console.error("Error editing dish:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to edit dish"
      );
    },
  });

  const handleCreateDish = () => {
    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    const formData = new FormData();

    formData.append("restaurant_id", restaurantId?.toString() || "");
    formData.append("category_id", selectedCategory.toString());
    formData.append("name", name.toString() || "");
    formData.append("introduce", introduce.toString() || "");
    formData.append("price", price.toString() || "0");
    formData.append("time", time.toString() || "0");

    selectedTopping.forEach((toppingId, index) => {
      formData.append(`topping[${index}]`, toppingId.toString());
    });

    if (selectedImage) {
      formData.append("image", selectedImage, "image.jpg");
    } else if (imageUrl && imageUrl !== dish?.image) {
      formData.append("image", imageUrl);
    }
    try {
      if (dish) {
        editDishMutation.mutate({ data: formData, id: dish._id });
      } else {
        createDishMutation.mutate(formData);
      }
    } catch (error) {
      console.error("Error submitting dish:", error);
    }
  };

  useEffect(() => {
    fetchAllCategoryMutation.mutate();
    const fetchOwnerId = async () => {
      const id = await AsyncStorage.getItem("restaurant_id");
      if (id) {
        fetchAllToppingMutaion.mutate(id);
      }
    };
    fetchOwnerId();
  }, []);

  const renderItemCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      className={`py-2 px-4 rounded-lg ${
        selectedCategory === item._id
          ? "bg-[#FFC515] text-white"
          : "bg-white border border-[#FFC515]"
      }`}
      onPress={() => setSelectedCategory(item._id)}
    >
      <Text
        className={`${
          selectedCategory === item._id ? "text-white" : "text-[#FFC515]"
        } text-base text-center`}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderItemTopping = ({ item }: { item: Topping }) => {
    const isSelected = selectedTopping.includes(item._id);

    return (
      <TouchableOpacity
        className={`py-2 px-4 rounded-lg ${
          isSelected ? "bg-[#FFC515]" : "bg-white border border-[#FFC515]"
        }`}
        onPress={() => {
          setSelectedTopping((prevSelectedToppings) => {
            if (isSelected) {
              return prevSelectedToppings.filter((id) => id !== item._id);
            } else {
              return [...prevSelectedToppings, item._id];
            }
          });
        }}
      >
        <Text
          className={`${
            isSelected ? "text-white" : "text-[#FFC515]"
          } text-base text-center`}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const createFileFromUri = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileExtension = uri.split(".").pop() || "jpg";
    const finalFileName = `${Date.now()}.${fileExtension}`;

    return new File([blob], finalFileName, { type: blob.type });
  };

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
      setImageUrl(result.assets[0].uri);
      const file = await createFileFromUri(result.assets[0].uri);
      if (!(file instanceof File)) {
        console.error("Invalid file type", file);
        return;
      }
      setSelectedImage(file);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
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
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  className="w-full h-40 mt-2 rounded-lg"
                  resizeMode="cover"
                />
              ) : dish?.image ? (
                <Image
                  source={{ uri: dish.image }}
                  className="w-full h-40 mt-2 rounded-lg"
                  resizeMode="cover"
                />
              ) : null}

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

              {/* name */}
              <View className="flex-col justify-between items-start gap-2">
                <Text className="font-semibold text-base">Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  multiline
                  numberOfLines={4}
                  className="w-full p-2 border border-slate-400 rounded-lg"
                  placeholder="Enter name"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {/* introduce */}
              <View className="flex-col justify-between items-start gap-2">
                <Text className="font-semibold text-base">Introduce</Text>
                <TextInput
                  multiline
                  numberOfLines={4}
                  value={introduce}
                  onChangeText={setIntroduce}
                  className="w-full p-2 border border-slate-400 rounded-lg"
                  placeholder={"Enter introduce"}
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
                    renderItem={renderItemCategory}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ gap: 10 }}
                  />
                )}
              </View>

              {/* price */}
              <View className="flex-col justify-between items-start gap-2">
                <Text className="font-semibold text-base">Price</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  className="w-full p-2 border border-slate-400 rounded-lg"
                  placeholder={dish?.price.toString() || "Enter price"}
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {/* time */}
              <View className="flex-col justify-between items-start gap-2">
                <Text className="font-semibold text-base">Time</Text>
                <TextInput
                  value={time}
                  onChangeText={setTime}
                  className="w-full p-2 border border-slate-400 rounded-lg"
                  placeholder={dish?.time.toString() || "Enter time"}
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {/* topping */}
              <View className="flex-col justify-between items-start gap-2">
                <Text className="font-semibold text-base">Topping</Text>
                {fetchAllCategoryMutation.isError && (
                  <Text className="text-center text-red-500">
                    Failed to load topping
                  </Text>
                )}

                {fetchAllToppingMutaion.isSuccess && (
                  <FlatList
                    data={toppings}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItemTopping}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ gap: 10 }}
                  />
                )}
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
                  onPress={handleCreateDish}
                  className="bg-[#389C9A] p-3 rounded-lg flex-1"
                >
                  <Text className="text-white text-center font-medium">
                    {dish !== null ? "Save" : "Create"}
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default DishModal;
