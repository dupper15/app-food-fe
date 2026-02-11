import { Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import Successful from "./successfull";
import Failed from "./failed";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import {
  fetchAllHistoryFailed,
  fetchAllHistorySuccess,
} from "@/apis/historyApi";
import { HistoryData } from "@/types/HistoryInterface";

export default function History() {
  const [activeTab, setActiveTab] = useState<"successful" | "failed">(
    "successful",
  );

  const restaurantId = useSelector(
    (state: { restaurant: { restaurantId: string } }) =>
      state.restaurant.restaurantId,
  );
  const [refresh, setRefresh] = useState<boolean>(false);
  const [itemsSuccess, setItemsSuccess] = useState<any[]>([]);
  const [itemsFailed, setItemsFailed] = useState<any[]>([]);

  const fetchSuccess = useMutation({
    mutationFn: fetchAllHistorySuccess,
    onSuccess: (data: HistoryData[]) => {
      setItemsSuccess(data.reverse());
    },
    onError: (error) => {
      console.error("Fetch history error", error);
    },
  });

  const fetchFailed = useMutation({
    mutationFn: fetchAllHistoryFailed,
    onSuccess: (data: any[]) => {
      setItemsFailed(data.reverse());
    },
    onError: (error) => {
      console.error("Fetch all failed history error", error);
    },
  });

  useEffect(() => {
    if (restaurantId) {
      fetchSuccess.mutate(restaurantId);
      fetchFailed.mutate(restaurantId);
    }
  }, [restaurantId, refresh]);

  const handleTabChange = (tab: "successful" | "failed") => {
    setActiveTab(tab);
    // Trigger a refresh when tab changes
    setRefresh((prev) => !prev);
  };

  return (
    <View className='h-full flex-col bg-white'>
      {/* tabs */}
      <View className='flex-row justify-around px-4 pt-2 border-b border-gray-200'>
        {/* Successful tab */}
        <TouchableOpacity
          className='flex-1 items-center'
          onPress={() => handleTabChange("successful")}>
          <Text
            className={`text-base font-medium ${
              activeTab === "successful" ? "text-[#FFC515]" : "text-gray-500"
            }`}>
            Successful
          </Text>
          <View
            className={`h-0.5 w-full mt-1 rounded-full ${
              activeTab === "successful" ? "bg-[#FFC515]" : "bg-transparent"
            }`}
          />
        </TouchableOpacity>

        {/* Failed tab */}
        <TouchableOpacity
          className='flex-1 items-center'
          onPress={() => handleTabChange("failed")}>
          <Text
            className={`text-base font-medium ${
              activeTab === "failed" ? "text-[#FFC515]" : "text-gray-500"
            }`}>
            Failed
          </Text>
          <View
            className={`h-0.5 w-full mt-1 rounded-full ${
              activeTab === "failed" ? "bg-[#FFC515]" : "bg-transparent"
            }`}
          />
        </TouchableOpacity>
      </View>

      {/* tab content */}
      <View className='flex-1 px-4'>
        {activeTab === "successful" ? (
          <Successful
            data={itemsSuccess}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        ) : (
          <Failed
            data={itemsFailed}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        )}
      </View>
    </View>
  );
}
