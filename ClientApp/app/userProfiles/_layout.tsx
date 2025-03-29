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
import { useTranslation } from "react-i18next";

export default function UserProfilesLayout() {
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    const [isRequestSent, setIsRequestSent] = useState(false);
    const user = useSelector((state: { user: any }) => state.user);
    const [isFriends, setIsFriends] = useState(false);
    const { id: visitingUserId } = useLocalSearchParams<{ id: string }>();
    const [friendList, setFriendList] = useState<Friend[]>([]);
    const { t } = useTranslation();

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
              Alert.alert(t('user_profiles_layout.error'), t('user_profiles_layout.user_not_found'));
              return;
            }
            try {
              await sendFriendRequest(user.id, visitingUserId);
              setIsRequestSent(true);
              Alert.alert(t('user_profiles_layout.success'), t('user_profiles_layout.friend_request_sent'));
            } catch (error) {
              Alert.alert(t('user_profiles_layout.error'), t('user_profiles_layout.failed_to_send_request'));
            }
            break;
      
            case "remove":
                Alert.alert(
                  t('user_profiles_layout.remove_friend'),
                  t('user_profiles_layout.remove_friend_confirmation'),
                  [
                    { text: t('user_profiles_layout.cancel'), style: "cancel" },
                    {
                      text: t('user_profiles_layout.yes'),
                      onPress: async () => {
                        try {
                          const matchedFriend = friendList.find(
                            (friend: Friend) => friend.friendUserId === visitingUserId
                          );
              
                          const realFriendId = matchedFriend?.FriendId; 

              
                          if (!realFriendId) {
                            Alert.alert(t('user_profiles_layout.error'), t('user_profiles_layout.could_not_find_user'));
                            return;
                          }
              
                          await removeFriendRequest(user.id, realFriendId);
                          setIsFriends(false);
                          Alert.alert(t('user_profiles_layout.success'), t('user_profiles_layout.friend_removed'));
                        } catch (error) {
                          Alert.alert(t('user_profiles_layout.error'), t('user_profiles_layout.failed_to_remove_friend'));
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
