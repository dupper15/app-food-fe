import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Asset } from "expo-asset/build/Asset";

const Category: React.FC = () => {
  return (
    <ScrollView
      horizontal
      className='flex-row gap-4 h-0'
      showsHorizontalScrollIndicator={false}>
      <TouchableOpacity className='flex-1 gap-2 h-max mx-2'>
        <View className='rounded-full p-2 w-14 h-14 bg-customYellow'>
          <Image
            source={{
              uri: Asset.fromModule(require("../../assets/images/monNuoc.png"))
                .uri,
            }}
            className='w-full h-full'
            resizeMode='cover'
          />
        </View>
        <Text className='text-center text-slate-900 font-normal w-14 break-words'>
          Món nước
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className='flex-1 gap-2 h-max mx-2'>
        <View className='rounded-full p-2 w-14 h-14 bg-customYellow'>
          <Image
            source={{
              uri: Asset.fromModule(require("../../assets/images/com.png")).uri,
            }}
            className='w-full h-full'
            resizeMode='cover'
          />
        </View>
        <Text className='text-center text-slate-900 font-normal w-14 break-words'>
          Cơm
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className='flex-1 gap-2 h-max mx-2'>
        <View className='rounded-full p-2 w-14 h-14 bg-customYellow'>
          <Image
            source={{
              uri: Asset.fromModule(
                require("../../assets/images/thucAnNhanh.png")
              ).uri,
            }}
            className='w-full h-full'
            resizeMode='cover'
          />
        </View>
        <Text className='text-center text-slate-900 font-normal w-14 break-words'>
          Thức ăn nhanh
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className='flex-1 gap-2 h-max mx-2'>
        <View className='rounded-full p-2 w-14 h-14 bg-customYellow'>
          <Image
            source={{
              uri: Asset.fromModule(require("../../assets/images/lau.png")).uri,
            }}
            className='w-full h-full'
            resizeMode='cover'
          />
        </View>
        <Text className='text-center text-slate-900 font-normal w-14 break-words'>
          Lẩu & Nướng
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className='flex-1 gap-2 h-max mx-2'>
        <View className='rounded-full p-2 w-14 h-14 bg-customYellow'>
          <Image
            source={{
              uri: Asset.fromModule(require("../../assets/images/doAnNhe.png"))
                .uri,
            }}
            className='w-full h-full'
            resizeMode='cover'
          />
        </View>
        <Text className='text-center text-slate-900 font-normal w-14 break-words'>
          Đồ ăn nhẹ
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className='flex-1 gap-2 h-max mx-2'>
        <View className='rounded-full p-2 w-14 h-14 bg-customYellow'>
          <Image
            source={{
              uri: Asset.fromModule(require("../../assets/images/monChay.png"))
                .uri,
            }}
            className='w-full h-full'
            resizeMode='cover'
          />
        </View>
        <Text className='text-center text-slate-900 font-normal w-14 break-words'>
          Món chay
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className='flex-1 gap-2 h-max mx-2'>
        <View className='rounded-full p-2 w-14 h-14 bg-customYellow'>
          <Image
            source={{
              uri: Asset.fromModule(require("../../assets/images/doAnNhe.png"))
                .uri,
            }}
            className='w-full h-full'
            resizeMode='cover'
          />
        </View>
        <Text className='text-center text-slate-900 font-normal w-14 break-words'>
          Đồ ăn nhẹ
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className='flex-1 gap-2 h-max mx-2'>
        <View className='rounded-full p-2 w-14 h-14 bg-customYellow'>
          <Image
            source={{
              uri: Asset.fromModule(require("../../assets/images/monKhac.png"))
                .uri,
            }}
            className='w-full h-full'
            resizeMode='cover'
          />
        </View>
        <Text className='text-center text-slate-900 font-normal w-14 break-words'>
          Món khác
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Category;
