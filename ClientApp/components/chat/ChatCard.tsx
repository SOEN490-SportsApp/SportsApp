import { mvs } from '@/utils/helpers/uiScaler';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { format, isToday, isThisWeek, parseISO, differenceInCalendarDays } from 'date-fns';

interface CardProps {
  chatId: string;
  cardTitle: string;
  userImg: any;
  messageTime: string;
  messageText: string;
  onLongPress?: () => void;
  
}

const ChatCard: React.FC<CardProps> = ({ 
  chatId, 
  cardTitle, 
  userImg, 
  messageTime, 
  messageText,
  onLongPress
}) => {
    const router = useRouter();
    

    const formatChatTimestamp = (isoTimestamp: string): string => {
      const date = parseISO(isoTimestamp);

      if (isToday(date)) {
        return format(date, 'hh:mm a'); // e.g. 04:26 AM
      }

      const daysDiff = differenceInCalendarDays(new Date(), date);
      
      if (daysDiff < 7) {
        return format(date, 'EEEE'); // e.g. Monday
      }

      return format(date, 'dd/MM/yyyy'); // e.g. 25/03/2025
    };

    return (
    <TouchableOpacity 
    style={styles.card}
    onPress={() =>
      router.push({
        pathname: '/(tabs)/chats/[id]',
        params: {
          id: chatId,
          title: cardTitle,
        },
      })
    }
    onLongPress={onLongPress}
    >
      <View style={styles.userInfo}>
        <View style={styles.userImgWrapper}>
          <Image source={userImg} style={styles.userImg} />
        </View>
        <View style={styles.textSection}>
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{cardTitle}</Text>
            <Text style={styles.postTime}>{formatChatTimestamp(messageTime)}</Text>
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
