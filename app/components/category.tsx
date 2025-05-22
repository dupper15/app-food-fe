import { fetchAllCategory } from "@/services/api/categoryApi";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
      console.log("test", data.data);
      setCategory(data.data);
    },
    onError: (error) => {
      console.error("Error fetching categories:", error);
    },
  });
  useEffect(() => {
    getCategoryMutation.mutate();
  }, []);
  return (
    <ScrollView
      horizontal
      className='flex-row gap-4'
      showsHorizontalScrollIndicator={false}>
      {category.length > 0 &&
        category.map((item) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => handlePickCriteria(item._id, item.name)}
            className='flex-1 gap-2 h-max mx-2'>
            <View className='rounded-full p-2 w-14 h-14 bg-customYellow'>
              <Image
                source={{ uri: item.image }}
                className='w-full h-full'
                resizeMode='cover'
              />
            </View>
            <Text className='text-center text-slate-900 font-normal w-14 break-words'>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};

export default Category;
