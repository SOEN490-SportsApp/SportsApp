import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ActivityIndicator, Text, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import PostCreationComponent from '@/components/Posts/PostCreationComponent';
import PostComponent from '@/components/Posts/PostComponent';
import { fetchPosts } from '@/utils/api/postApiClient';
import { Post } from '@/types/post';
import { getProfile } from '@/utils/api/profileApiClient';
import { mhs, mvs } from '@/utils/helpers/uiScaler';

const EventPostsTab = ({ eventId }: { eventId: string }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [userProfiles, setUserProfiles] = useState<{ [userId: string]: any }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const loadPosts = async () => {
        try {
            const size = 10;
            const response = await fetchPosts(eventId, page, size);

            // If page is 0, replace the posts with the new ones
            if (page === 0) {
                setPosts(response.content);
            } else {
                // Otherwise, append the new posts to the existing list
                setPosts((prevPosts) => [...prevPosts, ...response.content]);
            }

            // Fetch user profiles for the new posts
            const profiles: { [userId: string]: any } = { ...userProfiles };
            for (const post of response.content) {
                if (!profiles[post.createdBy]) {
                    const profile = await getProfile(post.createdBy);
                    profiles[post.createdBy] = profile;
                }
            }
            setUserProfiles(profiles);

            // Check if there are more posts to fetch
            if (response.content.length < size) {
                setHasMore(false);
            }
        } catch (err) {
            setError('Failed to fetch posts.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewPost = () => {
        // Reset pagination state and clear posts
        setPage(0); // Reset to the first page
        setHasMore(true); // Assume there are more posts to fetch
        setUserProfiles({}); // Clear user profiles cache
        setPosts([]); // Clear posts
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

        if (isCloseToBottom && hasMore && !loading) {
            loadNextPage();
        }
    };

    const loadNextPage = () => {
        if (hasMore && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    // Fetch posts whenever the page changes
    useEffect(() => {
        loadPosts();
    }, [page]);

    if (loading && page === 0) {
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
            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <PostCreationComponent eventId={eventId} onNewPost={handleNewPost} />
                <View style={{ height: 16 }} />
                {posts.map((post) => (
                    <PostComponent key={post.id} post={post} userProfile={userProfiles[post.createdBy]} />
                ))}
                {loading && <ActivityIndicator size="small" color="#0000ff" />}
                {!hasMore && <Text style={styles.noMorePostsText}>You have reached the end!</Text>}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: mhs(16),
        backgroundColor: '#fafafa',
    },
    noMorePostsText: {
        textAlign: 'center',
        marginVertical: mvs(12),
        color: '#888',
    },
});

export default EventPostsTab;