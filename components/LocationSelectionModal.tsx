import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Location from "expo-location";
import { getCustomerInfo } from "@/services/api/userApi";
import { useMutation } from "@tanstack/react-query";

interface AddressCoordinate {
  address: string;
  latitude: number;
  longitude: number;
  _id: string;
}

interface LocationSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  onSelectLocation: (location: {
    latitude: number;
    longitude: number;
    source: string;
    addressName?: string;
  }) => void;
}

const LocationSelectionModal = ({
  visible,
  onClose,
  userId,
  onSelectLocation,
}: LocationSelectionModalProps) => {
  const [addressCoordinates, setAddressCoordinates] = useState<
    AddressCoordinate[]
  >([]);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] =
    useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<
    string | null
  >(null);

  const getUserInfoMutation = useMutation({
    mutationFn: getCustomerInfo,
    onSuccess: (data) => {
      console.log("Raw user data:", JSON.stringify(data));

      if (data.addressCoordinates && Array.isArray(data.addressCoordinates)) {
        console.log(
          `Found ${data.addressCoordinates.length} addresses with coordinates`
        );
        setAddressCoordinates(data.addressCoordinates);
      } else {
        console.warn("No valid address coordinates found in the response");
        setAddressCoordinates([]);
      }
      setIsLoadingAddresses(false);
    },
    onError: (error) => {
      console.error("Error fetching user addresses:", error);
      setIsLoadingAddresses(false);
      Alert.alert("Error", "Could not load your addresses. Please try again.");
    },
  });

  useEffect(() => {
    if (visible && userId) {
      setIsLoadingAddresses(true);
      getUserInfoMutation.mutate(userId);

      // Check location permission status when modal opens
      checkLocationPermission();
    }
  }, [visible, userId]);

  // Check if location permission is granted
  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationPermissionStatus(status);
      console.log(`Location permission status: ${status}`);
    } catch (error) {
      console.error("Error checking location permission:", error);
      setLocationPermissionStatus("error");
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermissionStatus(status);
      return status;
    } catch (error) {
      console.error("Error requesting location permission:", error);
      return "error";
    }
  };

  const getCurrentLocation = async () => {
    setIsGettingCurrentLocation(true);

    try {
      // Check or request permission if needed
      let permissionStatus = locationPermissionStatus;

      if (permissionStatus !== "granted") {
        permissionStatus = await requestLocationPermission();
      }

      if (permissionStatus !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this feature.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open Settings",
              onPress: () => {
                // On iOS, this will open app settings
                if (Platform.OS === "ios") {
                  Location.requestForegroundPermissionsAsync();
                }
              },
            },
          ]
        );
        setIsGettingCurrentLocation(false);
        return;
      }

      // Get current position with high accuracy
      console.log("Getting current position...");
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeInterval: 5000,
      });

      console.log("Current position:", JSON.stringify(location.coords));

      // Select this location and close modal
      onSelectLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        source: "device",
      });
      onClose();
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert(
        "Location Error",
        "Unable to get your current location. Please try again or select a saved address."
      );
    } finally {
      setIsGettingCurrentLocation(false);
    }
  };

  const handleSelectAddress = (address: AddressCoordinate) => {
    console.log("Selected address:", address);
    if (address && address.latitude && address.longitude) {
      onSelectLocation({
        latitude: address.latitude,
        longitude: address.longitude,
        source: "saved",
        addressName: address.address,
      });
      onClose();
    } else {
      Alert.alert(
        "Invalid Address",
        "This address does not have valid coordinates."
      );
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-xl p-5 h-2/3">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Select Location</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Current Location Option */}
          <TouchableOpacity
            className={`flex-row items-center p-4 ${
              locationPermissionStatus === "granted"
                ? "bg-gray-100"
                : "bg-yellow-50"
            } rounded-lg mb-4`}
            onPress={getCurrentLocation}
            disabled={isGettingCurrentLocation}
          >
            <Icon name="my-location" size={24} color="#facc15" />
            <View className="flex-1 ml-3">
              <Text className="text-lg font-medium">Use current location</Text>
              <Text className="text-gray-500 text-sm">
                {locationPermissionStatus === "granted"
                  ? "Get restaurants near your device location"
                  : "Tap to grant location permission"}
              </Text>
            </View>
            {isGettingCurrentLocation && (
              <ActivityIndicator size="small" color="#facc15" />
            )}
          </TouchableOpacity>

          <View>
            <Text className="text-lg font-medium mb-2">Saved Addresses</Text>
            {isLoadingAddresses ? (
              <View className="h-64 justify-center items-center">
                <ActivityIndicator size="large" color="#facc15" />
                <Text className="mt-2 text-gray-500">
                  Loading your addresses...
                </Text>
              </View>
            ) : addressCoordinates && addressCoordinates.length > 0 ? (
              <>
                <Text className="text-sm text-gray-500 mb-2">
                  {addressCoordinates.length} addresses found
                </Text>

                {/* Display saved addresses */}
                <FlatList
                  data={addressCoordinates}
                  keyExtractor={(addr) => addr._id || `address-${addr.address}`}
                  renderItem={({ item: addr }) => (
                    <TouchableOpacity
                      className="p-4 border-b border-gray-200"
                      onPress={() => handleSelectAddress(addr)}
                    >
                      <View className="flex-row items-center">
                        <Icon name="place" size={20} color="#facc15" />
                        <Text className="text-lg ml-2 flex-1">
                          {addr.address}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </>
            ) : (
              <View className="h-64 justify-center items-center">
                <Text className="text-gray-500">No saved addresses found</Text>
                <Text className="text-gray-500 mt-1">
                  Add addresses in your profile
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LocationSelectionModal;
