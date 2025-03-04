import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment'; // For time formatting
import { Link, router } from 'expo-router'; // Expo Router's Link component
import { Post } from '@/types/post';

type PostComponentProps = {
  post: Post;
};

const PostComponent: React.FC<PostComponentProps> = ({ post }) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(post.likes); // Track like count

  // Format the creation date (e.g., "2 hours ago")
  const timeAgo = moment(post.creationDate).fromNow();

  // Handle like button press
  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1)); // Update like count
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
              source={{ uri: 'https://via.placeholder.com/150' }} // Replace with user profile picture URL
              style={styles.profilePicture}
            />
            <View style={styles.userInfoText}>
              <Text style={styles.userName}>{post.createdBy}</Text>
              <Text style={styles.timeAgo}>{timeAgo}</Text>
            </View>
          </View>

          {/* Post Content */}
          <Text style={styles.postContent}>{post.content}</Text>

          {/* Post Images */}
          {post.attachments.length > 0 && (
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
              <Text style={styles.actionText}>{likeCount} Likes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={24} color="#555" />
              <Text style={styles.actionText}>{post.comments.length} Comments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfoText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timeAgo: {
    fontSize: 14,
    color: '#888',
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  postImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
});

export default PostComponent;