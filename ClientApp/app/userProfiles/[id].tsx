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
  removeFriendRequest,
} from "@/utils/api/profileApiClient";
import { calculateAge } from "@/utils/helpers/ageOfUser";
import { getEventsByUserId } from "@/utils/api/profileApiClient";
import EventCard from "@/components/Event/EventCard";
import UserInfoCard from "@/components/Helper Components/UserInfoCard";
import { Event } from "@/types/event";
import { getFriendsOfUser } from "@/services/userService";
import { useSelector } from "react-redux";
import { Friend } from "@/types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { hs, vs } from "@/utils/helpers/uiScaler";
import ProfileSection from "@/components/Profile/ProfileSection";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEventsByUserId(userId);
      const eventData: Event[] = response.content;
      setEvents(eventData || []);
    } catch (error) {
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
        <Text className="text-center text-gray-500">{t('other_user_profile.no_events_found')}</Text>
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
              isForVisitedProfile={true}
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

const FriendsTab = () => {
  const { t } = useTranslation();
  return (
    <View className="p-4 bg-white flex-1">
      <ScrollView className="pt-3 space-y-4" style={{ maxHeight }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View
            key={index}
            className="mt-4 p-4 rounded-lg"
            style={{ backgroundColor: "#0C9E04" }}
          >
            <Text className="text-xl font-bold text-black">
            {t('other_user_profile.friend')} {index + 1}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const AboutTab: React.FC<{ user: any }> = ({ user }) => {
  let age = "N/A";
  try {
    age = calculateAge(user).toString();
  } catch (error) {
    console.error("Error calculating age:", error);
    age = "Invalid Date of Birth";
  }

  return (
    <View className="p-4  bg-white flex-1">
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
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getOtherUserProfile(id!);
        setUser(userData);
        await fetchUserFriends();
      } catch (error) {
    
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleFriendRequest = async () => {
    try {
      if (friendStatus !== "UNKNOWN") return;
  
      const response = await sendFriendRequest(visitingUser.id, id);
  
      if (response) {
        setFriendStatus("PENDING");
        await fetchUserFriends(); 
      } else {
        Alert.alert(t('other_user_profile.error'), t('other_user_profile.failed_to_send_request'));
      }
    } catch (err: any) {
    }
  };
    
  const handleRemoveFriend = async () => {
    Alert.alert(
      t('other_user_profile.remove_friend'),
      t('other_user_profile.remove_friend_confirmation'),
      [
        { text: t('other_user_profile.cancel'), style: "cancel" },
        {
          text: t('other_user_profile.yes'),
          onPress: async () => {
            try {
              const matchedFriend = friendList.find(
                (friend: Friend) => friend.friendUserId === id
              );
  
              const realFriendId = matchedFriend?.FriendId;
  
              if (!realFriendId) {
                Alert.alert(t('other_user_profile.error'), t('other_user_profile.could_not_find_user'));
                return;
              }
  
              const success = await removeFriendRequest(visitingUser.id, realFriendId);
  
              if (success) {
                setFriendStatus("UNKNOWN");
                Alert.alert(t('other_user_profile.success'), t('other_user_profile.friend_removed'));
                await fetchUserFriends(); 
              }
            } catch (error) {
              Alert.alert(t('other_user_profile.error'), t('other_user_profile.failed_to_remove_friend'));
            }
          },
        },
      ]
    );
  };
    
  const fetchUserFriends = async () => {
    if (!id) return;
    try {
      const friendList = await getFriendsOfUser(visitingUser.id);
      const friendRequest = await getSentFriendRequests(visitingUser.id);
      setFriendList(friendList);
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
        <Text className="text-lg text-red-500">{t('other_user_profile.failed_to_load_user_data')}</Text>
      </View>
    );
  }

  const routes = [
    { key: "activity", title: t('other_user_profile.activity'), testID: "Activity" },
    { key: "friends", title: t('other_user_profile.friends'), testID: "Friends" },
    { key: "about", title: t('other_user_profile.about'), testID: "About" },
  ];
  const scenes = {
    activity: <ActivityTab userId={id} />,
    friends: <FriendsTab />,
    about: <AboutTab user={user} />,
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      <ProfileSection
        user={user}
        friendStatus={friendStatus}
        handleFriendRequest={handleFriendRequest}
        handleRemoveFriend={handleRemoveFriend}
        isUserProfile={false}
      />
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
