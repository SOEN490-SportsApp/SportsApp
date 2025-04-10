import React, {useCallback, useState} from 'react';
import ChatCard from '@/components/chat/ChatCard';
import {Alert, FlatList} from 'react-native';
import {useSelector} from "react-redux";
import {deleteChatroom, getAllChatrooms} from "@/services/chatService";
import { useFocusEffect } from '@react-navigation/native';
import { message } from '@/types/messaging';

interface CardProps {
  chatroomId: string;
  createdBy: string;
  userImg: any;
  createdAt: string;
  chatroomName: string
  messages: message[]
}

const Chats = () => {
  const [chatrooms, setChatrooms] = useState<CardProps[]>([]);
  const user = useSelector((state: {user: any}) => state.user);

  const handleDelete = (chatroomId: string) => {
    Alert.alert(
      "Leave Chat",
      "Do you want to leave this chat?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            // TODO JOUD handle selection between delete and leave endpoint calls
            try {
              await deleteChatroom(chatroomId);
              setChatrooms(prev => prev.filter(c => c.chatroomId !== chatroomId));
            } catch (e) {
              console.error("Failed to delete chatroom:", e);
              Alert.alert("Error", "Failed to delete chat. Please try again.");
            }
          }
        }
      ]
    );
  };

  //TODO Joud find a balance between automatic updates and performance
  useFocusEffect(
    useCallback(() => {
      const fetchChatrooms = async (user: any) => {
        try {
          const chatroomData = await getAllChatrooms(user.id);
          const sortedChatrooms = chatroomData.sort((a: CardProps, b: CardProps) => {
            const dateA = new Date(a.messages[0]?.createdAt.toString()).getTime();
            const dateB = new Date(b.messages[0]?.createdAt.toString()).getTime();
            return dateB - dateA; // most recent first
          });
          setChatrooms(sortedChatrooms);
        } catch (error) {
          console.error("Failed to fetch chatrooms:", error);
          throw error;
        }
      };

      const intervalId = setInterval(() => {
        fetchChatrooms(user);
      }, 3000);

      fetchChatrooms(user); // Initial fetch

      return () => {
        clearInterval(intervalId); // Cleanup interval
        setChatrooms([]); // Cleanup if needed
      };
    }, [user])
  );
  return (
    <FlatList
      data={chatrooms}
      keyExtractor={(item) => item.chatroomId}
      renderItem={({ item }) => (
        <ChatCard
          userImg={require('@/assets/images/avatar-placeholder.png')}
          messageText={item?.messages[0]?.content || ""}
          messageTime={item?.messages[0]?.createdAt?.toString() || item.createdAt.toString()}
          cardTitle={item.chatroomName}
          chatId={item.chatroomId}
          onLongPress={() => handleDelete(item.chatroomId)}
        />
      )}
    />
  )
}

export default Chats
