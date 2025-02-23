import React from "react"; // Remove useEffect import
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FriendRequestNotification from "@/components/Helper Components/FriendRequestNotification";
import { RootState } from "@/state/store";

export default function FriendRequestsPage() {
    const user = useSelector((state: RootState) => state.user);
    const notifications = useSelector((state: RootState) => state.notifications.notifications);
    const loading = useSelector((state: RootState) => state.notifications.loading);

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
        </View>
    );
}