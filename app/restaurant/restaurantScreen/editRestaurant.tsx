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
import { useDispatch, useSelector } from "react-redux";
import { getDetailOwner, setAvatarRes } from "@/services/api/owner";
import UploadImageModal from "@/app/components/uploadImageModal";
import { ActivityIndicator } from "react-native-paper";
import { updateRestaurant } from "@/features/counter/restaurantSlice";
import { setUser } from "@/features/counter/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ReactNativeFile = {
  uri: string;
  name: string;
  type: string;
};

export default function EditRestaurant() {
  const dispatch = useDispatch();

  const route = useRouter();
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [res, setRes] = useState<RestaurantData>();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("");
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [imagesFile, setImagesFile] = useState<ReactNativeFile[]>([]);
  const [avatarFile, setAvatarFile] = useState<ReactNativeFile>();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [selectedBannerIndex, setSelectedBannerIndex] = useState<number | null>(
    null
  );
  const [existingBanners, setExistingBanners] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const id = await AsyncStorage.getItem("owner_id");
      if (id) {
        setOwnerId(id);
        fetchDetailMutation.mutate(id);
        fetchDetailOwnerMutation.mutate(id);
      } else {
        setOwnerId(null);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (res?._id) {
      setName(res.name || "");
      setAddress(res.address || "");
      setDescription(res.description || "");
      setImagesUrl(res.banners || []);
      setExistingBanners(res.banners || []);
    }
  }, [res]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name || "");
    formData.append("description", description || "");
    formData.append("address", address || "");
    for (const file of imagesFile) {
      formData.append("banners", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    }
    for (const url of existingBanners) {
      formData.append("bannersRemaining", url);
    }
    editRestaurantMutation.mutate({
      id: res?._id || "",
      data: formData,
    });

    const formDataAvatar = new FormData();
    if (avatarFile) {
      formDataAvatar.append("images", {
        uri: avatarFile.uri,
        name: avatarFile.name,
        type: avatarFile.type,
      } as any);
    }
    formDataAvatar.append("owner_id", ownerId || "");
    avatarMutation.mutate(formDataAvatar);

    dispatch(
      updateRestaurant({
        name: name,
      })
    );

    dispatch(
      setUser({
        userId: ownerId,
        image: avatarUrl,
      })
    );

    setIsLoading(true);
  };

  const fetchDetailMutation = useMutation({
    mutationFn: async (id: string) => {
      return await fetchRestaurantByOwner(id);
    },
    onSuccess: (data: any) => {
      setRes(data.data);
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "An unknown error occurred";
      CustomToast("error", "Error", errorMessage);
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
      const errorMessage = error?.message || "An unknown error occurred";
      CustomToast("error", "Error", errorMessage);
    },
  });

  const editRestaurantMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      return await editRestaurant(id, data);
    },
    onSuccess: (data: any) => {
      setRes(data.data);
      setIsLoading(false);
      CustomToast("success", "Success", "Updated restaurant successfully!");
    },
    onError: () => {
      console.error = () => {};
      setIsLoading(false);
      CustomToast("error", "Error", "Failed to save changes! Please try again");
    },
  });

  const avatarMutation = useMutation({
    mutationFn: setAvatarRes,
    onSuccess: (data) => {
      setAvatarUrl(data.avatar);
      setIsLoading(false);
    },
    onError: () => {
      console.error = () => {};
      setIsLoading(false);
      CustomToast("error", "Error", "Failed to save changes! Please try again");
    },
  });

  const handleImagePicker = async (file: ReactNativeFile, uri: string) => {
    if (type === "avatar") {
      setAvatarUrl(uri);
      setAvatarFile(file);
    } else {
      setImagesFile((prev) => [...prev, file]);
      setImagesUrl((prev) => [...prev, uri]);
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

      {isLoading && (
        <View className="absolute inset-0 justify-center items-center bg-white/90">
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      )}

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
          </View>
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-customYellow w-max px-4 py-2 rounded-lg mx-auto mb-4"
        >
          <Text className="text-white font-medium text-lg text-center">
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
