import React, { useEffect, useState } from "react";
import { View, Text, TouchableHighlight, Image } from "react-native";
import DishBox from "./dishBox";
import { ScrollView } from "react-native-gesture-handler";

const CartItem = ({ item }) => (
  <View className='bg-gray-100 p-3 rounded-lg flex-row items-center space-x-3'>
    {/* Hình món ăn */}
    <Image
      source={{ uri: item.dish_id.image }}
      style={{ width: 60, height: 60, borderRadius: 8 }}
    />

    {/* Thông tin món ăn */}
    <View className='flex-1'>
      <Text className='font-semibold text-base'>{item.dish_id.name}</Text>
      <Text className='text-gray-700'>{item.dish_id.price}₫</Text>

      {/* Danh sách topping (nếu có) */}
      {Array.isArray(item.topping) && item.topping.length > 0 && (
        <View className='mt-1 space-y-1'>
          {item.topping.map((topping, index) => (
            <Text key={index} className='text-sm text-gray-600'>
              + {topping.name} - {topping.price}₫
            </Text>
          ))}
        </View>
      )}
    </View>
  </View>
);

const OrderCard = ({ item }) => (
  <View className='bg-slate-100 rounded-xl p-4 space-y-3 border border-gray-200'>
    {/* Header: Avatar + Tên quán */}
    <View className='flex-row items-center space-x-3'>
      <Image
        source={{ uri: item.restaurant_id.owner_id.avatar }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
      <Text className='text-lg font-bold'>{item.restaurant_id.name}</Text>
    </View>

    {/* Số món và trạng thái */}
    <View className='flex-row justify-between'>
      <Text className='text-blue-600 font-semibold'>
        Số món: {item.array_item.length}
      </Text>
      <Text className='text-gray-600'>Trạng thái: {item.status}</Text>
    </View>

    {/* Tổng tiền */}

    {/* Danh sách món */}
    {item.array_item.map((dishItem, index) => (
      <View
        key={dishItem._id}
        className='border-t border-gray-200 bg-white px-2 pt-3 mt-3 flex-row space-x-3'>
        <Image
          source={{ uri: dishItem.dish_id.image }}
          style={{ width: 80, height: 80, borderRadius: 10 }}
        />
        <View className='flex-1 justify-center'>
          <Text className='font-semibold text-base'>
            {index + 1}. {dishItem.dish_id.name}
          </Text>
          <Text className='text-gray-700'>Số lượng: {dishItem.quantity}</Text>
          <Text className='text-gray-700'>
            Giá: {dishItem.dish_id.price.toLocaleString()}₫
          </Text>
        </View>
      </View>
    ))}
    <Text className='text-right text-green-600 font-bold'>
      Tổng: {item.total_price.toLocaleString()}₫
    </Text>
  </View>
);

const OngoingOrderCard = ({ item }) => (
  <View className='bg-slate-100 rounded-xl p-4 space-y-3 border border-gray-200'>
    {/* Header: Avatar + Tên quán */}
    <View className='flex-row items-center space-x-3'>
      <Image
        source={{ uri: item.restaurant_id.owner_id.avatar }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
      <Text className='text-lg font-bold'>{item.restaurant_id.name}</Text>
    </View>

    {/* Số món và trạng thái */}
    <View className='flex-row justify-between'>
      <Text className='text-blue-600 font-semibold'>
        Số món: {item.array_item.length}
      </Text>
      <Text className='text-gray-600'>Trạng thái: {item.status}</Text>
    </View>

    {/* Tổng tiền */}

    {/* Danh sách món */}
    {item.array_item.map((dishItem, index) => (
      <View
        key={dishItem._id}
        className='border-t border-gray-200 bg-white px-2 pt-3 mt-3 flex-row space-x-3'>
        <Image
          source={{ uri: dishItem.dish_id.image }}
          style={{ width: 80, height: 80, borderRadius: 10 }}
        />
        <View className='flex-1 justify-center'>
          <Text className='font-semibold text-base'>
            {index + 1}. {dishItem.dish_id.name}
          </Text>
          <Text className='text-gray-700'>Số lượng: {dishItem.quantity}</Text>
          <Text className='text-gray-700'>
            Giá: {dishItem.dish_id.price.toLocaleString()}₫
          </Text>
        </View>
      </View>
    ))}
    <Text className='text-right text-green-600 font-bold'>
      Tổng: {item.total_price.toLocaleString()}₫
    </Text>
  </View>
);

const FunctionContent = ({ content, functionName, result }) => {
  switch (functionName) {
    case "recommend_dish_by_time":
      return (
        <View className='flex-1 gap-4'>
          <Text className='text-gray-800'>{content}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className='flex-row gap-4'>
              {result &&
                Array.isArray(result) &&
                result.length > 0 &&
                result.map((item, index) => (
                  <View key={index} className='w-40'>
                    <DishBox dish={item} />
                  </View>
                ))}
            </View>
          </ScrollView>
        </View>
      );

    case "add_dish_to_cart":
    case "update_cart_item":
    case "remove_cart_item":
    case "place_order":
    case "reorder_previous":
      return (
        <View className=''>
          <Text className='text-gray-900 text-base leading-relaxed'>
            {content}
          </Text>

          <TouchableHighlight
            className='bg-customYellow rounded-md mt-2 p-2'
            underlayColor='#e6b800'
            onPress={() => {
              // Gọi hàm xử lý ở đây nếu có
            }}>
            <Text className='text-white text-center font-normal tracking-wide'>
              {functionName === "place_order" ||
              functionName === "reorder_previous"
                ? "View My Order"
                : "View My Cart"}
            </Text>
          </TouchableHighlight>
        </View>
      );

    case "get_user_cart":
      return (
        <View className='space-y-3'>
          {Array.isArray(result) &&
            result.map((item, index) => (
              <View className='space-y-3'>
                <Text className='font-bold text-lg'>
                  {item.restaurant_id.name}
                </Text>
                {item.order_items &&
                  item.order_items.map((i, d) => <CartItem key={d} item={i} />)}
              </View>
            ))}
        </View>
      );

    case "get_topping_of_restaurant":
      return (
        <View className='mb-3 px-4 py-2 rounded-lg max-w-[75%] bg-white self-start space-y-2'>
          <Text className='text-gray-800'>{content}</Text>
          {Array.isArray(result) &&
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
          {Array.isArray(result) &&
            result.map((item, index) => <OrderCard key={index} item={item} />)}
        </View>
      );

    case "view_ongoing_orders":
      return (
        <View className='space-y-3'>
          <Text className='text-gray-800'>{content}</Text>
          {Array.isArray(result) &&
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
  console.log("messageContent", messageContent);
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
  let newResult = resultRaw
    .replace(/^"|"$/g, "")
    .replace(/ObjectId\('([^']+)'\)/g, '"$1"')
    .replace(/([a-zA-Z0-9_]+):/g, '"$1":')
    .replace(/'([^']*)'/g, '"$1"')
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]")
    .replace(/\bnew\b\s*/g, "")
    .replace(/"createdAt"\s*:\s*"[^"]*",?/g, "")
    .replace(/"updatedAt"\s*:\s*"[^"]*",?/g, "")
    .replace(/\d{2}T\d{2}"\s*:\s*"\d{2}":\d{2}\.\d+Z",?/g, "")
    .replace(
      /"(\d{4}-\d{2}-\d{2})"(\d{2}):"(\d{2}):(\d{2}\.\d+Z)"/g,
      '"$1T$2:$3:$4"'
    )
    .replace(/""https"/g, '"https');
  let dtb = cleanJsonString(newResult);

  const start = dtb.indexOf("[");
  const end = dtb.lastIndexOf("]");
  if (start !== -1 && end !== -1) {
    dtb = dtb.substring(start, end + 1);
  }
  if (dtb.startsWith("[[") && dtb.endsWith("]]")) {
    dtb = dtb.slice(1, -1);
    dtb = cleanMalformedJSON(dtb);
  }
  console.log("dtb", dtb);
  result = dtb;
  if (typeof dtb === "string") {
    try {
      if (dtb !== "") {
        result = JSON.parse(dtb);
      }
    } catch (e) {
      console.warn(
        "Result is not valid JSON, trả về chuỗi thô",
        functionNameRaw
      );
    }
  }

  console.log("result", result);
  console.log("functionNameRaw", functionNameRaw.replace(/^"|"$/g, ""));
  console.log("contentRaw", contentRaw.replace(/^"|"$/g, ""));
  return {
    content: contentRaw.replace(/^"|"$/g, ""),
    functionName: functionNameRaw.replace(/^"|"$/g, ""),
    result,
  };
}
function cleanMalformedJSON(jsonString) {
  try {
    // Bước 1: Fix lỗi ""https" => "https"
    jsonString = jsonString.replace(/""https/g, '"https');

    // Bước 2: Parse chuỗi JSON thành object
    let data = JSON.parse(jsonString);

    // Bước 3: Đệ quy duyệt tất cả phần tử và xóa trường ngày không hợp lệ
    function cleanDates(obj) {
      if (Array.isArray(obj)) {
        obj.forEach(cleanDates);
      } else if (typeof obj === "object" && obj !== null) {
        for (let key in obj) {
          if (key === "createdAt" || key === "updatedAt") {
            const date = Date.parse(obj[key]);
            if (isNaN(date)) {
              console.warn(
                `Removed invalid date at key: ${key} -> ${obj[key]}`
              );
              delete obj[key];
            }
          } else {
            cleanDates(obj[key]);
          }
        }
      }
    }

    cleanDates(data);

    return data;
  } catch (error) {
    console.error("Lỗi khi xử lý JSON:", error);
    return jsonString;
  }
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
