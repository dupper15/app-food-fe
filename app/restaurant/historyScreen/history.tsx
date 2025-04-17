import { Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import Successful from "./successfull";
import Failed from "./failed";

export default function History() {
  const [activeTab, setActiveTab] = useState<"successful" | "failed">(
    "successful"
  );

  return (
    <View className="h-full flex-col bg-white">
      {/* tabs */}
      <View className="flex-row justify-around px-4 pt-2 border-b border-gray-200">
        {/* Successful tab */}
        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => setActiveTab("successful")}
        >
          <Text
            className={`text-base font-medium ${
              activeTab === "successful" ? "text-[#FFC515]" : "text-gray-500"
            }`}
          >
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
          className="flex-1 items-center"
          onPress={() => setActiveTab("failed")}
        >
          <Text
            className={`text-base font-medium ${
              activeTab === "failed" ? "text-[#FFC515]" : "text-gray-500"
            }`}
          >
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
      <View className="flex-1 px-4">
        {activeTab === "successful" ? <Successful /> : <Failed />}
      </View>
    </View>
  );
}
