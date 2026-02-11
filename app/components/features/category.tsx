import { fetchAllCategory } from "@/apis/categoryApi";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";

type CategoryItem = {
  _id: string;
  name: string;
  image: string;
  isDeleted: boolean;
};

type Props = {
  handlePickCriteria: (id: string, header: string) => void;
};

const Category: React.FC<Props> = ({ handlePickCriteria }) => {
  const [category, setCategory] = useState<CategoryItem[]>([]);

  const getCategoryMutation = useMutation({
    mutationFn: fetchAllCategory,
    onSuccess: (data) => {
      setCategory(data.data);
    },
    onError: (error) => {
      console.error("Error fetching categories:", error);
    },
  });

  useEffect(() => {
    getCategoryMutation.mutate();
  }, []);

  const isLoading = getCategoryMutation.isPending;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 8,
        flexDirection: "row",
        gap: 16,
      }}>
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <View
              key={index}
              style={{ alignItems: "center", marginHorizontal: 8 }}>
              <Placeholder Animation={Fade}>
                <PlaceholderMedia
                  style={{ width: 56, height: 56, borderRadius: 28 }}
                />
                <PlaceholderLine
                  width={56}
                  height={16}
                  style={{ marginTop: 8, borderRadius: 8 }}
                />
              </Placeholder>
            </View>
          ))
        : category.map((item) => (
            <TouchableOpacity
              key={item._id}
              onPress={() => handlePickCriteria(item._id, item.name)}
              style={{ alignItems: "center", marginHorizontal: 8 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  padding: 8,
                  backgroundColor: "#FCD34D",
                }}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: "100%", height: "100%", borderRadius: 28 }}
                  resizeMode='cover'
                />
              </View>
              <Text
                style={{
                  marginTop: 6,
                  width: 56,
                  textAlign: "center",
                  color: "#1E293B",
                  fontWeight: "400",
                  flexWrap: "wrap",
                }}
                numberOfLines={2}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
    </ScrollView>
  );
};

export default Category;
