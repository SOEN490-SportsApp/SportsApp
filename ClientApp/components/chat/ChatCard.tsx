import { mvs } from '@/utils/helpers/uiScaler';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface CardProps {
  chatId: string;
  userName: string;
  userImg: any;
  messageTime: string;
  messageText: string;
}

const ChatCard: React.FC<CardProps> = ({ chatId, userName, userImg, messageTime, messageText }) => {
    const router = useRouter();
    
    return (
    <TouchableOpacity 
    style={styles.card}
    onPress={() => router.push(`/messaging/${chatId}`)}
>
      <View style={styles.userInfo}>
        <View style={styles.userImgWrapper}>
          <Image source={userImg} style={styles.userImg} />
        </View>
        <View style={styles.textSection}>
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.postTime}>{messageTime}</Text>
          </View>
          <Text style={styles.messageText}>{messageText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatCard;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImgWrapper: {
    paddingVertical: 10,
  },
  userImg: {
    width: mvs(60),
    height: mvs(60),
    borderRadius: 25,
  },
  textSection: {
    flex: 1,
    marginLeft: 10,
  },
  userInfoText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  postTime: {
    fontSize: 12,
    color: '#666',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
});
