import React, {useEffect, useState} from 'react';
import ChatCard from '@/components/chat/ChatCard';
import {Alert, FlatList} from 'react-native';
import {useSelector} from "react-redux";
import {getAllChatrooms} from "@/services/chatService";
import {User} from "react-native-gifted-chat";

interface CardProps {
    chatroomId: string;
    createdBy: string;
    //userImg: any;
    createdAt: string;
    //content: string;
}

const Chats: React.FC<CardProps> = () => {
    const [chatrooms, setChatrooms] = useState<CardProps[]>([]);
    const user = useSelector((state: {user: any}) => state.user);

    useEffect(() => {

        const fetchChatrooms = async (user: any) => {
            try {
                const chatroomData = await getAllChatrooms(user.id);
                setChatrooms(chatroomData);

            } catch (error) {
                console.error("Failed to fetch chatrooms:", error);
                throw error;
            }
        }
        fetchChatrooms(user);
    }, []);

    return (
        <FlatList
            data={chatrooms}
            keyExtractor={(item) => item.chatroomId}
            renderItem={({ item }) => (
                <ChatCard 
                    userImg={require('@/assets/images/avatar-placeholder.png')}
                    messageText={"hello"}
                    messageTime={item.createdAt}
                    userName={user.username}
                    chatId={item.chatroomId}
                />
            )}
        />
    )
}

export default Chats