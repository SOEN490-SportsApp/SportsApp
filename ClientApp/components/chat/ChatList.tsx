import React, {useEffect, useState} from 'react';
import ChatCard from '@/components/chat/ChatCard';
import {Alert, FlatList} from 'react-native';
import {useSelector} from "react-redux";
import {getChatrooms} from "@/services/chatService";
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
                const chatroomData = await getChatrooms(user.id);
                setChatrooms(chatroomData);

            } catch (error) {
                console.error("Failed to fetch chatrooms:", error);
                throw error;
            }
        }
        fetchChatrooms(user);
    }, []);

    /*
    const chatData: CardProps[] = [
        {
          chatroomId: '1',
          createdBy: 'Alice Smith',
          //userImg: require('@/assets/images/avatar-placeholder.png'),
          createdAt: '2 mins ago',
          content: 'Hey Alice! How have you been?',
        },
        {
          chatroomId: '2',
            createdBy: 'Bob Johnson',
          //userImg: require('@/assets/images/avatar-placeholder.png'),
          createdAt: '10 mins ago',
          content: 'Are we still on for tonight?',
        },
        {
          chatroomId: '3',
            createdBy: 'Charlie Davis',
          //userImg: require('@/assets/images/avatar-placeholder.png'),
          createdAt: '30 mins ago',
          content: 'That was a great game yesterday!',
        },
        {
          chatroomId: '4',
            createdBy: 'Diana Prince',
          //userImg: require('@/assets/images/avatar-placeholder.png'),
          createdAt: '1 hour ago',
          content: 'Let’s catch up soon!',
        },
        {
          chatroomId: '5',
            createdBy: 'Edward Norton',
          //userImg: require('@/assets/images/avatar-placeholder.png'),
          createdAt: '3 hours ago',
          content: 'Do you have the notes from the meeting?',
        },
        {
          chatroomId: '6',
            createdBy: 'Fiona Gallagher',
          //userImg: require('@/assets/images/avatar-placeholder.png'),
          createdAt: 'Yesterday',
          content: 'Hope you had a great weekend!',
        },
        {
          chatroomId: '7',
            createdBy: 'George Michael',
          //userImg: require('@/assets/images/avatar-placeholder.png'),
          createdAt: '2 days ago',
          content: 'Thanks for the recommendation!',
        },
      ];
     */

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