import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import CustomTabMenu from "@/components/Helper Components/CustomTabMenu";
import {
  getOtherUserProfile,
  getSentFriendRequests,
  sendFriendRequest,
} from "@/utils/api/profileApiClient";
import { calculateAge } from "@/utils/helpers/ageOfUser";
import { getEventsByUserId } from "@/utils/api/profileApiClient";
import EventCard from "@/components/Event/EventCard";
import UserInfoCard from "@/components/Helper Components/UserInfoCard";
import { Event } from "@/types/event";
import FavoriteSportsBadges from "@/components/FavoriteSportsBadges";
import { getFriendsOfUser } from "@/services/userService";
import { useSelector } from "react-redux";
import { Friend } from "@/types";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import themeColors from "@/utils/constants/colors";
import { hs, vs } from "@/utils/helpers/uiScaler";

const screenHeight = Dimensions.get("window").height;
const maxHeight = screenHeight * 0.5;

interface FriendRequest {
  RequestId: string;
  friendRequestUserId: string;
  friendRequestUsername: string;
  status: string;
}

const ActivityTab = ({ userId }: { userId: string }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEventsByUserId(userId);
      const eventData: Event[] = response.content;
      setEvents(eventData || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  return (
    <View className="p-4 bg-white flex-1">
      {loading ? (
        <ActivityIndicator size="large" color="#0C9E04" />
      ) : events.length === 0 ? (
        <Text className="text-center text-gray-500">No events found</Text>
      ) : (
        <FlatList
          data={(events ?? []).sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Event }) => (
            <EventCard
              event={item}
              isForProfile={true}
              onPress={() => {
                router.push(`/events/${item.id}`);
              }}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchEvents} />
          }
        />
      )}
    </View>
  );
};

const FriendsTab = () => (
  <View className="p-4 bg-white flex-1">
    <ScrollView className="pt-3 space-y-4" style={{ maxHeight }}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View
          key={index}
          className="mt-4 p-4 rounded-lg"
          style={{ backgroundColor: "#0C9E04" }}
        >
          <Text className="text-xl font-bold text-black">
            Friend {index + 1}
          </Text>
        </View>
      ))}
    </ScrollView>
  </View>
);

const AboutTab: React.FC<{ user: any }> = ({ user }) => {
  let age = "N/A";
  try {
    age = calculateAge(user).toString();
  } catch (error) {
    console.error("Error calculating age:", error);
    age = "Invalid Date of Birth";
  }

  return (
    <View className="p-4 bg-gray-100 flex-1">
      <UserInfoCard
        username={user.username}
        gender={user.profile.gender}
        age={age}
        phoneNumber={user.profile.phoneNumber}
        sports={user?.profile.sportsOfPreference}
      />
        
    </View>
  );
};

const ProfilePage: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFriends, setIsFriends] = useState<boolean>(false);
  const [friendList, setFriendList] = useState<any[]>([]);
  const [friendStatus, setFriendStatus] = useState<string>("UNKNOWN");
  const visitingUser = useSelector((state: { user: any }) => state.user);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getOtherUserProfile(id!);
        setUser(userData);
        await fetchUserFriends();
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleFriendRequest = async () => {
    try {
      if(friendStatus !== "UNKNOWN") return;
      const response = await sendFriendRequest(visitingUser.id, id);
      console.log(response)
      response
        ? setFriendStatus("PENDING")
        : Alert.alert("Error", "Failed to send friend request");
    } catch (err: any) {
      console.log(err, " occured sending friend request");
    }
  };

  const fetchUserFriends = async () => {
    if (!id) return;
    try {
      const friendList = await getFriendsOfUser(visitingUser.id);
      const friendRequest = await getSentFriendRequests(visitingUser.id);
      setFriendList(friendList);
      console.log(friendList)
      const isFriends = friendList.some(
        (friend: Friend) => friend.friendUserId === id
      );
      const isPending = friendRequest.some(
        (friend: FriendRequest) => friend.friendRequestUserId === id
      );
      if (isPending) {
        setFriendStatus("PENDING");
      }
      if (isFriends) {
        setFriendStatus("ACCEPTED");
      }
      
    } catch (error: any) {
      console.log(error, " occured fetching friends");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator testID="loading" size="large" color="#0C9E04" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-500">Failed to load user data</Text>
      </View>
    );
  }

  const routes = [
    { key: "activity", title: "Activity", testID: "Activity" },
    { key: "friends", title: "Friends", testID: "Friends" },
    { key: "about", title: "About", testID: "About" },
  ];
  const scenes = {
    activity: <ActivityTab userId={id} />,
    friends: <FriendsTab />,
    about: <AboutTab user={user} />,
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      <ImageBackground
        className="flex flex-1 items-start justify-end"
        style={{ height: 350}}
        resizeMode="cover"
        source={require("@/assets/images/testBackground.jpg")}
        defaultSource={require("@/assets/images/Unknown.jpg")}
      />

      <View
        className=""
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingVertical: vs(15),
          backgroundColor: "#fff",
          marginTop: hs(-225),
          borderColor: "#FFF",
        }}
      >
        <View className="items-center flex flex-row gap-4">
          <View className="flex items-start flex-col gap-4 ml-4 w-11/12">
            <Text testID="firstName" className="text-3xl font-bold ">
              {user?.profile.firstName} {user?.profile.lastName}
            </Text>
            {/* <FavoriteSportsBadges sports={user?.profile.sportsOfPreference} /> */}
            <View className="flex flex-row justify-center gap-4 w-full">
              <TouchableOpacity
                style={[
                  styles.addFriendButton,
                  {
                    backgroundColor:
                      friendStatus === "UNKNOWN" ? "#0C9E04" : "#fff",
                    borderColor:
                      friendStatus !== "UNKNOWN" ? "#0C9E04" : "#fff",
                  },
                ]}
                onPress={handleFriendRequest}
              >
                <Text
                  className="font-bold"
                  style={{
                    color: friendStatus === "UNKNOWN" ? "#fff" : "#0C9E04",
                  }}
                >
                  {friendStatus === "ACCEPTED"
                    ? "Friends"
                    : friendStatus === "PENDING"
                    ? "Pending"
                    : "Add"}
                </Text>
                <MaterialCommunityIcons
                  name={
                    friendStatus === "ACCEPTED"
                      ? "check"
                      : friendStatus === "PENDING"
                      ? "account-clock"
                      : "account-plus"
                  }
                  size={22}
                  color={friendStatus === "UNKNOWN" ? "#fff" : "#0C9E04"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.messageButton,
                  {
                    backgroundColor:
                      friendStatus === "UNKNOWN" ? "#fff" : "#0C9E04",
                  },
                ]}
              >
                <Text
                  className="font-bold"
                  style={{
                    color: friendStatus === "UNKNOWN" ? "#0C9E04" : "#fff",
                  }}
                >
                  Message
                </Text>
                <MaterialCommunityIcons
                  name={friendStatus === "UNKOWN" ? "chat-outline" : "chat"}
                  size={22}
                  color={friendStatus === "UNKNOWN" ? "#0C9E04" : "#fff"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {/* <FavoriteSportsBadges sports={user?.profile.sportsOfPreference} /> */}
      <CustomTabMenu routes={routes} scenes={scenes} backgroundColor={"#fff"} />
    </SafeAreaView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  addFriendButton: {
    padding: 5,
    borderRadius: 5,
    width: "48%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
  },
  messageButton: {
    padding: 5,
    borderRadius: 5,
    width: "48%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    borderColor: "#0C9E04",
    borderWidth: 1,
  },
});
