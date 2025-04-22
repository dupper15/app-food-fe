import React, { useEffect, useState } from "react";
import { View, Text, TouchableHighlight, Image } from "react-native";
import DishBox from "./dishBox";

const CartItem = ({ item }) => (
  <View className='bg-gray-100 p-2 rounded-lg space-y-1'>
    {/* <Image
      source={{ uri: item.dish_id.image }}
      style={{ width: 50, height: 50, borderRadius: 5 }}
    /> */}
    <Text className='font-semibold'>{item.dish_id}</Text>
    {/* <Text>{item.dish_id.price}₫</Text>
    {item.dish_id.topping.map &&
      item.dish_id.topping.map((topping, index) => (
        <Text key={index} className='text-sm pl-2'>
          + {topping.name} - {topping.price}₫
        </Text>
      ))} */}
  </View>
);

const OrderCard = ({ item }) => (
  <View className='bg-gray-100 p-3 rounded-lg space-y-1'>
    <Text className='text-blue-500 font-bold'>{item.restaurant_id.name}</Text>
    {/* <Text>Tổng tiền: {item.total_price}₫</Text>
    <Text>Trạng thái: {item.status}</Text> */}
  </View>
);

const OngoingOrderCard = ({ item }) => (
  <View className='bg-white rounded-lg p-3 space-y-1 shadow'>
    <Text className='text-blue-500 font-bold'>{item.restaurant.name}</Text>
    <Image
      source={{ uri: item.restaurant.owner_id.avatar }}
      style={{ width: 50, height: 50, borderRadius: 25 }}
    />
    <Text>Tổng: {item.total_price}₫</Text>
    <Text>Trạng thái: {item.status}</Text>
  </View>
);

const FunctionContent = ({ content, functionName, result }) => {
  switch (functionName) {
    case "recommend_dish_by_time":
      return (
        <View className='flex-1 gap-4'>
          <Text className='text-gray-800'>{content}</Text>
          {result &&
            Array.isArray(result) &&
            result.length > 0 &&
            result.map((item, index) => <DishBox key={index} dish={item} />)}
        </View>
      );

    case "add_dish_to_cart":
    case "update_cart_item":
    case "remove_cart_item":
    case "place_order":
    case "reorder_previous":
      return (
        <View className='mb-3 px-4 py-2 rounded-lg max-w-[75%] bg-white self-start space-y-1'>
          <Text className='text-gray-800'>{content}</Text>
          <TouchableHighlight className='bg-customYellow rounded-lg p-2'>
            <Text className='text-white'>
              {functionName === "place_order" ||
              functionName === "reorder_previous"
                ? "View my Order"
                : "View my cart"}
            </Text>
          </TouchableHighlight>
        </View>
      );

    case "get_user_cart":
      return (
        <View className='space-y-3'>
          <Text className='font-bold text-lg'>{result.restaurant_id}</Text>
          {result.order_items &&
            result.order_items.map((item, index) => (
              <CartItem key={index} item={item} />
            ))}
        </View>
      );

    case "get_topping_of_restaurant":
      return (
        <View className='mb-3 px-4 py-2 rounded-lg max-w-[75%] bg-white self-start space-y-2'>
          <Text className='text-gray-800'>{content}</Text>
          {result &&
            result.map((item, index) => (
              <View key={index} className='border-b pb-1'>
                <Text>{item.name}</Text>
                <Text className='text-gray-500'>{item.price}₫</Text>
              </View>
            ))}
        </View>
      );

    case "get_order_history":
      return (
        <View className='space-y-3'>
          <Text className='text-gray-800'>{content}</Text>
          {result &&
            result.map((item, index) => <OrderCard key={index} item={item} />)}
        </View>
      );

    case "view_ongoing_orders":
      return (
        <View className='space-y-3'>
          <Text className='text-gray-800'>{content}</Text>
          {result &&
            result.map((item, index) => (
              <OngoingOrderCard key={index} item={item} />
            ))}
        </View>
      );

    default:
      return (
        <Text className='text-red-500 italic'>Function not supported.</Text>
      );
  }
};

const BotFunction = ({ message }) => {
  const [functionName, setFunctionName] = useState("");
  const [result, setResult] = useState(null);
  const [content, setContent] = useState("");
  useEffect(() => {
    const parsedMessage = extractJsonFromContent(message.content);
    if (parsedMessage && typeof parsedMessage === "object") {
      setFunctionName(parsedMessage.functionName || "");
      setResult(parsedMessage.result || null);
      setContent(parsedMessage.content || "");
    } else {
      console.log("alo4", message.content);
    }
  }, [message]);

  return functionName ? (
    <View className='mb-3 px-4 py-2 rounded-lg max-w-[75%] bg-white self-start pb-6'>
      <FunctionContent
        content={content}
        functionName={functionName}
        result={result}
      />
    </View>
  ) : (
    <View className='mb-3 px-4 py-2 rounded-lg max-w-[75%] bg-white'>
      <Text className='text-gray-800'>{message.content}</Text>
    </View>
  );
};
function extractJsonFromContent(messageContent) {
  const contentStart = messageContent.indexOf('"content":');
  const functionNameStart = messageContent.indexOf('"functionName":');
  const resultStart = messageContent.indexOf('"result":');

  if (functionNameStart === -1) {
    const contentRaw = messageContent
      .substring(contentStart + 10)
      .trim()
      .replace(/^"|"$/g, "")
      .replace(/,$/, "");

    return {
      content: contentRaw,
    };
  }

  const contentRaw = messageContent
    .substring(contentStart + 10, functionNameStart)
    .trim()
    .replace(/,$/, "");

  const functionNameRaw = messageContent
    .substring(functionNameStart + 15, resultStart)
    .trim()
    .replace(/,$/, "");

  let resultRaw = messageContent.substring(resultStart + 9).trim();

  if (resultRaw.endsWith("}")) {
    const lastClose = resultRaw.lastIndexOf("}");
    resultRaw = resultRaw.substring(0, lastClose).trim();
  }

  let result;
  try {
    const newResult = resultRaw
      .replace(/^"|"$/g, "")
      .replace(/ObjectId\('([^']+)'\)/g, '"$1"')
      .replace(/([a-zA-Z0-9_]+):/g, '"$1":')
      .replace(/'([^']*)'/g, '"$1"')
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]");

    const dtb = cleanJsonString(newResult);
    console.log("newResult", functionNameRaw, dtb);

    if (dtb !== "") {
      result = JSON.parse(dtb);

      console.log("result", functionNameRaw, result);
    }
  } catch (e) {
    console.warn("Result is not valid JSON, trả về chuỗi thô", functionNameRaw);
    result = resultRaw;
  }

  return {
    content: contentRaw.replace(/^"|"$/g, ""),
    functionName: functionNameRaw.replace(/^"|"$/g, ""),
    result,
  };
}

function cleanJsonString(rawStr) {
  const cleaned = rawStr
    .replace(/"_id":\s*new\s*"([^"]+)"/g, '"_id": "$1"')

    .replace(/"image":\s*""https":\/\//g, '"image": "https://')

    .replace(
      /("(createdAt|updatedAt)"\s*:\s*)\d{4}-\d{2}-"(\d{2})T(\d{2})":"(\d{2})":(\d{2}\.\d{3}Z)/g,
      (_, prefix, key, day, hour, minute, rest) =>
        `${prefix}"2025-04-${day}T${hour}:${minute}:${rest}"`
    );

  return `[${cleaned}]`;
}

export default BotFunction;
