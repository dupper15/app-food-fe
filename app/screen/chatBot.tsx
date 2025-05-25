import { Ionicons } from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native";
import { Image, Text, TouchableOpacity } from "react-native";
import { SafeAreaView, View } from "react-native";
import { useState, useRef, useEffect } from "react";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getChatBotMessage, sendChatBotMessage } from "@/services/api/chatApi";
import BotFunction from "../components/botFunction";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const scrollViewRef = useRef(null);
  const userId = useSelector((state) => state.user.userId);
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: sendChatBotMessage,
    onSuccess: (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      setInputMessage("");
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
      console.log("Message sent successfully:", data);
    },
    onError: (error) => {
      setInputMessage("");
      console.error("Error sending message:", error);
    },
  });

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;
    const newMessage = {
      content: inputMessage,
      sender_id: userId,
      receiver_id: "chat-bot",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    sendMessageMutation.mutate(newMessage);
  };
  useEffect(() => {
    setIsLoading(true);
    handleGetChatBotMutation.mutate(userId);
  }, []);
  const handleGetChatBotMutation = useMutation({
    mutationFn: getChatBotMessage,
    onSuccess: (data) => {
      setMessages(data);
      setIsLoading(false);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
      console.log("Messages fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching messages:", error);
      setIsLoading(false);
    },
  });
  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      <View className='flex-row items-center mb-2 px-4 py-2 bg-white border-b border-gray-200 gap-4'>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='chevron-back' size={24} color='#000' />
        </TouchableOpacity>

        <Image
          source={require("../../assets/images/chatbot.png")}
          className='w-10 h-10 rounded-full'
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />

        <Text className='text-lg font-semibold text-gray-900'>Chat Bot</Text>
      </View>

      <ScrollView
        className='flex-1 px-4 py-2'
        ref={scrollViewRef}
        contentContainerStyle={{ paddingVertical: 16 }}>
        {isLoading ? (
          <View className='items-center mt-4'>
            <Text className='text-gray-500'>Loading messages...</Text>
          </View>
        ) : messages.length === 0 ? (
          <View className='items-center mt-4'>
            <Text className='text-gray-500'>
              No messages yet. Start the conversation!
            </Text>
          </View>
        ) : (
          messages.map((message, index) =>
            message.sender_id === "chat-bot" ? (
              <BotFunction key={index} message={message} />
            ) : (
              <View
                key={index}
                className='self-end bg-blue-500 rounded-lg px-4 py-2 mb-3 max-w-[75%]'>
                <Text className='text-white'>{message.content}</Text>
              </View>
            )
          )
        )}
      </ScrollView>

      <View className='flex-row items-center p-3 bg-white border-t border-gray-200 gap-x-2'>
        <TouchableOpacity className='p-2'>
          <Ionicons name='camera' size={24} color='#666' />
        </TouchableOpacity>
        <TouchableOpacity className='p-2'>
          <Ionicons name='document' size={24} color='#666' />
        </TouchableOpacity>

        <TextInput
          className='flex-1 px-4 py-2 bg-gray-100 rounded-full text-base'
          placeholder='Message...'
          value={inputMessage}
          onChangeText={setInputMessage}
        />

        <TouchableOpacity
          className='p-2'
          onPress={handleSendMessage}
          disabled={inputMessage.trim() === ""}>
          <Ionicons name='send' size={20} color='#000' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatBot;
