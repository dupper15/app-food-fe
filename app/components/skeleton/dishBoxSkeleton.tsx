import { View, Dimensions } from "react-native";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";

const { width } = Dimensions.get("window");

const DishBoxSkeleton = () => {
  return (
    <View
      className='bg-white rounded-lg border border-slate-200'
      style={{ width: width * 0.45 }}>
      <Placeholder Animation={Fade}>
        <PlaceholderMedia
          style={{ height: 128, width: "100%", borderRadius: 8 }}
        />
        <View className='p-2'>
          <PlaceholderLine width={80} height={15} />
          <PlaceholderLine width={40} height={15} style={{ marginTop: 8 }} />
        </View>
      </Placeholder>
    </View>
  );
};

export default DishBoxSkeleton;
