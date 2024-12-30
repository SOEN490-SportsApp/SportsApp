import { useLocalSearchParams, router } from 'expo-router';
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

interface FeedItem {
  id: string;
  image: any;  
  username: string;
  time: string;
}

const feedData: FeedItem[] = [
  { id: '1', image: require('@/assets/images/feed1.jpg'), username: 'User1', time: '5 min ago' },
  { id: '2', image: require('@/assets/images/feed2.jpg'), username: 'User2', time: '10 min ago' },
  { id: '3', image: require('@/assets/images/feed3.jpg'), username: 'User3', time: '15 min ago' },
];

const HomePage: React.FC = () => {

  const renderPostActions = () => {
    return (
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="heart" type="font-awesome" color="#ff0000" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="comment" type="font-awesome" color="#000" size={20} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>sporta</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <View style={styles.iconCircle}>
              <Icon name="search" type="font-awesome" color="#000" size={20} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <View style={styles.iconCircle}>
              <Icon name="comments" type="font-awesome" color="#000" size={20} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed */}
      <FlatList
        data={feedData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.feedItem}>
            <Image source={item.image} style={styles.feedImage} />
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.time}>{item.time}</Text>
            {renderPostActions()}
          </View>
        )}
        contentContainerStyle={styles.feedContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoText: {
    color: '#0C9E04',
    fontSize: 28,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedContainer: {
    paddingHorizontal: 10,
  },
  feedItem: {
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    padding: 10,
  },
  feedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  username: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  time: {
    color: 'gray',
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
  },
});

export default HomePage;

