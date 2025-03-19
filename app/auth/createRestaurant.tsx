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
import { createRestaurant } from "@/services/api/restaurantApi";
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
  const [address, setAddress] = useState("");
  const [banner, setBanner] = useState<File[]>([]);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [description, setDescription] = useState("");
  const userId = useSelector(
    (state: { user: { userId: string } }) => state.user.userId
  );
  useEffect(() => {
    CustomToast("error", "Error", `User id: ${userId}`);
  }, [userId]);
  const submitMutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => {},
    onError: () => {},
  });
  const handleSubmit = () => {
    if (!avatar) return;
    submitMutation.mutate({
      address,
      avatar,
      banner,
      description,
      ownerId: userId,
      name: restaurantName,
    });
  };
  const [type, setType] = useState("");
  const handlePress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const fetAddress = await getAddressFromCoordinates(latitude, longitude);
    setAddress(fetAddress);
    setSelectedLocation({ latitude, longitude });
  };
  const handleImagePicker = (file: File) => {
    if (type === "avatar") {
      setAvatar(file);
    } else {
      setBanner([...banner, file]);
    }
  };
  return (
    <ScrollView className='bg-slate-100 relative flex-1 flex-col w-full'>
      <View className='bg-white w-full h-max p-4'>
        <Text className='text-slate-900 font-medium text-xl text-center'>
          Fill restaurant information
        </Text>
      </View>
      <View className='flex-1 flex-col items-center w-full p-4'>
        <View className='w-1/3 aspect-square relative'>
          <View className='w-full h-full bg-slate-200 rounded-lg overflow-hidden'>
            <Image className='w-full h-full' resizeMode='cover' />
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
            numberOfLines={4}
            className='w-full p-2 border border-slate-400 rounded-lg'
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
            {[1, 2, 3].map((item) => (
              <View key={item} className='w-32 h-24 bg-slate-300'>
                <Image
                  source={{
                    uri: "https://th.bing.com/th/id/OIP.wE6QST3SXgqK3UhpZVp1zQHaFB?rs=1&pid=ImgDetMain",
                  }}
                  resizeMode='cover'
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ))}
            <TouchableHighlight
              onPress={() => {
                setShowModal(true);
                setType("banner");
              }}
              className='w-32 h-24 bg-slate-300'>
              <Text className='text-white text-5xl font-bold text-center mt-4'>
                +
              </Text>
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
      <TouchableOpacity className='bg-black w-max px-4 py-2 rounded-lg mx-auto mb-4'>
        <Text className='text-customYellow font-medium text-lg text-center'>
          Submit
        </Text>
      </TouchableOpacity>
      {showModal && (
        <UploadImageModal
          setShowModal={setShowModal}
          handleImagePicker={handleImagePicker}
        />
      )}
    </ScrollView>
  );
};

export default CreateRestaurantScreen;
