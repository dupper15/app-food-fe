import { CustomToast } from "@/app/components/toast";
import { RestaurantData } from "@/interfaces/RestaurantInterface";
import {
  editRestaurant,
  fetchRestaurantByOwner,
} from "@/services/api/restaurantApi";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { getDetailOwner, setAvatarRes } from "@/services/api/owner";
import UploadImageModal from "@/app/components/uploadImageModal";

export default function EditRestaurant() {
  const ownerId = useSelector(
    (state: { user: { userId: string } }) => state.user.userId
  );
  const route = useRouter();
  const [restaurant, setRestaurant] = useState<RestaurantData>();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("");
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [imagesFile, setImagesFile] = useState<File[]>([]);
  const [avatarFile, setAvatarFile] = useState<File>();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [selectedBannerIndex, setSelectedBannerIndex] = useState<number | null>(
    null
  );
  const [existingBanners, setExistingBanners] = useState<string[]>([]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name || "");
    formData.append("description", description || "");
    formData.append("address", address || "");
    for (const file of imagesFile) {
      formData.append("banners", file, "image.jpg");
    }
    for (const url of existingBanners) {
      formData.append("bannersRemaining", url);
    }
    editRestaurantMutation.mutate({
      id: restaurant?._id || "",
      data: formData,
    });

    const formDataAvatar = new FormData();
    if (avatarFile) {
      formDataAvatar.append("images", avatarFile, "image.jpg");
    }
    formDataAvatar.append("owner_id", ownerId);
    avatarMutation.mutate(formDataAvatar);
  };

  const fetchDetailMutation = useMutation({
    mutationFn: async (id: string) => {
      return await fetchRestaurantByOwner(id);
    },
    onSuccess: (data: any) => {
      setRestaurant(data.data);
    },
    onError: (error: any) => {
      console.error("Full error:", error);
      CustomToast("error", "Error", "Login failed");
    },
  });

  const fetchDetailOwnerMutation = useMutation({
    mutationFn: async (id: string) => {
      return await getDetailOwner(id);
    },
    onSuccess: (data: any) => {
      setAvatarUrl(data.data.avatar);
    },
    onError: (error: any) => {
      console.error("Full error:", error);
      CustomToast("error", "Error", "Login failed");
    },
  });

  const editRestaurantMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      return await editRestaurant(id, data);
    },
    onSuccess: (data: any) => {
      setRestaurant(data.data);
      CustomToast("success", "Success", "Updated restaurant successfully!");
    },
    onError: (error: any) => {
      console.error("Full error:", error);
      CustomToast("error", "Error", "Editing restaurant failed");
    },
  });

  const avatarMutation = useMutation({
    mutationFn: setAvatarRes,
    onSuccess: (data) => {
      setAvatarUrl(data.avatar);
    },
    onError: (data) => {
      console.log("error", data);
      CustomToast("error", "Error", "Upload failed");
    },
  });

  useEffect(() => {
    fetchDetailMutation.mutate(ownerId);
    fetchDetailOwnerMutation.mutate(ownerId);
  }, [ownerId]);

  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name || "");
      setAddress(restaurant.address || "");
      setDescription(restaurant.description || "");
      setImagesUrl(restaurant.banners || "");
      setExistingBanners(restaurant.banners || []);
    }
  }, [restaurant]);

  const handleImagePicker = async (file: File) => {
    if (!(file instanceof File)) {
      console.error("Invalid file type", file);
      return;
    }
    const url = URL.createObjectURL(file);
    if (type == "avatar") {
      setAvatarUrl(url);
      setAvatarFile(file);
    } else {
      setImagesFile((prev) => [...prev, file]);
      setImagesUrl((prev) => [...prev, url]);
    }
  };

  const handleRemoveBanner = (url: string, index: number) => {
    setImagesUrl((prev) => prev.filter((_, i) => i !== index));
    setExistingBanners((prev) => prev.filter((item) => item !== url));
    setImagesFile((prev) => prev.filter((_, i) => imagesUrl[i] !== url));
  };

  return (
    <View className="bg-white h-full">
      {/* header */}
      <View className="flex-row w-full h-14 bg-white items-center px-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => route.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-2xl text-center flex-1">
          Edit Restaurant
        </Text>
        <View className="w-2" />
      </View>

      <ScrollView className="relative flex-1 flex-col w-full">
        <View className="flex-1 flex-col items-center w-full p-8">
          <View className="w-2/5 aspect-square relative">
            <View className="w-full h-full bg-slate-200 rounded-lg overflow-hidden">
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <Image className="w-full h-full" resizeMode="cover" />
              )}
            </View>
            <TouchableHighlight
              onPress={() => {
                setShowModal(true);
                setType("avatar");
              }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-customYellow p-2 rounded-full"
              underlayColor="#FFD700"
            >
              <Ionicons name="camera" size={24} color="white" />
            </TouchableHighlight>
          </View>

          <View className="w-full flex gap-2">
            <Text className="text-slate-900 font-medium text-lg mt-4">
              Restaurant Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              className="w-full p-2 border border-slate-400 rounded-lg"
              placeholder="Enter restaurant name"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View className="w-full flex gap-2">
            <Text className="text-slate-900 font-medium text-lg mt-4">
              Describe
            </Text>
            <TextInput
              multiline
              value={description}
              onChangeText={setDescription}
              numberOfLines={4}
              className="w-full p-2 border border-slate-400 h-40 rounded-lg"
              placeholder="Enter description"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View className="w-full flex gap-2">
            <Text className="text-slate-900 font-medium text-lg mt-4">
              Banner
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex flex-row gap-4 h-max w-full"
            >
              {imagesUrl.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="w-32 h-24 bg-slate-300 relative mr-2"
                  onPress={() => setSelectedBannerIndex(index)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: item }}
                    resizeMode="cover"
                    className="h-full w-full rounded"
                  />
                  {selectedBannerIndex === index && (
                    <TouchableOpacity
                      onPress={() => handleRemoveBanner(item, index)}
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                    >
                      <Ionicons name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
              <TouchableHighlight
                onPress={() => {
                  setShowModal(true);
                  setType("banner");
                }}
                className="w-48 h-40 bg-slate-200 rounded-md"
              >
                <View className="w-full h-full flex justify-center items-center">
                  <Ionicons name="add" size={36} color="white" />
                </View>
              </TouchableHighlight>
            </ScrollView>
          </View>

          {/* Address & Map */}
          <View className="w-full flex gap-2">
            <Text className="text-slate-900 font-medium text-lg mt-4">
              Address
            </Text>
            <TextInput
              className="w-full p-2 border border-slate-400 rounded-lg"
              placeholder="Enter address"
              placeholderTextColor="#94a3b8"
              value={address}
              onChangeText={setAddress}
            />
            {/* <MapView>
                className='w-full h-52'
                initialRegion={{
                  latitude: 10.762622,
                  longitude: 106.660172,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={handlePress}>
                {selectedLocation && (
                  <Marker
                    coordinate={selectedLocation}
                    title='Selected Location'
                  />
                )}
              </MapView> */}
          </View>
        </View>
        <TouchableOpacity className="bg-customYellow w-max px-4 py-2 rounded-lg mx-auto mb-4">
          <Text
            onPress={handleSubmit}
            className="text-white font-medium text-lg text-center"
          >
            Save
          </Text>
        </TouchableOpacity>
        {showModal && (
          <UploadImageModal
            setShowModal={setShowModal}
            type={type}
            handleImagePicker={handleImagePicker}
          />
        )}
      </ScrollView>
    </View>
  );
}
