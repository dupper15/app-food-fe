import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Hoặc bất kỳ icon nào bạn muốn sử dụng

interface AverageRatingProps {
  rating: number; // Rating trung bình
}

const AverageRating: React.FC<AverageRatingProps> = ({ rating }) => {
  // const fullStars = Math.floor(rating); // Số sao đầy đủ
  // const halfStars = rating % 1 !== 0 ? 1 : 0; // Kiểm tra nếu có sao nửa
  // const emptyStars = 5 - fullStars - halfStars; // Số sao rỗng

  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm flex-row justify-between">
      <View className="flex-1">
        <Text className="text-lg font-bold mb-2">Average rating</Text>
        <View className="flex-row items-center gap-3">
          <Text className="text-2xl font-bold text-[#389C9A] mb-1">
            {rating.toFixed(1)} / 5
          </Text>
          <View className="w-12 h-12 bg-yellow-200 rounded-full items-center justify-center">
            <Icon name="star" size={24} color="#000" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default AverageRating;
