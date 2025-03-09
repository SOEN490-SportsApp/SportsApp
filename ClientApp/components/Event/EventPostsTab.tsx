import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import PostCreationComponent from '@/components/Posts/PostCreationComponent';
import PostComponent from '@/components/Posts/PostComponent';
import { fetchPosts } from '@/utils/api/postApiClient'; // Adjust the import based on your project structure
import { Post } from '@/types/post';
import { getProfile } from '@/utils/api/profileApiClient'; // Adjust the import based on your project structure

const EventPostsTab = ({ eventId }: { eventId: string }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userProfiles, setUserProfiles] = useState<{ [userId: string]: any }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch posts
  const loadPosts = async () => {
    try {
      const page = 0; // Replace with the desired page number
      const size = 10; // Replace with the desired number of posts per page

      const response = await fetchPosts(eventId, page, size);
      setPosts(response.content); // Update the posts state with the fetched data

            // Fetch user profiles for each post
            const profiles: { [userId: string]: any } = {};
            for (const post of response.content) {
              if (!profiles[post.createdBy]) {
                const profile = await getProfile(post.createdBy);
                profiles[post.createdBy] = profile;
              }
            }
            setUserProfiles(profiles); // Store user profiles in state
    } catch (err) {
      setError('Failed to fetch posts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts when the component mounts or when the eventId changes
  useEffect(() => {
    loadPosts();
  }, [eventId]);

  // Callback function to refresh posts after a new post is created
  const handleNewPost = () => {
    loadPosts(); // Re-fetch posts
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Pass the callback function to PostCreationComponent */}
        <PostCreationComponent eventId={eventId} onNewPost={handleNewPost} />
        <View style={{ height: 16 }} />
        {posts.map((post) => (
          <PostComponent key={post.id} post={post} userProfile={userProfiles[post.createdBy]}/>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fafafa',
  },
});

export default EventPostsTab;