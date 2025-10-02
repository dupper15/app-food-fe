import { OrderOngoingRestaurant } from "@/interfaces/OrderInterface";
import { formatDate, formatPrice } from "@/utils/format";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import StatusModal from "./statusModal";

export default function InProgress({
  setCount,
  data,
  refresh,
  setRefresh,
}: {
  setCount: (count: number) => void;
  data: OrderOngoingRestaurant[];
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<OrderOngoingRestaurant | null>(null);

  useEffect(() => {
    setItems(data);
    setCount(data.length);
  }, [data]);

  const handleChangeStatus = (id: string) => {
    setModalVisible(true);
    setSelectedItem(items.find((item) => item._id === id) || null);
  };

  const renderItem = ({ item }: { item: OrderOngoingRestaurant }) => (
    <View className="bg-white p-4 flex-row justify-between items-center mb-3 border-b border-gray-200">
      {/* info */}
      <View className="flex-row items-center flex-1">
        <Image
          source={{ uri: item.customer_id?.avatar }}
          className="w-12 h-12 rounded-full bg-gray-200 mr-3"
        />

        <View className="flex-1 gap-1">
          <Text className="font-bold text-lg">
            {item.customer_id?.name || "Unknown"}
          </Text>
          {/* note */}
          <View className="flex-row gap-2">
            <Text className="font-bold">Note:</Text>
            <Text className="font-semibold text-gray-500">
              {item.note ? item.note : "No note"}
            </Text>
          </View>

          <View className="flex-col flex-wrap gap-1">
            {item.array_item.map((dish, index) => (
              <View key={index} className="flex-row flex-wrap items-center">
                <Text className="text-gray-600 text-sm mr-2">
                  {dish.quantity} x {dish.dish_id.name}
                </Text>

                {dish.topping?.length > 0 && (
                  <Text className="text-gray-600 text-sm">
                    (
                    {dish.topping.map((top, i) => (
                      <Text key={i} className="text-gray-600 text-sm">
                        {top.name}
                        {i < dish.topping.length - 1 ? ", " : ""}
                      </Text>
                    ))}
                    )
                  </Text>
                )}
              </View>
            ))}
          </View>
          <View className="flex-row justify-between">
            <View className="flex-row gap-2">
              <Text className="font-bold">Total price:</Text>
              <Text className="text-[#389C9A] text-md font-bold mr-3">
                {formatPrice(item.total_price)}
              </Text>
            </View>
            <Text className="text-gray-600 text-sm">
              {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>
      {/* action button */}
      <View className="flex-row space-x-2 ml-3">
        <TouchableOpacity
          onPress={() => handleChangeStatus(item._id)}
          className="p-1 rounded-full bg-[#FFC515] "
        >
          <Feather name="edit-2" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View>
      <FlatList
        data={items}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-4">
            No order in progress.
          </Text>
        }
      />
      <StatusModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={selectedItem}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </View>
  );
}
