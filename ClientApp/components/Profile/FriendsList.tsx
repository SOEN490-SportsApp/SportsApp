import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from "react-native";
import FriendCard from "./FriendCardProfilePage";
import { getFriendsOfUser, getUserProfile} from "@/services/userService";

const FriendsList = ({ userId }: { userId: string }) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      const friendList = await getFriendsOfUser(userId);
      console.log(friendList);
      // Fetch profiles for each friend
      const friendsWithProfiles = await Promise.all(
        friendList.map(async (friend:any) => {
          const profile = await getUserProfile(friend.friendUserId);
          return { ...friend, profile };
        })
      );
      console.log(friendsWithProfiles);
      setFriends(friendsWithProfiles);
      setLoading(false);
    };

    fetchFriends();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  if (friends.length === 0) {
    return <Text style={styles.noFriends}>No friends found.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.FriendId}
        renderItem={({ item }) => <FriendCard friend={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 0,
      },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noFriends: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});

export default FriendsList;
