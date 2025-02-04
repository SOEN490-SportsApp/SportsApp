import React, { useState } from "react";
import { router, Stack } from "expo-router";
import { Menu, Provider } from "react-native-paper";
import { Alert, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import themeColors from "@/utils/constants/colors";
import { useSelector } from "react-redux";
import { sendFriendRequest } from "@/utils/api/profileApiClient";

export default function UserProfilesLayout() {
    const [menuVisible, setMenuVisible] = useState(false);
    const user = useSelector((state: { user: any }) => state.user);
    const visitingUserId = "679cf7bd6dfc9749eedcf82c"; // Hardcoded for now

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const handleOptionPress = async (option: string) => {
        closeMenu();
        switch (option) {
            case "add":
                console.log("Send friend request selected");
                if (!user?.id) {
                    Alert.alert("Error", "User not found. Please log in.");
                    return;
                }
                try {
                    await sendFriendRequest(user.id, visitingUserId);
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
                    headerRight: () => (
                        <Menu
                            style={{
                                backgroundColor: themeColors.background.lightGrey,
                                position: "absolute",
                                top: 50,
                                right: 10,
                                left: "auto",
                            }}
                            visible={menuVisible}
                            onDismiss={closeMenu}
                            anchor={
                                <TouchableOpacity onPress={openMenu}>
                                    <MaterialCommunityIcons name="dots-vertical" size={24} />
                                </TouchableOpacity>
                            }>
                            <Menu.Item onPress={() => handleOptionPress("add")} title="Add Friend" />
                            <Menu.Item onPress={() => handleOptionPress("message")} title="Send a Message" />
                        </Menu>
                    ),
                }}
            />
        </Provider>
    );
}
