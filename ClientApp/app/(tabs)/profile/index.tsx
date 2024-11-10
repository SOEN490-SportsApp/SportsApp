import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import axiosInstance from '@/api/axiosIntance';
import CustomTabMenu from '@/components/CustomTabMenu';

// Define the profile type
interface Profile {
    firstName: string;
    lastName: string;
    bio: string;
    email: string;
    username: string;
    profile: string;
    dateOfBirth: string;
    phoneNumber: number;
    ranking: number;
    preferences: {
        notifications: boolean;
        language: string;
    };
    dateCreated: Date;
    updatedAt: Date;
}

const screenHeight = Dimensions.get('window').height;
const maxHeight = screenHeight * 0.5

// Function to calculate age based on dateOfBirth
export function calculateAge(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}

// Activity tab content without swipe control
const ActivityTab = () => (
    //TODO fix the overlap between the two scroll views when the events are scolled up 
    <View className="p-4 bg-white">
        {/* Horizontal Scroll for Badges */}
        {/*TODO change this to a badge component */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-x-4">
                <View className="w-20 h-20 bg-gray-700 rounded-full" />
                <View className="w-20 h-20 bg-gray-700 rounded-full" />
                <View className="w-20 h-20 bg-gray-700 rounded-full" />
                <View className="w-20 h-20 bg-gray-700 rounded-full" />
                <View className="w-20 h-20 bg-gray-700 rounded-full" />
                <View className="w-20 h-20 bg-gray-700 rounded-full" />
                <View className="w-20 h-20 bg-gray-700 rounded-full" />
                <View className="w-20 h-20 bg-gray-700 rounded-full" />
            </View>
        </ScrollView>

        {/* Vertical Scroll for Event Cards */}
        {/*TODO change this to an event component */}
        <ScrollView className=" pt-3 space-y-4" style={{ maxHeight}}>
            {Array.from({ length: 6 }).map((_, index) => (
                <View key={index} className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#0C9E04' }}>
                    <Text className="text-xl font-bold text-black">EVENT {index + 1}</Text>
                    <Text className="text-gray-800 text-sm">Location</Text>
                    <Text className="text-gray-800 text-xs mt-1">Date</Text>
                </View>
            ))}
        </ScrollView>
    </View>
);

// Stats tab content
const StatsTab = () => (
    <View className="p-4 bg-white flex-1">
        <Text className="text-lg font-semibold text-black">Running</Text>
        <View className="h-40 rounded-lg mt-4" style={{ backgroundColor: '#0C9E04' }}/>
    </View>
);


// About tab content
const AboutTab: React.FC<{ profile: Profile }> = ({ profile }) => (
    //TODO change this to an About component
    <View className="p-4 bg-white flex-1">
        <View className= "rounded-lg p-4" style={{ backgroundColor: '#0C9E04' }}>
            <Text testID="Bio" className="text-black text-base">Bio: {profile.bio}</Text>
            <Text testID="Age" className="text-black text-base mt-2">Age: {calculateAge(profile.dateOfBirth)}</Text>
            <Text testID="email" className="text-black text-base mt-2">email: {profile.email}</Text>
            <Text testID="phone" className="text-black text-base mt-2">phone: {profile.phoneNumber}</Text>
        </View>
    </View>
);

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<Profile>({
        firstName: 'Placeholder',
        lastName: 'Placeholder',
        bio: 'Placeholder: This is a short default bio description.',
        email: "default_email@example.com",
        username: "userNameDefault",
        profile: "",
        dateOfBirth: '1995-08-13',
        phoneNumber: 555555555,
        ranking: 10,
        preferences: {
            notifications: true,
            language: "en"
        },
        dateCreated: new Date('2024-08-13'),
        updatedAt: new Date('2024-08-13'),   
    });

    const [loading, setLoading] = useState<boolean>(true);

    const fetchProfileData = async () => {
        try {
            const response = await axiosInstance.get<Profile>('/users/2');
            setProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch profile data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator testID= "loading" size="large" color="#0C9E04" />
            </View>
        );
    }

    // CustomTabMenu links for titles and content 
    const routes = [
        { key: 'activity', title: 'Activity', testID: 'Activity' },
        { key: 'stats', title: 'Stats', testID: 'Stats' },
        { key: 'about', title: 'About', testID: 'About'},
    ];
    const scenes = {
        activity: <ActivityTab />,
        stats: <StatsTab />,
        about: <AboutTab profile={profile} />,
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Top Header with Edit Button */}
            <View className="flex-row justify-center items-center p-4 relative">
                <Text className="text-2xl font-bold text-black">Profile</Text>
                <TouchableOpacity 
                    onPress={() => console.log("Edit Profile Pressed")} 
                    className="absolute right-4" // Position Edit button in top-right
                >
                    <Text className="text-blue-600 font-semibold">Edit</Text>
                </TouchableOpacity>
            </View>
            
            {/* Profile Header */}
            <View className="items-center p-4 bg-white">
                <Image
                    className="w-20 h-20 rounded-full"
                    source={{ uri: profile.profile || 'https://example.com/profile-image.png' }}
                    defaultSource={require('@/assets/images/Unknown.jpg')}
                />
                <Text testID="firstName" className="text-2xl font-bold text-black mt-4">
                    {profile.firstName} {profile.lastName}
                </Text>
                {/*TODO change this with update data base option*/}
                <Text className="text-sm text-gray-500">Add Location</Text>
            </View>

            {/* CustomTabMenu with dynamic routes and scenes */}
            <CustomTabMenu routes={routes} scenes={scenes} />
        </SafeAreaView>
    );
};

export default ProfilePage;
