import React from "react"; // Remove useEffect import
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FriendRequestNotification from "@/components/Helper Components/FriendRequestNotification";
import { RootState } from "@/state/store";

export default function FriendRequestsPage() {
    const user = useSelector((state: RootState) => state.user);
    const notifications = useSelector((state: RootState) => state.notifications.notifications);
    const loading = useSelector((state: RootState) => state.notifications.loading); // You can keep loading state if you want to pass it down from NotificationsScreen, otherwise, remove this line and useSelector for loading

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: "#f9f9f9" }}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    padding: 15,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 3,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Friend Requests</Text>
                </View>
                {loading ? ( // Keep loading check if you are passing loading from NotificationsScreen, otherwise, remove this whole conditional and just use FlatList
                    <ActivityIndicator size="large" color="blue" />
                ) : notifications.filter(n => n.type === 'friend_request').length === 0 ? ( // Filter friend requests here
                    <Text style={{ textAlign: "center", color: "gray" }}>No friend requests</Text>
                ) : (
                    <FlatList
                        data={notifications.filter(n => n.type === 'friend_request')}
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
                    />
                )}
            </View>
        </View>
    );
}