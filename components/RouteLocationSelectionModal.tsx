import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { getCustomerInfo } from "@/services/api/userApi";
import { useMutation } from "@tanstack/react-query";

interface AddressCoordinate {
  address: string;
  latitude: number;
  longitude: number;
  _id: string;
}

interface RouteLocationSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  onSelectLocation: (location: {
    latitude: number;
    longitude: number;
    address?: string;
    title?: string;
  }) => void;
  title?: string;
  purpose?: "start" | "destination";
}

const RouteLocationSelectionModal = ({
  visible,
  onClose,
  userId,
  onSelectLocation,
  title = "Select Location",
  purpose = "start",
}: RouteLocationSelectionModalProps) => {
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
      checkLocationPermission();
    }
  }, [visible, userId]);

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

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      onSelectLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        title: purpose === "start" ? "Your Current Location" : "Destination",
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
    if (address && address.latitude && address.longitude) {
      onSelectLocation({
        latitude: address.latitude,
        longitude: address.longitude,
        address: address.address,
        title: address.address,
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
            <Text className="text-xl font-bold">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
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
            <Ionicons name="locate" size={24} color="#2196F3" />
            <View className="flex-1 ml-3">
              <Text className="text-lg font-medium">Use current location</Text>
              <Text className="text-gray-500 text-sm">
                {locationPermissionStatus === "granted"
                  ? `Use your device's current location`
                  : "Tap to grant location permission"}
              </Text>
            </View>
            {isGettingCurrentLocation && (
              <ActivityIndicator size="small" color="#2196F3" />
            )}
          </TouchableOpacity>

          <View>
            <Text className="text-lg font-medium mb-2">Saved Addresses</Text>
            {isLoadingAddresses ? (
              <View className="h-64 justify-center items-center">
                <ActivityIndicator size="large" color="#2196F3" />
                <Text className="mt-2 text-gray-500">
                  Loading your addresses...
                </Text>
              </View>
            ) : addressCoordinates && addressCoordinates.length > 0 ? (
              <>
                <Text className="text-sm text-gray-500 mb-2">
                  {addressCoordinates.length} addresses found
                </Text>

                <ScrollView className="max-h-96">
                  {addressCoordinates.map((addr, index) => (
                    <TouchableOpacity
                      key={addr._id || `address-${index}`}
                      className="p-4 border-b border-gray-200"
                      onPress={() => handleSelectAddress(addr)}
                    >
                      <View className="flex-row items-center">
                        <Ionicons name="location" size={20} color="#2196F3" />
                        <Text className="text-lg ml-2 flex-1">
                          {addr.address}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
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

export default RouteLocationSelectionModal;
