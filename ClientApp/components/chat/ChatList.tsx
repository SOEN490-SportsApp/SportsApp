import React, {useCallback, useEffect, useState} from 'react';
import ChatCard from '@/components/chat/ChatCard';
import {Alert, FlatList} from 'react-native';
import {useSelector} from "react-redux";
import {deleteChatroom, getAllChatrooms} from "@/services/chatService";
import {User} from "react-native-gifted-chat";
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
                    setChatrooms(chatroomData);
                } catch (error) {
                    console.error("Failed to fetch chatrooms:", error);
                    throw error;
                }
            };
            fetchChatrooms(user);

            return () => {
                setChatrooms([]); // Cleanup if needed
            };
        }, [user])
    );
    console.log("chatrooms", chatrooms);
    return (
        <FlatList
            data={chatrooms}
            keyExtractor={(item) => item.chatroomId}
            renderItem={({ item }) => (
                <ChatCard 
                    userImg={require('@/assets/images/avatar-placeholder.png')}
                    messageText={item.messages[0].content}
                    messageTime={item.messages[0].createdAt.toString()}
                    cardTitle={item.chatroomName}
                    chatId={item.chatroomId}
                    onLongPress={() => handleDelete(item.chatroomId)}
                />
            )}
        />
    )
}

export default Chats