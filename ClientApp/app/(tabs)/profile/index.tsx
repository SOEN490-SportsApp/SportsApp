import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CustomTabMenu from "@/components/Helper Components/CustomTabMenu";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import EventList from "@/components/Event/EventList";
import { getEventsCreated, getEventsJoined } from "@/services/eventService";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FavoriteSportsBadges from "@/components/FavoriteSportsBadges";
import FriendsList from "@/components/Profile/FriendsList";
import MyCalendar from "@/components/Calendar/MyCalendar";
import ProfileSection from "@/components/Profile/ProfileSection";
import ProfilePageActivityFeed from "@/components/Profile/ProfilePageActivityFeed";
import ProfilePageCreatedFeed from "@/components/Profile/ProfilePageCreatedFeed";
import { useTranslation } from 'react-i18next';

const screenHeight = Dimensions.get("window").height;
const maxHeight = screenHeight * 0.5;

// Helper function to assign color based on skill level
const getSkillColor = (ranking: string) => {
  switch (ranking.toLowerCase()) {
    case "beginner":
      return "#228B22";
    case "intermediate":
      return "#FFD700";
    case "advanced":
      return "#FF0000";
    default:
      return "#808080";
  }
};

const ActivityTab = () => {
  return (
    <ProfilePageActivityFeed />
  );
};

// Friends tab content
const FriendsTab = () => {
  const user = useSelector((state: { user: any }) => state.user);
  return (
    <View className="p-4 bg-white flex-1">
      <FriendsList userId={user.id} />
    </View>
  );
};

// About tab content with user data
const MyEvents = () => {

  return (
    <ProfilePageCreatedFeed />
  );
};

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const user = useSelector((state: { user: any }) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator testID="loading" size="large" color="#0C9E04" />
      </View>
    );
  }

  // CustomTabMenu links
  const routes = [
    { key: "activity", title: t('profile_page.activity'), testID: "Activity" },
    { key: "friends", title: t('profile_page.friends'), testID: "Friends" },
    { key: "MyEvents", title: t('profile_page.my_events'), testID: "MyEvents" },
  ];
  const scenes = {
    activity: <ActivityTab />,
    friends: <FriendsTab />,
    MyEvents: <MyEvents />,
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      {/* Top Header with Edit Button */}
      <View className="flex-row justify-center items-center p-3 relative">
        <TouchableOpacity
          onPress={() => router.push("/editProfile")}
          className="absolute left-4"
        >
          <Text className="text-base font-bold" style={{ color: "#007AFF" }}>
            {t('profile_page.edit')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile/(settings)/settingsPage")}
          className="absolute right-4"
        >
          <Icon name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

        <ProfileSection
          user={user}
          isUserProfile={true}
          friendStatus={null}
          handleFriendRequest={function (): void | Promise<void> | null {
            throw new Error("Function not implemented.");
          }}
        />
      {/* </View> */}
      {/* <FavoriteSportsBadges sports={user?.profile.sportsOfPreference} /> */}

      {/* CustomTabMenu */}
      <CustomTabMenu routes={routes} scenes={scenes} backgroundColor={"#fff"} />
    </SafeAreaView>
  );
};

export default ProfilePage;
