import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useLocalSearchParams } from 'expo-router'; // Expo Router's useLocalSearchParams hook
import { Post } from '@/types/post';


// Hardcoded posts data (replace with your data fetching logic)
const posts: Post[] = [
  {
    id: '1',
    creationDate: '2025-03-01T19:18:43.759Z',
    updatedAt: '2025-03-01T19:18:43.759Z',
    eventId: 'event1',
    content: 'This is a sample post with some text content.',
    createdBy: 'John Doe',
    attachments: [
      'https://via.placeholder.com/400',
      'https://via.placeholder.com/400',
    ],
    comments: [
      {
        id: 'comment1',
        creationDate: '2025-03-01T19:20:43.759Z',
        updatedAt: '2025-03-01T19:20:43.759Z',
        content: 'This is a comment!',
        createdBy: 'Jane Doe',
      },
    ],
    likes: 10,
  },
  {
    id: '2',
    creationDate: '2025-03-01T18:18:43.759Z',
    updatedAt: '2025-03-01T18:18:43.759Z',
    eventId: 'event2',
    content: 'Another post without images.',
    createdBy: 'Jane Doe',
    attachments: [],
    comments: [],
    likes: 5,
  },
];

const PostPage: React.FC = () => {
  const { id } = useLocalSearchParams(); // Get the post ID from the URL
  const post = posts.find((p) => p.id === id); // Find the post by ID

  if (!post) {
    return (
      <View style={styles.container}>
        <Text>Post not found.</Text>
      </View>
    );
  }

  // Format the creation date (e.g., "2 hours ago")
  const timeAgo = moment(post.creationDate).fromNow();

  return (
    <ScrollView style={styles.container}>
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {post.attachments.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.postImage} resizeMode="cover" />
          ))}
        </ScrollView>
      )}

      {/* Like and Comment Count */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>{post.likes} Likes</Text>
        <Text style={styles.statsText}>{post.comments.length} Comments</Text>
      </View>

      {/* Comments Section */}
      <View style={styles.commentsContainer}>
        <Text style={styles.commentsTitle}>Comments</Text>
        {post.comments.map((comment) => (
          <View key={comment.id} style={styles.commentContainer}>
            <Text style={styles.commentAuthor}>{comment.createdBy}</Text>
            <Text style={styles.commentContent}>{comment.content}</Text>
            <Text style={styles.commentTime}>{moment(comment.creationDate).fromNow()}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 16,
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
    width: 300,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: '#555',
    marginRight: 16,
  },
  commentsContainer: {
    marginTop: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  commentContainer: {
    marginBottom: 16,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  commentContent: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  commentTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});

export default PostPage;