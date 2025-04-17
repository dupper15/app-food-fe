import { Ionicons } from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native";
import { Image, Text, TouchableOpacity } from "react-native";
import { SafeAreaView, View } from "react-native";
import { useState, useRef, useEffect } from "react";
import { router } from "expo-router"; // Nếu bạn dùng expo-router
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getChatBotMessage, sendChatBotMessage } from "@/services/api/chatApi";

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
      <View className='flex-row items-center justify-start gap-4 p-4 bg-white shadow'>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='chevron-back' size={24} color='#000' />
        </TouchableOpacity>
        <View className='flex-row items-center space-x-2'>
          <Image
            source={require("../../assets/images/chatbot.png")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
          />
          <Text className='text-lg font-semibold'>Chat Bot</Text>
        </View>
        <View className='w-6' />
      </View>

      <ScrollView
        className='flex-1 px-4'
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
          messages.map((message) => {
            return (
              <View
                key={message._id}
                className={`mb-3 px-4 py-2 rounded-lg max-w-[75%] ${
                  message.sender_id != "chat-bot"
                    ? "bg-blue-500 self-end"
                    : "bg-white self-start"
                }`}>
                <Text
                  className={
                    message.sender_id != "chat-bot"
                      ? "text-white"
                      : "text-gray-800"
                  }>
                  {message.content}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      <View className='flex-row items-center p-3 bg-white border-t border-gray-200'>
        <TouchableOpacity className='p-2'>
          <Ionicons name='camera' size={24} color='#666' />
        </TouchableOpacity>
        <TouchableOpacity className='p-2'>
          <Ionicons name='document' size={24} color='#666' />
        </TouchableOpacity>
        <TextInput
          className='flex-1 mx-2 px-4 py-2 bg-gray-100 rounded-full text-base'
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
