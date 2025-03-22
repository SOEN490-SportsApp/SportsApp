import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Menu, Provider } from "react-native-paper";
import { Alert, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import themeColors from "@/utils/constants/colors";
import { useSelector } from "react-redux";
import { Friend } from "@/types";
import { getFriendsOfUser } from "@/services/userService";
import { getSentFriendRequests, sendFriendRequest, removeFriendRequest} from "@/utils/api/profileApiClient";

export default function UserProfilesLayout() {
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    const [isRequestSent, setIsRequestSent] = useState(false);
    const user = useSelector((state: { user: any }) => state.user);
    const [isFriends, setIsFriends] = useState(false);
    const { id: visitingUserId } = useLocalSearchParams<{ id: string }>();
    const [friendList, setFriendList] = useState<Friend[]>([]);

    useEffect(() => {
        if (user?.id && visitingUserId) {
            fetchSentFriendRequests();
            checkIfFriends();
        }
    }, [user?.id, visitingUserId]);

    const checkIfFriends = async () => {
        try {
          const fetchedFriends = await getFriendsOfUser(user.id);
          setFriendList(fetchedFriends); 
          const found = fetchedFriends.some(
            (friend: Friend) => friend.friendUserId === visitingUserId
          );
          setIsFriends(found);
        } catch (error) {
          //console.error("Error checking friendship:", error);
        }
      };
      
    const fetchSentFriendRequests = async () => {
        try {
            const requests = await getSentFriendRequests(user.id);
            const hasSentRequest = requests.some((req: { friendRequestUserId: string; }) => req.friendRequestUserId === visitingUserId);
            setIsRequestSent(hasSentRequest);
        } catch (error) {
            //console.error("Error fetching friend requests:", error);
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
      
            case "remove":
                Alert.alert(
                  "Remove Friend",
                  "Are you sure you want to remove this friend?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Yes",
                      onPress: async () => {
                        try {
                          const matchedFriend = friendList.find(
                            (friend: Friend) => friend.friendUserId === visitingUserId
                          );
              
                          const realFriendId = matchedFriend?.FriendId; 

              
                          if (!realFriendId) {
                            Alert.alert("Error", "Could not find friendId to remove.");
                            return;
                          }
              
                          await removeFriendRequest(user.id, realFriendId);
                          setIsFriends(false);
                          Alert.alert("Success", "Friend removed successfully.");
                        } catch (error) {
                          Alert.alert("Error", "Failed to remove friend.");
                        }
                      },
                    },
                  ]
                );
                break;       
            case "message":
            console.log("Start a chat selected");
            // Add send message logic here
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
                            {!isFriends && !isRequestSent && (
                        <Menu.Item onPress={() => handleOptionPress("add")} title="Add Friend" />
                            )}

                            {isFriends && (
                        <Menu.Item onPress={() => handleOptionPress("remove")} title="Remove Friend" />
                            )}

                        <Menu.Item onPress={() => handleOptionPress("message")} title="Send a Message" />
                        </Menu>
                    ),
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
