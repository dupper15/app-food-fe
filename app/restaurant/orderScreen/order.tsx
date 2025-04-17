import { Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import Pending from "./pending";
import InProgress from "./inprogress";

export default function Order() {
  const [activeTab, setActiveTab] = useState<"pending" | "in progress">(
    "pending"
  );
  const [countPending, setCountPending] = useState<number>(0);

  return (
    <View className="h-full flex-col bg-white">
      {/* tabs */}
      <View className="flex-row justify-around px-4 pt-2 border-b border-gray-200">
        {/* Pending tab */}
        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => setActiveTab("pending")}
        >
          <View className="flex-row items-center gap-2">
            <Text
              className={`text-base font-medium ${
                activeTab === "pending" ? "text-[#FFC515]" : "text-gray-500"
              }`}
            >
              Pending
            </Text>

            {countPending > 0 && (
              <View className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500">
                <Text className="text-white text-xs font-bold">
                  {countPending}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* In progress tab */}
        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => setActiveTab("in progress")}
        >
          <Text
            className={`text-base font-medium ${
              activeTab === "in progress" ? "text-[#FFC515]" : "text-gray-500"
            }`}
          >
            In progress
          </Text>
          <View
            className={`h-0.5 w-full mt-1 rounded-full ${
              activeTab === "in progress" ? "bg-[#FFC515]" : "bg-transparent"
            }`}
          />
        </TouchableOpacity>
      </View>

      {/* tab content */}
      <View className="flex-1 px-4">
        {activeTab === "pending" ? (
          <Pending setCount={setCountPending} />
        ) : (
          <InProgress />
        )}
      </View>
    </View>
  );
}
