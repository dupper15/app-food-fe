import { CustomToast } from "@/app/components/toast";
import { RestaurantData } from "@/interfaces/RestaurantInterface";
import { fetchRestaurantByOwner } from "@/services/api/restaurantApi";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export default function EditRestaurant() {
  const route = useRouter();

  const [restaurant, setRestaurant] = useState<RestaurantData>();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState([]);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [avatar, setAvatar] = useState();

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("address", address);
    for (const file of image) {
      formData.append("images", file, "image.jpg");
    }
    // submitMutation.mutate(formData);

    const formDataAvatar = new FormData();
    formDataAvatar.append("images", avatar, "image.jpg");
    // avatarMutation.mutate(formDataAvatar);
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

  useEffect(() => {
    const fetchOwnerId = async () => {
      const id = await AsyncStorage.getItem("owner_id");
      if (id) {
        fetchDetailMutation.mutate(id);
      }
    };
    fetchOwnerId();
  }, []);

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

      <View className="flex-1 flex-col items-center w-full p-8">
        <View className="w-2/5 aspect-square relative">
          <View className="w-full h-full bg-slate-200 rounded-lg overflow-hidden">
            <Image
              source={{ uri: restaurant?.banners?.[0] }}
              className="w-full h-full"
              resizeMode="cover"
            />
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
            onChangeText={setName}
            className="w-full p-2 border border-slate-400 rounded-lg"
            placeholder={restaurant?.name}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View className="w-full flex gap-2">
          <Text className="text-slate-900 font-medium text-lg mt-4">
            Describe
          </Text>
          <TextInput
            multiline
            onChangeText={setDescription}
            numberOfLines={4}
            className="w-full p-2 border border-slate-400 h-40 rounded-lg"
            placeholder={restaurant?.description}
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
            {restaurant?.banners.map((item, index) => (
              <View key={index} className="w-32 h-24 bg-slate-300">
                <Image
                  source={{
                    uri: item,
                  }}
                  resizeMode="cover"
                  className="h-full w-full"
                />
              </View>
            ))}
            <TouchableHighlight
              onPress={() => {
                setShowModal(true);
                setType("banner");
              }}
              className="w-48 h-40 bg-slate-200 rounded-md"
            >
              <View className="w-full h-full flex justify-center items-center">
                <Ionicons name="add" size={36} color="white" />{" "}
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
            placeholder={restaurant?.address}
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
    </View>
  );
}
