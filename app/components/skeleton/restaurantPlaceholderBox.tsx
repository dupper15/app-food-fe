import React from "react";
import { Dimensions, View } from "react-native";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  ShineOverlay,
} from "rn-placeholder";

const { width } = Dimensions.get("window");

const RestaurantPlaceholderBox = () => {
  return (
    <View
      style={{
        width: width * 0.45,
        height: width * 0.5,
        backgroundColor: "white",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 8,
      }}>
      <Placeholder Animation={ShineOverlay}>
        <PlaceholderMedia
          style={{
            width: width * 0.45,
            height: (width * 16) / 9,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />

        <View style={{ padding: 8 }}>
          <PlaceholderLine width={80} height={20} />
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}>
          <PlaceholderLine width={20} height={12} />
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            backgroundColor: "#FCD34D",
            padding: 8,
            borderRadius: 999,
            opacity: 0.5,
          }}>
          <PlaceholderMedia
            style={{ width: 24, height: 24, borderRadius: 12 }}
          />
        </View>
      </Placeholder>
    </View>
  );
};

export default RestaurantPlaceholderBox;
