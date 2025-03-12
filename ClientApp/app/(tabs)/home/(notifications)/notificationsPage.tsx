import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { setLoading, setNotifications, addFriendRequestNotification, addPushNotification } from "@/state/notifications/notificationSlice";
import FriendRequestNotification from "@/components/Helper Components/FriendRequestNotification";
import { router } from "expo-router";
import themeColors from "@/utils/constants/colors";
import { getReceivedFriendRequests } from "@/utils/api/profileApiClient";
import * as Notifications from "expo-notifications";

const NotificationsScreen: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const notifications = useSelector((state: RootState) => state.notifications.notifications);
    const loading = useSelector((state: RootState) => state.notifications.loading);
    const dispatch = useDispatch();
 
    useEffect(() => {
        async function fetchFriendRequests() {
            dispatch(setLoading(true));
            try {
                const data = await getReceivedFriendRequests(user.id);

                const formattedRequests = data.map((request: any) => ({
                    id: request.RequestId,
                    senderId: request.friendRequestUserId,
                    senderName: request.friendRequestUsername,
                    senderProfilePic: "",
                    timeAgo: "",
                    type: "friend_request",
                    status: request.status,
                }));

                const existingNotifications = notifications.filter(n => n.type !== "friend_request");
                dispatch(setNotifications([...existingNotifications, ...formattedRequests]));
            } catch (error) {
                console.error("Failed to fetch friend requests:", error);
            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchFriendRequests();
        
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            
            const newNotification = {
                id: notification.request.identifier,
                title: (notification.request.content.title ?? "No Title") as string, 
                message: (notification.request.content.body ?? "No message available") as string, 
                timeAgo: "Just now",
                type: "push_notification" as "push_notification", 
            };
                        
            dispatch(addPushNotification(newNotification));            
            
             });

        return () => {
            Notifications.removeNotificationSubscription(subscription);
        };
    }, [dispatch]);

    
    const friendRequests = notifications.filter(n => n.type === "friend_request");
    const pushNotifications = notifications.filter(n => n.type === "push_notification").slice(0, 3);

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: "#f9f9f9" }}>
            <View style={{ flex: 1, flexDirection: "column" }}>
                {/* Friend Requests Section  */}
                <View style={{ flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 15 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Friend Requests</Text>
                        <TouchableOpacity onPress={() => router.push("/(tabs)/home/(notifications)/friendRequestsPage")}>
                            <Text style={{ color: themeColors.background.dark }}>Show All</Text>
                        </TouchableOpacity>
                    </View>
                    {loading ? (
                        <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
                    ) : (
                        <FlatList
                            data={friendRequests}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <FriendRequestNotification
                                    userId={user.id}
                                    requestId={item.id}
                                    senderId={item.senderId}
                                    senderName={item.senderName}
                                    senderProfilePic={item.senderProfilePic ?? ""}
                                    timeAgo={item.timeAgo}
                                    status={item.status}
                                />
                            )}
                            style={{ flex: 1 }}
                            ListEmptyComponent={
                                <View style={{ alignItems: "center", padding: 20 }}>
                                    <Text style={{ fontSize: 16, color: "gray" }}>No new friend requests 🤝</Text>
                                    <Text style={{ fontSize: 14, color: "gray", marginTop: 5 }}>Check back later!</Text>
                                </View>
                            }
                        />
                    )}
                </View>

                {/* What's New Section */}
                <View style={{ flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 15, marginTop: 20 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>What's New?</Text>
                        <TouchableOpacity onPress={() => router.push("/(tabs)/home/(notifications)/whatIsNewPage")}>
                            <Text style={{ color: themeColors.background.dark }}>Show All</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={pushNotifications}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={{ padding: 15, backgroundColor: "#fff", borderRadius: 10, marginVertical: 8 }}>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.title}</Text>
                                <Text style={{ fontSize: 14, color: "gray", marginTop: 5 }}>{item.message}</Text>
                                <Text style={{ fontSize: 12, color: "gray", marginTop: 2 }}>{item.timeAgo}</Text>
                            </View>
                        )}
                        style={{ flex: 1 }}
                        ListEmptyComponent={
                            <View style={{ alignItems: "center", padding: 20 }}>
                                <Text style={{ fontSize: 16, color: "gray" }}>No new notifications 🎉</Text>
                                <Text style={{ fontSize: 14, color: "gray", marginTop: 5 }}>You're all caught up!</Text>
                            </View>
                        }
                    />
                </View>
            </View>
        </View>
    );
};

export default NotificationsScreen;
