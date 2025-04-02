import React, {useEffect, useState} from 'react';
import ChatCard from '@/components/chat/ChatCard';
import {Alert, FlatList} from 'react-native';
import {useSelector} from "react-redux";
import {getChatrooms} from "@/services/chatService";
import {User} from "react-native-gifted-chat";

const Chats =() => {
    const [chatrooms, setChatrooms] = useState<CardProps[]>([]);
    const [user, setUser] = useState<User | null>(null);

    interface CardProps {
        chatroomId: string;
        userId: string;
        userImg: any;
        createdAt: string;
        content: string;
    }

    const fetchChatrooms = async () => {
        try {
            const user = useSelector((state: {user: any }) => state.user);
            setUser(user);
            const chatroomData = await getChatrooms(user.id);
            setChatrooms(chatroomData);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch chatrooms.");
        }
    }


    useEffect(() => {
        fetchChatrooms();
    })

    const chatData: CardProps[] = [
        {
          chatroomId: '1',
          userId: 'Alice Smith',
          userImg: require('@/assets/images/avatar-placeholder.png'),
          createdAt: '2 mins ago',
          content: 'Hey Alice! How have you been?',
        },
        {
          chatroomId: '2',
          userId: 'Bob Johnson',
          userImg: require('@/assets/images/avatar-placeholder.png'),
          createdAt: '10 mins ago',
          content: 'Are we still on for tonight?',
        },
        {
          chatroomId: '3',
          userId: 'Charlie Davis',
          userImg: require('@/assets/images/avatar-placeholder.png'),
          createdAt: '30 mins ago',
          content: 'That was a great game yesterday!',
        },
        {
          chatroomId: '4',
          userId: 'Diana Prince',
          userImg: require('@/assets/images/avatar-placeholder.png'),
          createdAt: '1 hour ago',
          content: 'Let’s catch up soon!',
        },
        {
          chatroomId: '5',
          userId: 'Edward Norton',
          userImg: require('@/assets/images/avatar-placeholder.png'),
          createdAt: '3 hours ago',
          content: 'Do you have the notes from the meeting?',
        },
        {
          chatroomId: '6',
          userId: 'Fiona Gallagher',
          userImg: require('@/assets/images/avatar-placeholder.png'),
          createdAt: 'Yesterday',
          content: 'Hope you had a great weekend!',
        },
        {
          chatroomId: '7',
          userId: 'George Michael',
          userImg: require('@/assets/images/avatar-placeholder.png'),
          createdAt: '2 days ago',
          content: 'Thanks for the recommendation!',
        },
      ];

    return (
        <FlatList
            data={chatrooms}
            keyExtractor={(item) => item.chatroomId}
            renderItem={({ item }) => (
                <ChatCard 
                    userImg={require('@/assets/images/avatar-placeholder.png')}
                    messageText={item.content}
                    messageTime={item.createdAt}
                    userName={item.userId}
                    chatId={item.chatroomId}
                />
            )}
        />
    )
}

export default Chats