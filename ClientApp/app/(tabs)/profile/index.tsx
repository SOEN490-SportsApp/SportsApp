import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CustomTabMenu from "@/components/Helper Components/CustomTabMenu";
import { useRouter } from "expo-router";
import { UserState } from "@/types/user";
import { calculateAge } from "@/utils/helpers/ageOfUser";
import { useSelector } from "react-redux";
import EventListProfilePage from "@/components/Event/EventListProfilePage";

const screenHeight = Dimensions.get("window").height;
const maxHeight = screenHeight * 0.5;

// Activity tab content
const ActivityTab = () => (
  <View className="p-4 bg-white">
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-x-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <View key={index} className="w-20 h-20 bg-gray-700 rounded-full" />
        ))}
      </View>
    </ScrollView>
    <View>
      <EventListProfilePage />
    </View>
  </View>
);

// Friends tab content
const FriendsTab = () => (
  <View className="p-4 bg-white flex-1">
    <ScrollView className="pt-3 space-y-4" style={{ maxHeight }}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View
          key={index}
          className="mt-4 p-4 rounded-lg"
          style={{ backgroundColor: "#0C9E04" }}
        >
          <Text className="text-xl font-bold text-black">Friend {index + 1}</Text>
        </View>
      ))}
    </ScrollView>
  </View>
);

// About tab content with user data
const AboutTab: React.FC<{ user: UserState }> = ({ user }) => {
  let age = "N/A";
  try {
    age = calculateAge(user).toString();
  } catch (error) {
    console.error("Error calculating age:", error);
    age = "Invalid Date of Birth";
  }

  return (
    <View className="p-4 bg-white flex-1">
      <View className="rounded-lg p-4" style={{ backgroundColor: "#0C9E04" }}>
        <Text testID="Gender" className="text-black text-base">
          Gender: {user.profile.gender || "Not Provided"}
        </Text>
        <Text testID="Age" className="text-black text-base mt-2">
          Age: {age}
        </Text>
        <Text testID="Phone" className="text-black text-base mt-2">
          Phone: {user?.profile.phoneNumber || "Not Provided"}
        </Text>
      </View>
    </View>
  );
};

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const user = useSelector((state: { user: any }) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPressed, setIsPressed] = useState(false); // Track button press state

  useEffect(() => {
    console.log("Updated Redux User Data:", user);
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator testID="loading" size="large" color="#0C9E04" />
      </View>
    );
  }

  // Extract and format sports preferences
  const formattedSports = user?.profile?.sportsOfPreference?.length
    ? user.profile.sportsOfPreference
        .map((sport: { name: string; ranking: string }) => `${sport.name} - ${sport.ranking}`)
        .join(", ")
    : "None";

  // CustomTabMenu links
  const routes = [
    { key: "activity", title: "Activity", testID: "Activity" },
    { key: "friends", title: "Friends", testID: "Friends" },
    { key: "about", title: "My Events", testID: "About" },
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
          onPressIn={() => setIsPressed(true)} 
          onPressOut={() => setIsPressed(false)} 
          onPress={() => router.push("/editProfile")}
          className="absolute left-4"
        >
          <Text
            className="text-base font-bold"
            style={{ color: isPressed ? "#007AFF" : "#808080" }} 
          >
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile/(settings)/settingsPage")}
          className="absolute right-4"
        >
          <Icon name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Header */}
      <View className="items-center p-4 bg-white">
        <Image
          className="w-20 h-20 rounded-full"
          source={{ uri: "https://example.com/profile-image.png" }}
          defaultSource={require("@/assets/images/Unknown.jpg")}
        />
        <Text testID="firstName" className="text-2xl font-bold text-black mt-2">
          {user?.profile.firstName} {user?.profile.lastName}
        </Text>
        <Text className="text-sm text-gray-500">
          {user?.profile.postalCode.slice(0, 3)}
        </Text>

        {/* Added Favorite Sports */}
        <View className="mt-4">
          <Text className="text-lg font-semibold text-black">Favorite Sports</Text>
          <Text className="text-md text-gray-600">{formattedSports}</Text>
        </View>
      </View>

      {/* CustomTabMenu with dynamic routes and scenes */}
      <CustomTabMenu routes={routes} scenes={scenes} backgroundColor={"#fff"} />
    </SafeAreaView>
  );
};

export default ProfilePage;

