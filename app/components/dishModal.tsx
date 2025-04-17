import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
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
import { Topping } from "@/interfaces/ToppingInterface";
import { Category } from "@/interfaces/CategoryInterface";
import { createDish, editDish } from "@/services/api/dishApi";
import { useSelector } from "react-redux";
import { CustomToast } from "./toast";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type ReactNativeFile = {
  uri: string;
  name: string;
  type: string;
};

export default function VoucherModal() {
  const route = useRoute();
  const router = useRouter();
  const { dish } = route.params as {
    dish: string;
  };
  const parsedDish: DishData = dish ? JSON.parse(dish) : null;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    parsedDish?.category_id || null
  );
  const [selectedTopping, setSelectedTopping] = useState<string[]>(
    parsedDish?.topping.map((t) => t._id) || []
  );
  const restaurantId = useSelector(
    (state: { restaurant: { restaurantId: string } }) =>
      state.restaurant.restaurantId
  );
  const [name, setName] = useState(parsedDish?.name);
  const [introduce, setIntroduce] = useState(parsedDish?.introduce);
  const [price, setPrice] = useState(parsedDish?.price.toString());
  const [time, setTime] = useState(parsedDish?.time.toString());
  const [toppings, setToppings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState<ReactNativeFile>();
  const [imageUrl, setImageUrl] = useState(parsedDish?.image);

  const [showError, setShowError] = useState<boolean>(false);
  const [contentError, setContentError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      setToppings(data);
    },
    onError: (data: any) => {},
  });

  const createDishMutation = useMutation({
    mutationFn: createDish,
    onSuccess: () => {
      setIsLoading(false);
      CustomToast("success", "Success", "Created dish successfully!");
      router.back();
    },
    onError: () => {
      console.error = () => {};
      setIsLoading(false);
      CustomToast("error", "Error", "Created dish failed! Please try again");
    },
  });

  const editDishMutation = useMutation({
    mutationFn: ({ data, id }: { data: FormData; id: string }) =>
      editDish(data, id),
    onSuccess: () => {
      setIsLoading(false);
      CustomToast("success", "Success", "Edited dish successfully!");
      router.back();
    },
    onError: () => {
      console.error = () => {};
      setIsLoading(false);
      CustomToast("error", "Error", "Edited dish failed! Please try again");
    },
  });

  const handleSubmitDish = () => {
    if (!name || !introduce || !price || !time || !selectedCategory) {
      setShowError(true);
      setContentError("All fields are required!");
      return;
    }
    if (!imageUrl) {
      setShowError(true);
      setContentError("Please choose image!");
      return;
    }
    const formData = new FormData();
    formData.append("restaurant_id", restaurantId?.toString() || "");
    formData.append("category_id", selectedCategory.toString());
    formData.append("name", name.toString() || "");
    formData.append("introduce", introduce.toString() || "");
    formData.append("price", price.toString() || "0");
    formData.append("time", time.toString() || "0");

    selectedTopping.forEach((toppingId) => {
      formData.append("topping", toppingId.toString());
    });

    if (selectedImage) {
      formData.append("image", {
        uri: selectedImage.uri,
        name: selectedImage.name,
        type: selectedImage.type,
      } as any);
    }
    if (dish) {
      editDishMutation.mutate({ data: formData, id: parsedDish._id });
    } else {
      createDishMutation.mutate(formData);
    }
    setIsLoading(true);
  };

  useEffect(() => {
    fetchAllToppingMutaion.mutate(restaurantId);
    fetchAllCategoryMutation.mutate();
  }, [restaurantId]);

  const renderItemCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      className={`py-2 px-4 rounded-lg ${
        selectedCategory === item._id
          ? "bg-[#FFC515] text-white"
          : "bg-white border border-[#FFC515]"
      }`}
      onPress={() => setSelectedCategory(item._id)}>
      <Text
        className={`${
          selectedCategory === item._id ? "text-white" : "text-[#FFC515]"
        } text-base text-center`}>
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
        }}>
        <Text
          className={`${
            isSelected ? "text-white" : "text-[#FFC515]"
          } text-base text-center`}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const createFileFromUri = (uri: string) => {
    const fileExtension = uri.split(".").pop() || "jpg";
    const mimeType = `image/${
      fileExtension === "jpg" ? "jpeg" : fileExtension
    }`;
    const name = `image_${Date.now()}.${fileExtension}`;

    return {
      uri,
      name,
      type: mimeType,
    };
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
      const uri = result.assets[0].uri;
      const file = createFileFromUri(uri);
      setImageUrl(uri);
      setSelectedImage(file);
    }
  };

  return (
    <View className='h-full flex-col bg-white'>
      {/* header */}
      <View className='flex-row w-full h-14 bg-white items-center px-4 border-b border-gray-100'>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='chevron-back-outline' size={24} color='black' />
        </TouchableOpacity>
        <Text className='font-bold text-2xl text-center flex-1'>
          {dish ? "Edit Dish" : "Create Dish"}
        </Text>
        <View className='w-2' />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className='flex-1'>
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}>
          <View className='w-full flex flex-col gap-3'>
            <View className='w-full flex flex-col gap-3'>
              {/* image */}
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  className='w-full h-60 pt-2 rounded-lg'
                  resizeMode='cover'
                />
              ) : parsedDish?.image ? (
                <Image
                  source={{ uri: parsedDish.image }}
                  className='w-full h-40 pt-2 rounded-lg'
                  resizeMode='cover'
                />
              ) : null}

              <View className='flex-row justify-between items-start gap-2'>
                <TouchableOpacity
                  className='bg-[#389C9A] rounded-md py-1 px-2'
                  onPress={() => pickImage(true)}>
                  <Text className='text-white text-base'>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className='bg-[#FFC515] rounded-md py-1 px-2'
                  onPress={() => pickImage(false)}>
                  <Text className='text-white text-base'>
                    Choose from Gallery
                  </Text>
                </TouchableOpacity>
              </View>

              {/* name */}
              <View className='flex-col justify-between items-start gap-2'>
                <Text className='font-semibold text-base'>Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  multiline
                  numberOfLines={4}
                  className='w-full p-2 border border-slate-400 rounded-lg'
                  placeholder='Enter name'
                  placeholderTextColor='#94a3b8'
                />
              </View>

              {/* introduce */}
              <View className='flex-col justify-between items-start gap-2'>
                <Text className='font-semibold text-base'>Introduce</Text>
                <TextInput
                  multiline
                  numberOfLines={4}
                  value={introduce}
                  onChangeText={setIntroduce}
                  className='w-full p-2 border border-slate-400 rounded-lg'
                  placeholder={"Enter introduce"}
                  placeholderTextColor='#94a3b8'
                />
              </View>

              {/* category */}
              <View className='flex-col justify-between items-start gap-2'>
                <Text className='font-semibold text-base'>Category</Text>
                {fetchAllCategoryMutation.isError && (
                  <Text className='text-center text-red-500'>
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
                    className='w-full'
                  />
                )}
              </View>

              {/* price */}
              <View className='flex-col justify-between items-start gap-2'>
                <Text className='font-semibold text-base'>Price</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  className='w-full p-2 border border-slate-400 rounded-lg'
                  placeholder={parsedDish?.price.toString() || "Enter price"}
                  keyboardType='numeric'
                  placeholderTextColor='#94a3b8'
                />
              </View>

              {/* time */}
              <View className='flex-col justify-between items-start gap-2'>
                <Text className='font-semibold text-base'>Time</Text>
                <TextInput
                  value={time}
                  onChangeText={setTime}
                  className='w-full p-2 border border-slate-400 rounded-lg'
                  placeholder={parsedDish?.time.toString() || "Enter time"}
                  keyboardType='numeric'
                  placeholderTextColor='#94a3b8'
                />
              </View>

              {/* topping */}
              <View className='flex-col justify-between items-start gap-2'>
                <Text className='font-semibold text-base'>Topping</Text>
                {fetchAllCategoryMutation.isError && (
                  <Text className='text-center text-red-500'>
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
                    className='w-full'
                  />
                )}
              </View>

              {showError && (
                <Text className='text-red-500'>{contentError}</Text>
              )}

              <View className='flex-row items-center gap-4 justify-between'>
                <TouchableHighlight
                  onPress={() => router.back()}
                  className='bg-red-500 p-3 rounded-lg flex-1'>
                  <Text className='text-white text-center font-medium'>
                    Cancel
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={handleSubmitDish}
                  className='bg-[#389C9A] p-3 rounded-lg flex-1'>
                  <Text className='text-white text-center font-medium'>
                    {dish !== null ? "Save" : "Create"}
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {isLoading && (
        <View className='absolute inset-0 justify-center items-center bg-white/90 z-10'>
          <ActivityIndicator size='large' color='#FFD700' />
        </View>
      )}
    </View>
    // <View className="flex-1 bg-white">

    // </View>
  );
}
