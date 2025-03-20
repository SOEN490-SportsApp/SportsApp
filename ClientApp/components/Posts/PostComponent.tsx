import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment'; 
import { router } from 'expo-router';
import { Post } from '@/types/post';
import { mhs, mvs } from '@/utils/helpers/uiScaler';
import { useTranslation } from 'react-i18next';
import 'moment/locale/fr';
import 'moment/locale/en-ca';

type PostComponentProps = {
  post: Post;
  userProfile?: any;
};

const PostComponent: React.FC<PostComponentProps> = ({ post, userProfile }) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(post.likes);

  const { t, i18n } = useTranslation();
  moment.locale(i18n.language === 'fr' ? 'fr' : 'en-ca');

  const getTimeAgoTranslation = (time: moment.Moment) => {
    const diffMinutes = moment().diff(time, 'minutes');
    const diffHours = moment().diff(time, 'hours');
    const diffDays = moment().diff(time, 'days');
  
    if (diffMinutes < 1) return t('post_component.just_now');
    if (diffMinutes < 60) return t('post_component.minutes_ago', { count: diffMinutes });
    if (diffHours < 24) return t('post_component.hours_ago', { count: diffHours });
    return t('post_component.days_ago', { count: diffDays });
  };
  
  const timeAgo = getTimeAgoTranslation(moment(post.creationDate));  

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => {
      router.push({
        pathname: `/posts/[id]`,
        params: { id: post.id },
      });
    }}>
      <View style={styles.container}>
        {/* User Info Section */}
        <View style={styles.userInfoContainer}>
          <Image
            source={require("@/assets/images/avatar-placeholder.png")}
            style={styles.profilePicture}
          />
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{userProfile?.username}</Text>
            <Text style={styles.timeAgo}>{timeAgo}</Text>
          </View>
        </View>

        {/* Post Content */}
        <Text style={styles.postContent}>{post.content}</Text>

        {/* Post Images */}
        {(post.attachments.length > 0 && post.attachments[0] != '') && (
          <FlatList
            data={post.attachments}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.postImage} resizeMode="cover" />
            )}
          />
        )}

        {/* Like and Comment Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? 'red' : '#555'} />
            <Text style={styles.actionText}>{likeCount} {t('post_component.likes')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#555" />
            <Text style={styles.actionText}>{post.comments.length} {t('post_component.comments')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: mhs(12),
    marginBottom: mvs(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: mvs(2) },
    shadowOpacity: 0.1,
    shadowRadius: mhs(4),
    elevation: 4,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mvs(12),
  },
  profilePicture: {
    width: mhs(36),
    height: mhs(36),
    borderRadius: 25,
    marginRight: mhs(12),
  },
  userInfoText: {
    flex: 1,
  },
  userName: {
    fontSize: mhs(15),
    fontWeight: 'bold',
    color: '#333',
  },
  timeAgo: {
    fontSize: mhs(12), 
    color: '#888',
  },
  postContent: {
    fontSize: mhs(14),
    color: '#333',
    marginBottom: mvs(8), 
  },
  postImage: {
    width: mhs(200), 
    height: mvs(150), 
    borderRadius: mhs(8), 
    marginRight: mhs(8), 
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: mvs(12), 
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: mhs(16), 
  },
  actionText: {
    marginLeft: mhs(6), 
    fontSize: mhs(13),
    color: '#555',
  },
});


export default PostComponent;