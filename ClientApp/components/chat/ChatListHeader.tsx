import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import NewChatModal from './NewChatModal';
import ThemeColors from '@/utils/constants/colors';
import { getFriendsOfUser, getUserProfile } from '@/services/userService';
import { useSelector } from 'react-redux';
import { setLoading } from '@/state/notifications/notificationSlice';


const ChatListHeader: React.FC = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [friends, setFriends] = useState<any[]>([]);

    const user = useSelector((state: { user: any }) => state.user);

    const fetchFriends = async () => {
        setLoading(true);
        try {
          const friendList = await getFriendsOfUser(user.id);
          const friendsWithProfiles = await Promise.all(
            friendList.map(async (friend: any) => {
              const profile = await getUserProfile(friend.friendUserId);
              return { ...friend, profile };
            })
          );
          setFriends(friendsWithProfiles);
        } catch (error) {
          console.error("Failed to fetch friends:", error);
          setFriends([]);
        } finally {
          setLoading(false);
        }
    };
      
    const handleNewChatPress = () => {
        setModalVisible(true);
        fetchFriends();
    };


    return (
        <View style={styles.headerContainer}>
            <View style={styles.spacer} />
            <TouchableOpacity onPress={handleNewChatPress}>
                <FontAwesome size={32} name="plus-square-o" color="#333" />
            </TouchableOpacity> 
            <NewChatModal
                friends={friends}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: ThemeColors.background.lightGrey,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    spacer: {
        flex: 1,
    },
});

export default ChatListHeader;
