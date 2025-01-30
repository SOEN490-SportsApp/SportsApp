import React, { useEffect, useState } from 'react';
import { 
    View, Text, Image, ActivityIndicator, SafeAreaView, ScrollView, 
    TouchableOpacity, Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import CustomTabMenu from '@/components/Helper Components/CustomTabMenu';
import { useRouter } from 'expo-router';
import { UserState } from '@/types/user';
import { calculateAge } from '@/utils/helpers/ageOfUser';
import { useSelector } from 'react-redux';
import EventListProfilePageJoined from '@/components/Event/EventListProfilePageJoined';
import EventListProfilePageCreated from '@/components/Event/EventListProfilePageCreated';
import Ionicons from "react-native-vector-icons/Ionicons"; 
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const screenHeight = Dimensions.get('window').height;
const maxHeight = screenHeight * 0.5;

const getSportIcon = (sportName: string) => {
    switch (sportName.toLowerCase()) {
      case "football":
        return { name: "american-football", type: "Ionicons" }; 
      case "soccer":
        return { name: "soccer", type: "MaterialCommunityIcons" }; 
      case "basketball":
        return { name: "basketball", type: "Ionicons" }; 
      case "baseball":
        return { name: "baseball", type: "MaterialCommunityIcons" }; 
      case "cycling":
        return { name: "bike", type: "MaterialCommunityIcons" }; 
      case "ping-pong":
      case "table-tennis":
        return { name: "table-tennis", type: "MaterialCommunityIcons" }; 
      case "tennis":
        return { name: "tennis", type: "MaterialCommunityIcons" }; 
      case "rugby":
        return { name: "rugby", type: "MaterialCommunityIcons" }; 
      case "golf":
        return { name: "golf-tee", type: "MaterialCommunityIcons" }; 
      case "hockey":
        return { name: "hockey-sticks", type: "MaterialCommunityIcons" }; 
      case "boxing":
        return { name: "boxing-glove", type: "MaterialCommunityIcons" }; 
        case "hiking":
            return { name: "hiking", type: "MaterialCommunityIcons" };
      default:
        return { name: "help-circle", type: "Ionicons" }; 
    }
  };
  
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

// Activity tab content
const ActivityTab = () => (
    <View className="p-4 bg-white">
        <View>
            <EventListProfilePageJoined />
        </View>
    </View>
);

// Friends tab content
const FriendsTab = () => (
    <View className="p-4 bg-white flex-1">
        <ScrollView className="pt-3 space-y-4" style={{ maxHeight }}>
            {Array.from({ length: 6 }).map((_, index) => (
                <View key={index} className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#0C9E04' }}>
                    <Text className="text-xl font-bold text-black">Friend {index + 1}</Text>
                </View>
            ))}
        </ScrollView>
    </View>
);

// About tab content with user data
const AboutTab: React.FC<{ user: UserState }> = ({ user }) => {
    return (
        <View className="p-4 bg-white flex-1">
           <View>
                <EventListProfilePageCreated />
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
        { key: 'about', title: 'My Events', testID: 'About' },
    ];
    const scenes = {
        activity: <ActivityTab />,
        friends: <FriendsTab />,
        about: <AboutTab user={user} />,
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

            {/* Favorite Sports Badges */}
            <View className="mt-0 items-center">
                <View className="flex-row flex-wrap gap-2 mt-2 justify-center">
                    {user?.profile?.sportsOfPreference?.length ? (
                        user.profile.sportsOfPreference.map((sport: { name: string; ranking: string }, index: number) => (
                            <View 
                                key={index} 
                                className="px-3 py-1 rounded-full border border-gray-300 flex-row items-center"
                                style={{ backgroundColor: "white", minWidth: 100, margin: 4 }}
                            >
                                {["soccer", "baseball", "bike", "table-tennis", "tennis", "rugby", "golf-tee", "hockey-sticks", "boxing-glove","hiking"].includes(getSportIcon(sport.name).name) ? (
                                <MaterialCommunityIcons name={getSportIcon(sport.name).name} size={16} color={getSkillColor(sport.ranking)} style={{ marginRight: 4 }} />
                                ) : (
                                 <Ionicons name={getSportIcon(sport.name).name} size={16} color={getSkillColor(sport.ranking)} style={{ marginRight: 4 }} />
                                )}
                                <Text className="text-black text-sm">{sport.name}</Text>
                            </View>
                        ))
                    ) : (
                        <Text className="text-md text-gray-600">None</Text>
                    )}
                </View>
            </View>

            {/* CustomTabMenu */}
            <CustomTabMenu routes={routes} scenes={scenes} backgroundColor={"#fff"} />
        </SafeAreaView>
    );
};

export default ProfilePage;



