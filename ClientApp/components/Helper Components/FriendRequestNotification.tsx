import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { respondToFriendRequest } from "@/utils/api/profileApiClient";
import { removeNotification } from "@/state/notifications/notificationSlice";

type FriendRequestNotificationProps = {
  userId: string,
  requestId: string;
  senderId: string;
  senderName: string;
  senderProfilePic: string;
  timeAgo: string;
  status: string;
};

const FriendRequestNotification: React.FC<FriendRequestNotificationProps> = ({ userId, requestId, senderId, senderName, senderProfilePic, timeAgo, status }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleAccept = async () => {
    try {
      await respondToFriendRequest(userId, senderId, requestId, "ACCEPT");
      dispatch(removeNotification(requestId));
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    }
  };

  const handleDecline = async () => {
    try {
      await respondToFriendRequest(userId, senderId, requestId, "DECLINE");
      dispatch(removeNotification(requestId));
    } catch (error) {
      console.error("Failed to decline friend request:", error);
    }
  };


  return (
    <TouchableOpacity onPress={() => router.push({ pathname: "/userProfiles/[id]", params: { id: senderId } })} activeOpacity={0.8}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#f9f9f9", borderRadius: 10, marginVertical: 8, elevation: 2 }}>
        <Image source={require("@/assets/images/avatar-placeholder.png")} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{senderName}</Text>
          <Text style={{ fontSize: 14, color: "gray" }}>{timeAgo}</Text>
        </View>
        {status === "ACCEPTED" ? (
          <Text style={{ color: "green", fontWeight: "bold" }}>Accepted</Text>
        ) : status === "RECEIVED" ? (
          <>
            <TouchableOpacity onPress={handleAccept} testID="accept-button" style={{ marginRight: 10 }}>
              <Ionicons name="checkmark-circle-outline" size={28} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDecline} testID="decline-button">
              <Ionicons name="close-circle-outline" size={28} color="gray" />
            </TouchableOpacity>
          </>
        ) : (
          <Text style={{ color: "red", fontWeight: "bold" }}>Declined</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default FriendRequestNotification;
