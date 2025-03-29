import React from 'react';
import ChatList from '@/components/chat/ChatList';
import ChatListHeader from '@/components/chat/ChatListHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
const Chats =() => {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ChatListHeader />
            <ChatList />
        </SafeAreaView>
    )
}

export default Chats