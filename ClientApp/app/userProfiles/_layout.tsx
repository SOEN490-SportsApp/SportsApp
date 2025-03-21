import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Menu, Provider } from "react-native-paper";
import { Alert, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import themeColors from "@/utils/constants/colors";
import { useSelector } from "react-redux";
import { getSentFriendRequests, sendFriendRequest } from "@/utils/api/profileApiClient";

export default function UserProfilesLayout() {
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    const [isRequestSent, setIsRequestSent] = useState(false);
    const user = useSelector((state: { user: any }) => state.user);
    const isFriends = true; // TO BE IMPLEMENTED
    const { id: visitingUserId } = useLocalSearchParams<{ id: string }>();

    useEffect(() => {
        if (user?.id && visitingUserId) {
            fetchSentFriendRequests();
        }
    }, [user?.id, visitingUserId]);

    const fetchSentFriendRequests = async () => {
        try {
            const requests = await getSentFriendRequests(user.id);
            const hasSentRequest = requests.some((req: { friendRequestUserId: string; }) => req.friendRequestUserId === visitingUserId);
            setIsRequestSent(hasSentRequest);
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        }
    };

    const handleOptionPress = async (option: string) => {
        closeMenu();
        switch (option) {
            case "add":
                
                if (!user?.id) {
                    Alert.alert("Error", "User not found. Please log in.");
                    return;
                }
                try {
                    await sendFriendRequest(user.id, visitingUserId);
                    setIsRequestSent(true);
                    Alert.alert("Success", "Friend request sent successfully!");
                } catch (error) {
                    Alert.alert("Error", "Failed to send friend request.");
                }
                break;
            case "message":
                console.log("Start a chat selected");
                // Add send message logic
                break;
            default:
                break;
        }
    };

    return (
        <Provider>
            <Stack
                screenOptions={{
                    headerShown: true,
                    title: "",
                    headerLeft: () => (
                        <TouchableOpacity
                          onPress={() => router.back()}
                          style={{ marginLeft: 10 }}
                        >
                          <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                      ),
                }}
            />
        </Provider>
    );
}
