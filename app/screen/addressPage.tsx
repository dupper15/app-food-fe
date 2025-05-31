import {
  addAddress,
  deleteAddress,
  editAddress,
  getAddresses,
} from "@/services/api/userApi";
import { Ionicons, Feather, Entypo } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import { ActivityIndicator } from "react-native";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";

const AddressPage = () => {
  const router = useRouter();
  const handleRouteBack = () => {
    router.back();
  };

  const userId = useSelector(
    (state: { user: { userId: string } }) => state.user.userId
  );

  const [address, setAddress] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedText(address[index]);
  };
  const getAddressesMutation = useMutation({
    mutationFn: getAddresses,
    onSuccess: (data) => {
      setAddress(data);
    },
    onError: (error) => {
      console.error("Error fetching addresses:", error);
    },
  });
  const editAddressMutation = useMutation({
    mutationFn: editAddress,
    onSuccess: (data) => {
      getAddressesMutation.mutate(userId);
      setEditingIndex(null);
      setEditedText("");
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error editing address:", error);
    },
  });
  const addAddressMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: (data) => {
      getAddressesMutation.mutate(userId);
      setIsAdding(false);
      setNewAddress("");
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error adding address:", error);
    },
  });
  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: (data) => {
      getAddressesMutation.mutate(userId);
      if (editingIndex !== null) {
        setEditingIndex(null);
        setEditedText("");
      }
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error deleting address:", error);
    },
  });
  const handleSave = (index: number) => {
    if (editedText.trim() !== "") {
      setIsLoading(true);
      editAddressMutation.mutate({
        userId,
        prevAddress: address[index],
        newAddress: editedText,
      });
      setEditingIndex(null);
      setEditedText("");
    }
  };

  const handleDelete = (index: number) => {
    setIsLoading(true);
    const data = { userId, address: address[index] };
    deleteAddressMutation.mutate(data);
  };

  const handleAddNewAddress = () => {
    setIsAdding(true);
  };

  const handleSaveNewAddress = () => {
    if (newAddress.trim() !== "") {
      setIsLoading(true);
      addAddressMutation.mutate({ userId, address: newAddress });
      setNewAddress("");
      setIsAdding(false);
    }
  };

  const handleCancelAdd = () => {
    setNewAddress("");
    setIsAdding(false);
  };
  useEffect(() => {
    if (userId) {
      getAddressesMutation.mutate(userId);
    }
  }, [userId]);

  return (
    <View className='flex-1 bg-slate-100'>
      <View className='w-full py-4 px-6 bg-white shadow-sm flex-row items-center gap-4'>
        <TouchableOpacity onPress={handleRouteBack}>
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
        <Text className='text-2xl font-semibold text-gray-800'>
          My Addresses
        </Text>
      </View>

      <ScrollView className='flex-1 px-4 pt-4'>
        {isAdding && (
          <View className='bg-white px-4 py-6 rounded-2xl mb-4 flex-row items-center justify-between gap-2'>
            <View className='flex-row items-start gap-2 flex-1'>
              <Entypo name='location-pin' size={24} color='red' />
              <TextInput
                value={newAddress}
                onChangeText={setNewAddress}
                placeholder='Enter new address'
                className='flex-1 text-gray-800 border-b border-gray-300'
                autoFocus
              />
            </View>
            <View className='flex-row items-center gap-4 ml-2'>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleSaveNewAddress}>
                <Ionicons name='checkmark-outline' size={22} color='#22c55e' />
              </TouchableOpacity>
              <TouchableOpacity disabled={isLoading} onPress={handleCancelAdd}>
                <Ionicons name='close-outline' size={22} color='#f87171' />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!getAddressesMutation.isPending ? (
          address.length === 0 ? (
            <View className='flex-1 justify-center items-center mt-10'>
              <Text className='text-gray-500 text-lg'>No addresses found</Text>
            </View>
          ) : (
            address.map((addr, index) => (
              <View
                key={index}
                className='bg-white px-4 py-6 rounded-2xl mb-4 flex-row items-center justify-between gap-2'>
                <View className='flex-row items-start gap-2 flex-1'>
                  <Entypo name='location-pin' size={24} color='red' />
                  {editingIndex === index ? (
                    <TextInput
                      value={editedText}
                      onChangeText={setEditedText}
                      className='flex-1 text-gray-800 border-b border-gray-300'
                      autoFocus
                    />
                  ) : (
                    <Text className='text-gray-800 flex-1'>{addr}</Text>
                  )}
                </View>
                <View className='flex-row items-center gap-4 ml-2'>
                  {editingIndex === index ? (
                    <TouchableOpacity
                      disabled={isLoading}
                      onPress={() => handleSave(index)}>
                      <Ionicons
                        name='checkmark-outline'
                        size={22}
                        color='#22c55e'
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      disabled={isLoading}
                      onPress={() => handleEdit(index)}>
                      <Feather name='edit-3' size={20} color='#2dd4bf' />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    disabled={isLoading}
                    onPress={() => handleDelete(index)}>
                    <Ionicons name='trash-outline' size={22} color='#facc15' />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )
        ) : (
          Array.from({ length: 3 }).map((_, index) => (
            <Placeholder
              key={index}
              Animation={Fade}
              className='bg-white px-4 py-6 rounded-2xl mb-4 flex-row items-center justify-between gap-2'>
              <View className='flex-row items-start gap-2 flex-1'>
                <PlaceholderMedia
                  style={{ width: 24, height: 24, borderRadius: 12 }}
                />
                <PlaceholderLine width={80} />
              </View>
              <View className='flex-row items-center gap-4 ml-2'>
                <PlaceholderMedia
                  style={{ width: 20, height: 20, borderRadius: 10 }}
                />
                <PlaceholderMedia
                  style={{ width: 20, height: 20, borderRadius: 10 }}
                />
              </View>
            </Placeholder>
          ))
        )}
      </ScrollView>

      <View className='px-4 pb-6 pt-2'>
        <TouchableOpacity
          className='bg-yellow-400 py-4 rounded-xl items-center'
          onPress={handleAddNewAddress}
          disabled={isLoading || isAdding}>
          {isLoading ? (
            <View className='items-center py-4'>
              <ActivityIndicator size='large' color='#facc15' />
            </View>
          ) : (
            <Text className='text-white font-semibold text-xl'>
              Add New Address
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddressPage;
