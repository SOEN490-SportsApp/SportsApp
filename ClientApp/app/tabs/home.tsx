import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { useRouter } from 'expo-router';

const feedData = [
  { id: '1', image: require('../../assets/images/feed1.jpg'), username: 'User1', time: '5 min ago' },
  { id: '2', image: require('../../assets/images/feed2.jpg'), username: 'User2', time: '10 min ago' },
  { id: '3', image: require('../../assets/images/feed3.jpg'), username: 'User3', time: '15 min ago' },
];

const HomeScreen = () => {
  const router = useRouter();

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
        <Text style={styles.title}>Sporta</Text>
        <Button
          title="Logout"
          buttonStyle={styles.logoutButton}
          titleStyle={styles.logoutButtonTitle} 
          onPress={() => router.push('/auth/login')}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#0C9E04',
    marginTop: 50,
  },
  title: {
    fontSize: 16,  
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  logoutButton: {
    backgroundColor: '#fff', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25, // Rounded corners
    elevation: 3, // Shadow for depth
    marginLeft: 10,
  },
  logoutButtonTitle: {
    color: 'black',
    marginLeft: 8, // Space between the icon and text
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedContainer: {
    paddingHorizontal: 10,
  },
  feedItem: {
    marginVertical: 10,
    backgroundColor: 'white',  // Cards with white background
    borderRadius: 10,
    elevation: 3,  // Elevation to give it a floating look
    padding: 10,
  },
  feedImage: {
    width: '100%',
    height: 220,
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

export default HomeScreen;



