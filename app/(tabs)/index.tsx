import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { View } from 'react-native';
import { Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className='flex-1 items-center justify-center'>
      <Text className='text-5xl text-red-500 font-bold'>Home Screen</Text> 
    </View>
  );
}
