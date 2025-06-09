import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface LocationIndicatorProps {
  locationSource: string;
  addressName?: string;
  onChangeLocation: () => void;
}

const LocationIndicator = ({
  locationSource,
  addressName,
  onChangeLocation,
}: LocationIndicatorProps) => {
  return (
    <View className="flex-row items-center bg-white p-3 rounded-lg mb-3">
      <Icon
        name={locationSource === "device" ? "my-location" : "place"}
        size={20}
        color="#facc15"
      />
      <Text className="ml-2 text-gray-600 flex-1">
        {locationSource === "device"
          ? "Using your current device location"
          : `Using address: ${addressName?.substring(0, 30)}${
              addressName && addressName.length > 30 ? "..." : ""
            }`}
      </Text>
      <TouchableOpacity
        className="ml-auto rounded-full p-1"
        onPress={onChangeLocation}
      >
        <Text className="text-customYellow font-medium">Change</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationIndicator;
