import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableHighlight,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getAddressFromCoordinates } from "@/utils/getAddressFromCoordinates";
import { useMutation } from "@tanstack/react-query";
import { createRestaurant, setAvatarRes } from "@/services/api/restaurantApi";
import UploadImageModal from "../components/uploadImageModal";
import { useSelector } from "react-redux";
import { CustomToast } from "../components/toast";
// import MapView, { Marker } from "react-native-maps";
const CreateRestaurantScreen: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState([]);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [avatar, setAvatar] = useState();
  const userId = useSelector(
    (state: { user: { userId: string } }) => state.user.userId
  );
  useEffect(() => {
    CustomToast("error", "Error", `User id: ${userId}`);
  }, [userId]);
  const submitMutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: (data) => {
      console.log("success", data);
      CustomToast("success", "Success", "Upload success");
    },
    onError: (data) => {
      console.log("error", data);
      CustomToast("error", "Error", "Upload failed");
    },
  });
  const avatarMutation = useMutation({
    mutationFn: setAvatarRes,
    onSuccess: (data) => {
      console.log("success", data);
      CustomToast("success", "Success", "Upload success");
    },
    onError: (data) => {
      console.log("error", data);
      CustomToast("error", "Error", "Upload failed");
    },
  });
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("owner_id", userId);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("address", address);
    for (const file of image) {
      formData.append("images", file, "image.jpg");
    }
    submitMutation.mutate(formData);

    const formDataAvatar = new FormData();
    formDataAvatar.append("owner_id", userId);
    formDataAvatar.append("images", avatar, "image.jpg");
    avatarMutation.mutate(formDataAvatar);
  };
  const handlePress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const fetAddress = await getAddressFromCoordinates(latitude, longitude);
    setAddress(fetAddress);
    setSelectedLocation({ latitude, longitude });
  };
  const handleImagePicker = async (file: File) => {
    if (!(file instanceof File)) {
      console.error("Invalid file type", file);
      return;
    }
    if (type == "avatar") {
      setAvatar(file);
    } else {
      setImage((prev) => [...prev, file]);
    }
  };
  return (
    <ScrollView className='bg-slate-100 relative flex-1 flex-col w-full'>
      <View className='bg-white w-full h-max p-4'>
        <Text className='text-slate-900 font-medium text-xl text-center'>
          Restaurant information
        </Text>
      </View>
      <View className='flex-1 flex-col items-center w-full p-8'>
        <View className='w-2/5 aspect-square relative'>
          <View className='w-full h-full bg-slate-200 rounded-lg overflow-hidden'>
            {avatar ? (
              <Image
                source={{ uri: URL.createObjectURL(avatar) }}
                className='w-full h-full'
                resizeMode='cover'
              />
            ) : (
              <Image className='w-full h-full' resizeMode='cover' />
            )}{" "}
          </View>
          <TouchableHighlight
            onPress={() => {
              setShowModal(true);
              setType("avatar");
            }}
            className='absolute -bottom-4 left-1/2 -translate-x-1/2 bg-customYellow p-2 rounded-full'
            underlayColor='#FFD700'>
            <Ionicons name='camera' size={24} color='white' />
          </TouchableHighlight>
        </View>

        <View className='w-full flex gap-2'>
          <Text className='text-slate-900 font-medium text-lg mt-4'>
            Restaurant Name
          </Text>
          <TextInput
            onChangeText={setName}
            className='w-full p-2 border border-slate-400 rounded-lg'
            placeholder='Enter restaurant name'
            placeholderTextColor='#94a3b8'
          />
        </View>

        <View className='w-full flex gap-2'>
          <Text className='text-slate-900 font-medium text-lg mt-4'>
            Describe
          </Text>
          <TextInput
            multiline
            onChangeText={setDescription}
            numberOfLines={4}
            className='w-full p-2 border border-slate-400 h-40 rounded-lg'
            placeholder='Enter description'
            placeholderTextColor='#94a3b8'
          />
        </View>
        <View className='w-full flex gap-2'>
          <Text className='text-slate-900 font-medium text-lg mt-4'>
            Banner
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className='flex flex-row gap-4 h-max w-full'>
            {image.map((item, index) => (
              <View key={index} className='w-32 h-24 bg-slate-300'>
                <Image
                  source={{
                    uri: URL.createObjectURL(item),
                  }}
                  resizeMode='cover'
                  className='h-full w-full'
                />
              </View>
            ))}
            <TouchableHighlight
              onPress={() => {
                setShowModal(true);
                setType("banner");
              }}
              className='w-48 h-40 bg-slate-200 rounded-md'>
              <View className='w-full h-full flex justify-center items-center'>
                <Ionicons name='add' size={36} color='white' />{" "}
              </View>
            </TouchableHighlight>
          </ScrollView>
        </View>

        {/* Address & Map */}
        <View className='w-full flex gap-2'>
          <Text className='text-slate-900 font-medium text-lg mt-4'>
            Address
          </Text>
          <TextInput
            className='w-full p-2 border border-slate-400 rounded-lg'
            placeholder='Enter address'
            placeholderTextColor='#94a3b8'
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
      <TouchableOpacity className='bg-customYellow w-max px-4 py-2 rounded-lg mx-auto mb-4'>
        <Text
          onPress={handleSubmit}
          className='text-white font-medium text-lg text-center'>
          Submit
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
  );
};

export default CreateRestaurantScreen;
