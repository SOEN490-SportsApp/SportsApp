import React, { useEffect, useState } from 'react';
import { 
    View, Text, Image, ActivityIndicator, SafeAreaView, ScrollView, 
    TouchableOpacity, Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import CustomTabMenu from '@/components/Helper Components/CustomTabMenu';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import EventList from '@/components/Event/EventList';
import { getEventsCreated, getEventsJoined } from '@/services/eventService';
import FavoriteSportsBadges from '@/components/FavoriteSportsBadges';
import FriendsList from '@/components/Profile/FriendsList';


const screenHeight = Dimensions.get('window').height;
const maxHeight = screenHeight * 0.5;

const ActivityTab = () => {
    const user = useSelector((state: { user: any }) => state.user);
  
    return (
      <View className="p-4 bg-white">
        <View>
          <EventList fetchEventsFunction={(page, size) => getEventsJoined(user.id, page, size)} />
        </View>
      </View>
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
  }

// About tab content with user data
const MyEvents = () => {
    const user = useSelector((state: { user: any }) => state.user);
  
    return (
      <View className="p-4 bg-white">
        <View>
          <EventList fetchEventsFunction={(page, size) => getEventsCreated(user.id, page, size)} />
        </View>
      </View>
    );
};

const ProfilePage: React.FC = () => {
    const router = useRouter();
    const user = useSelector((state: { user: any }) => state.user);
    const [loading, setLoading] = useState<boolean>(true);

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
        { key: 'activity', title: 'Activity', testID: 'Activity' },
        { key: 'friends', title: 'Friends', testID: 'Friends' },
        { key: 'MyEvents', title: 'My Events', testID: 'MyEvents' },
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
                    onPress={() => router.push('/editProfile')}
                    className="absolute left-4"
                >
                    <Text className="text-base font-bold" style={{ color: "#007AFF" }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/profile/(settings)/settingsPage')}
                    className="absolute right-4"
                >
                    <Icon name="settings-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Profile Header */}
            <View className="items-center p-4 bg-white">
                <Image
                    className="w-20 h-20 rounded-full"
                    source={require("@/assets/images/avatar-placeholder.png")}
                    defaultSource={require('@/assets/images/Unknown.jpg')}
                />
                <Text testID="firstName" className="text-2xl font-bold text-black mt-2">
                    {user?.profile.firstName} {user?.profile.lastName}
                </Text>
            </View>
            <FavoriteSportsBadges sports={user?.profile.sportsOfPreference} />

            {/* CustomTabMenu */}
            <CustomTabMenu routes={routes} scenes={scenes} backgroundColor={"#fff"} />
        </SafeAreaView>
    );
};

export default ProfilePage;



