import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type Props = {
  handlePickCriteria: (id: string, header: string) => void;
};

const CriteriaComponent: React.FC<Props> = ({ handlePickCriteria }) => {
  return (
    <View className='gap-4'>
      <View className='flex-row justify-between items-center gap-4'>
        <TouchableOpacity
          onPress={() => handlePickCriteria("Near me", "Near me")}
          className='flex-1 bg-customYellow rounded-lg p-4 relative pb-10'>
          <Text className='text-black text-lg font-medium'>Near me</Text>
          <Text className='text-black text-sm font-normal'>
            Just in few minutes
          </Text>
          <Icon
            name='location-outline'
            size={40}
            color={"black"}
            style={{ position: "absolute", bottom: 8, right: 8 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePickCriteria("Recommended", "Recommended")}
          className='flex-1 bg-black rounded-lg p-4 relative pb-10'>
          <Text className='text-customYellow text-lg font-medium'>
            Recommended
          </Text>
          <Text className='text-customYellow text-sm font-normal'>
            You may also like
          </Text>
          <Icon
            name='thumbs-up-outline'
            size={40}
            color={"#FFC515"}
            style={{ position: "absolute", bottom: 8, right: 8 }}
          />
        </TouchableOpacity>
      </View>

      <View className='flex-row justify-between items-center gap-4'>
        <TouchableOpacity
          onPress={() => handlePickCriteria("Multiple deals", "Multiple deals")}
          className='flex-1 bg-black rounded-lg p-4 relative pb-10'>
          <Text className='text-customYellow text-lg font-medium'>
            Multiple deals
          </Text>
          <Text className='text-customYellow text-sm font-normal'>
            Save your money
          </Text>
          <Icon
            name='pricetag-outline'
            size={40}
            color={"#FFC515"}
            style={{ position: "absolute", bottom: 8, right: 8 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            handlePickCriteria("Multiple buyers", "Multiple buyers")
          }
          className='flex-1 bg-customYellow rounded-lg p-4 relative pb-10'>
          <Text className='text-black text-lg font-medium'>
            Multiple buyers
          </Text>
          <Text className='text-black text-sm font-normal'>
            Can be consulted
          </Text>
          <Icon
            name='people-outline'
            size={40}
            color={"black"}
            style={{ position: "absolute", bottom: 8, right: 8 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CriteriaComponent;
