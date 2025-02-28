import React from 'react';
import ChatCard from '@/components/chat/ChatCard';
import { FlatList } from 'react-native';
const Chats =() => {

    interface CardProps {
        chatId: string;
        userName: string;
        userImg: any;
        messageTime: string;
        messageText: string;
    }

    const chatData: CardProps[] = [
        {
          chatId: '1',
          userName: 'Alice Smith',
          userImg: require('@/assets/images/avatar-placeholder.png'),
          messageTime: '2 mins ago',
          messageText: 'Hey Alice! How have you been?',
        },
        {
          chatId: '2',
          userName: 'Bob Johnson',
          userImg: require('@/assets/images/avatar-placeholder.png'),
          messageTime: '10 mins ago',
          messageText: 'Are we still on for tonight?',
        },
        {
          chatId: '3',
          userName: 'Charlie Davis',
          userImg: require('@/assets/images/avatar-placeholder.png'),
          messageTime: '30 mins ago',
          messageText: 'That was a great game yesterday!',
        },
        {
          chatId: '4',
          userName: 'Diana Prince',
          userImg: require('@/assets/images/avatar-placeholder.png'),
          messageTime: '1 hour ago',
          messageText: 'Let’s catch up soon!',
        },
        {
          chatId: '5',
          userName: 'Edward Norton',
          userImg: require('@/assets/images/avatar-placeholder.png'),
          messageTime: '3 hours ago',
          messageText: 'Do you have the notes from the meeting?',
        },
        {
          chatId: '6',
          userName: 'Fiona Gallagher',
          userImg: require('@/assets/images/avatar-placeholder.png'),
          messageTime: 'Yesterday',
          messageText: 'Hope you had a great weekend!',
        },
        {
          chatId: '7',
          userName: 'George Michael',
          userImg: require('@/assets/images/avatar-placeholder.png'),
          messageTime: '2 days ago',
          messageText: 'Thanks for the recommendation!',
        },
      ];

    return (
        <FlatList
            data={chatData}
            keyExtractor={(item) => item.chatId}
            renderItem={({ item }) => (
                <ChatCard 
                    userImg={item.userImg} 
                    messageText={item.messageText} 
                    messageTime={item.messageTime}
                    userName={item.userName}
                    chatId={item.chatId} 
                />
            )}
        />
    )
}

export default Chats