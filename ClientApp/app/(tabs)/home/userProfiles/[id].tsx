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
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import CustomTabMenu from "@/components/Helper Components/CustomTabMenu";
import { getOtherUserProfile } from "@/utils/api/profileApiClient";
import { calculateAge } from "@/utils/helpers/ageOfUser";
import { getEventsByUserId } from "@/utils/api/profileApiClient";
import EventCard from "@/components/Event/EventCard";
import UserInfoCard from "@/components/Helper Components/UserInfoCard";
import { Event } from "@/types/event";
import FavoriteSportsBadges from "@/components/FavoriteSportsBadges";
import { getFriendsOfUser } from "@/services/userService";
import { Friend } from "@/types";
import { useSelector } from "react-redux";

const screenHeight = Dimensions.get("window").height;
const maxHeight = screenHeight * 0.5;

const ActivityTab = ({ userId }: { userId: string }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFriends, setIsFriends] = useState(false);
  const user = useSelector((state: { user: any }) => state.user);
  const { id: visitingUserId } = useLocalSearchParams<{ id: string }>();

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

  const fetchUserFriends = async () => {
    try {
      const friendList = await getFriendsOfUser(user.id);
      setIsFriends(
        friendList.some(
          (friend: Friend) => friend.friendUserId === visitingUserId
        )
      );
    } catch (error: any) {
      console.log(error);
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
      />
    </View>
  );
};

const ProfilePage: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getOtherUserProfile(id!);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

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
      <View className="items-center p-4 bg-white">
        <Image
          className="w-20 h-20 rounded-full"
          source={require("@/assets/images/avatar-placeholder.png")}
          defaultSource={require("@/assets/images/Unknown.jpg")}
        />
        <Text testID="firstName" className="text-2xl font-bold text-black mt-2">
          {user?.profile.firstName} {user?.profile.lastName}
        </Text>
      </View>
      <FavoriteSportsBadges sports={user?.profile.sportsOfPreference} />
      <CustomTabMenu routes={routes} scenes={scenes} backgroundColor={"#fff"} />
    </SafeAreaView>
  );
};

export default ProfilePage;
