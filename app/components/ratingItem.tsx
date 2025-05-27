import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RatingInterface } from "@/interfaces/RatingInterface";
import { formatCodeOrder } from "@/utils/format";
import { useMutation } from "@tanstack/react-query";
import { createReply } from "@/services/api/replyApi";
import { CustomToast } from "./toast";
import * as ImagePicker from "expo-image-picker";
import { ReactNativeFile } from "../restaurant/restaurantScreen/editRestaurant";

const RatingItem: React.FC<{
  item: RatingInterface;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}> = ({ item, setRefresh, refresh }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [imagesFile, setImagesFile] = useState<ReactNativeFile[]>([]);

  const replyRating = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      setIsLoading(true);
      return await createReply(id, data);
    },
    onSuccess: () => {
      CustomToast("success", "Success", "Đã phản hồi đánh giá thành công");
      setRefresh(!refresh);
      setReplyText("");
      setImagesFile([]);
      setShowReplyInput(false);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Reply error:", error);
      CustomToast("error", "Error", "Không thể phản hồi đánh giá");
      setIsLoading(false);
    },
  });

  const handleSendReply = () => {
    if (replyText.trim() === "") return;
    const formData = new FormData();
    formData.append("content", replyText);

    for (const file of imagesFile) {
      formData.append("images", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    }
    replyRating.mutate({
      id: item._id,
      data: formData,
    });
  };

  const handleAddImage = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];

        // Create file object for upload
        const file = {
          uri: selectedAsset.uri,
          type: selectedAsset.type || "image/jpeg",
          name: selectedAsset.fileName || `image_${Date.now()}.jpg`,
        };
        setImagesFile((prev) => [...prev, file]);
        setImagesUrl((prev) => [...prev, selectedAsset.uri]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagesFile((prev) => prev.filter((_, i) => i !== index));
    setImagesUrl((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View className="mb-4 p-3 bg-gray-50 rounded-xl shadow-sm">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center mb-2">
          <Image
            source={{ uri: item.customer_id.avatar }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <View>
            <Text className="font-semibold text-base">
              {item.customer_id.name}
            </Text>
            <Text className="text-gray-500 text-xs">
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <Text className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-md">
          {formatCodeOrder(item.order_id)}
        </Text>
      </View>
      <View className="flex-row mb-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const ratingValue = item.rating;

          let iconName: any = "star-outline";

          if (index + 1 <= ratingValue) {
            iconName = "star";
          } else if (index + 0.5 <= ratingValue) {
            iconName = "star-half";
          }

          return (
            <Ionicons key={index} name={iconName} size={18} color="#facc15" />
          );
        })}
      </View>

      <Text className="text-sm mb-2">{item.content}</Text>
      {item.image?.length > 0 && (
        <ScrollView horizontal className="mb-2">
          {item.image.map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: img }}
              className="w-24 h-24 rounded-lg mr-2"
            />
          ))}
        </ScrollView>
      )}
      {item.replies_array?.length > 0 && (
        <View className="mb-2">
          {item.replies_array.map((reply, idx) => (
            <View key={idx} className="items-end mb-1">
              <View className="bg-green-100 px-3 py-2 rounded-xl max-w-[80%]">
                <Text className="text-green-800 text-xs font-bold mb-1">
                  Your repsonse:
                </Text>
                <Text className="text-green-800 text-sm">{reply.content}</Text>
              </View>
              {reply.images?.length > 0 && (
                <ScrollView horizontal className="mb-2">
                  {reply.images.map((img, idx) => (
                    <Image
                      key={idx}
                      source={{ uri: img }}
                      className="w-24 h-24 rounded-lg mr-2"
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          ))}
        </View>
      )}
      <TouchableOpacity
        className={`self-start mt-1 px-4 py-1 rounded-lg ${
          showReplyInput ? "bg-red-500" : "bg-[#FFC515]"
        }`}
        onPress={() => setShowReplyInput(!showReplyInput)}
      >
        <Text className="text-white text-sm">
          {showReplyInput ? "Cancel" : "Reply"}
        </Text>
      </TouchableOpacity>

      {showReplyInput && (
        <View className="mt-2">
          <TextInput
            placeholder="Enter response..."
            value={replyText}
            onChangeText={setReplyText}
            className="border border-gray-300 rounded-lg p-2 mb-2"
            multiline
          />
          {/* Images Section */}
          <View className="mb-2">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {imagesUrl.map((uri, index) => (
                <View key={index} className="relative mr-2">
                  <Image
                    source={{ uri }}
                    className="w-24 h-24 rounded-lg border border-gray-300"
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                  >
                    <Text className="text-white text-xs font-bold">×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {imagesUrl.length < 3 && (
                <TouchableOpacity
                  onPress={handleAddImage}
                  className="w-24 h-24 border-2 border-dashed border-gray-400 rounded-lg items-center justify-center"
                >
                  <Text className="text-2xl text-gray-500">+</Text>
                  <Text className="text-xs text-gray-500 mt-1">Add Photo</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          <TouchableOpacity
            onPress={handleSendReply}
            className="bg-green-500 px-4 py-2 rounded-lg self-start"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-white text-sm">Send</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default RatingItem;
