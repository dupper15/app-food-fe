import { Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import Pending from "./pending";
import InProgress from "./inprogress";
import { useMutation } from "@tanstack/react-query";
import {
  fetchOngoingOrderByRestaurant,
  fetchPendingOrderByRestaurant,
} from "@/apis/orderApi";
import {
  OrderOngoingRestaurant,
  OrderPendingRestaurant,
} from "@/types/OrderInterface";
import { useSelector } from "react-redux";

export default function Order() {
  const [activeTab, setActiveTab] = useState<"pending" | "in progress">(
    "pending",
  );
  const restaurantId = useSelector(
    (state: { restaurant: { restaurantId: string } }) =>
      state.restaurant.restaurantId,
  );
  const [refresh, setRefresh] = useState<boolean>(false);
  const [countInProgress, setCountInProgress] = useState<number>(0);
  const [itemsInProgress, setItemsInProgress] = useState<
    OrderOngoingRestaurant[]
  >([]);
  const [countPending, setCountPending] = useState<number>(0);
  const [itemsPending, setItemsPending] = useState<OrderPendingRestaurant[]>(
    [],
  );

  const fetchOngoing = useMutation({
    mutationFn: fetchOngoingOrderByRestaurant,
    onSuccess: (data: OrderOngoingRestaurant[]) => {
      setItemsInProgress(data.reverse());
      setCountInProgress(data.length);
    },
    onError: (error) => {
      console.error("Fetch history error", error);
    },
  });

  const fetchPending = useMutation({
    mutationFn: fetchPendingOrderByRestaurant,
    onSuccess: (data: OrderPendingRestaurant[]) => {
      setItemsPending(data.reverse());
      setCountPending(data.length);
    },
    onError: (error) => {
      console.error("Fetch history error", error);
    },
  });

  useEffect(() => {
    if (restaurantId) {
      fetchOngoing.mutate(restaurantId);
      fetchPending.mutate(restaurantId);
    }
  }, [restaurantId, refresh]);

  return (
    <View className='h-full flex-col bg-white'>
      {/* tabs */}
      <View className='flex-row justify-around px-4 pt-2 border-b border-gray-200'>
        {/* Pending tab */}
        <TouchableOpacity
          className='flex-1 items-center'
          onPress={() => {
            (setActiveTab("pending"), setRefresh(!refresh));
          }}>
          <View className='flex-row items-center gap-2'>
            <Text
              className={`text-base font-medium ${
                activeTab === "pending" ? "text-[#FFC515]" : "text-gray-500"
              }`}>
              Pending
            </Text>

            {countPending > 0 && (
              <View className='ml-1 px-1.5 py-0.5 rounded-full bg-red-500'>
                <Text className='text-white text-xs font-bold'>
                  {countPending}
                </Text>
              </View>
            )}
          </View>
          <View
            className={`h-0.5 w-full mt-1 rounded-full ${
              activeTab === "pending" ? "bg-[#FFC515]" : "bg-transparent"
            }`}
          />
        </TouchableOpacity>

        {/* In progress tab */}
        <TouchableOpacity
          className='flex-1 items-center'
          onPress={() => {
            (setActiveTab("in progress"), setRefresh(!refresh));
          }}>
          <View className='flex-row items-center gap-2'>
            <Text
              className={`text-base font-medium ${
                activeTab === "in progress" ? "text-[#FFC515]" : "text-gray-500"
              }`}>
              In progress
            </Text>

            {countInProgress > 0 && (
              <View className='ml-1 px-1.5 py-0.5 rounded-full bg-red-500'>
                <Text className='text-white text-xs font-bold'>
                  {countInProgress}
                </Text>
              </View>
            )}
          </View>
          <View
            className={`h-0.5 w-full mt-1 rounded-full ${
              activeTab === "in progress" ? "bg-[#FFC515]" : "bg-transparent"
            }`}
          />
        </TouchableOpacity>
      </View>

      {/* tab content */}
      <View className='flex-1 px-4'>
        {activeTab === "pending" ? (
          <Pending
            setCount={setCountPending}
            data={itemsPending}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        ) : (
          <InProgress
            setCount={setCountInProgress}
            data={itemsInProgress}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        )}
      </View>
    </View>
  );
}
