import { View } from "react-native";
import { Placeholder, PlaceholderLine, Fade } from "rn-placeholder";

const CategoryButtonSkeleton = () => {
  return (
    <View
      className='flex-row justify-center items-center bg-transparent'
      style={{ paddingVertical: 8, gap: 12 }}>
      {Array.from({ length: 3 }, (_, index) => (
        <Placeholder key={index} Animation={Fade}>
          <View
            className='rounded-lg bg-white'
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              width: 90,
              height: 36,
              justifyContent: "center",
            }}>
            <PlaceholderLine
              width={60}
              height={10}
              style={{ alignSelf: "center", borderRadius: 4 }}
              noMargin
            />
          </View>
        </Placeholder>
      ))}
    </View>
  );
};

export default CategoryButtonSkeleton;
