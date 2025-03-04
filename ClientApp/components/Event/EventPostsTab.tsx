import React from 'react';
import PostCreationComponent from '@/components/Posts/PostCreationComponent';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Post } from '@/types/post';
import PostComponent from '@/components/Posts/PostComponent';


const EventPostsTab = ({ eventId } : { eventId: string })=> {

    // Hardcoded posts data
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
            likes: 0
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
            likes: 0
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <PostCreationComponent eventId={eventId}/>
                <View style={{ height: 16 }} />
                {posts.map((post) => (
                    <PostComponent key={post.id} post={post} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fafafa',
    },
});

export default EventPostsTab