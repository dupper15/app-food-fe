import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const PrivacyPage = () => {
  const router = useRouter();
  const handleRouteBack = () => {
    router.back();
  };
  return (
    <View className='flex-1 bg-slate-100 '>
      <View className='w-full py-4 px-6 bg-white shadow-sm flex-row items-center gap-4'>
        <TouchableOpacity onPress={handleRouteBack}>
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
        <Text className='text-2xl font-semibold text-gray-800'>
          Privacy Policy
        </Text>
      </View>

      <ScrollView className='px-6 py-4 flex-1'>
        <Text className='text-base text-slate-700 mb-4'>
          We are committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, and protect your personal information
          when using our app.
        </Text>

        <Text className='text-lg font-semibold text-slate-800 mb-2'>
          1. Information We Collect
        </Text>
        <Text className='text-base text-slate-700 mb-4'>
          We may collect personal information such as your name, email address,
          phone number, password, and any other details necessary to provide our
          services.
        </Text>

        <Text className='text-lg font-semibold text-slate-800 mb-2'>
          2. How We Use Your Information
        </Text>
        <Text className='text-base text-slate-700 mb-4'>
          The collected data is used to create and manage user accounts, provide
          customer support, improve our services, and communicate updates or
          changes.
        </Text>

        <Text className='text-lg font-semibold text-slate-800 mb-2'>
          3. Data Security
        </Text>
        <Text className='text-base text-slate-700 mb-4'>
          We implement technical and organizational measures to safeguard your
          data against unauthorized access, misuse, or disclosure.
        </Text>

        <Text className='text-lg font-semibold text-slate-800 mb-2'>
          4. Information Sharing
        </Text>
        <Text className='text-base text-slate-700 mb-4'>
          We do not share your personal information with third parties except
          when required by law or with your explicit consent.
        </Text>

        <Text className='text-lg font-semibold text-slate-800 mb-2'>
          5. Your Rights
        </Text>
        <Text className='text-base text-slate-700 mb-4'>
          You have the right to access, update, or request deletion of your
          personal information at any time. Please contact us if you wish to do
          so.
        </Text>

        <Text className='text-sm text-center text-slate-500 mt-6'>
          Last updated: May 24, 2025
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyPage;
