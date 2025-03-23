import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import themeColors from "@/utils/constants/colors";
import { useState } from "react";
import { hs, mhs, mvs, vs } from "@/utils/helpers/uiScaler";
import { useRouter } from "expo-router";
import { sendFriendRequest } from "@/utils/api/profileApiClient";
import { useSelector } from "react-redux";

interface FriendCardProp {
  user: any;
}

const FriendCard: React.FC<FriendCardProp> = ({ user }) => {
  const router = useRouter();
  const currentUser = useSelector((state: { user: any }) => state.user);
  const [requestSent, setRequestSent] = useState(user.friendRequestStatus === "SENT");

  if (!user || !user.profileResponse) return null;

  const userId = user.userId;

  const handleSendRequest = async () => {
    try {
      await sendFriendRequest(currentUser.id, userId);
      setRequestSent(true);
    } catch (error) {
      console.log("Error sending friend request:", error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.cardHolder}
      onPress={() => router.push({ pathname: `/userProfiles/[id]`, params: { id: userId } })}
    >
      <View style={styles.pictureSection}>
        <Image
          source={require("@/assets/images/avatar-placeholder.png")}
          style={[styles.participantAvatar]}
          testID="participant-avatar"
        />
      </View>
      <View style={styles.infoSection}>
        <Text style={styles.userInfo}>
          {user.profileResponse.firstName + " " + user.profileResponse.lastName}
        </Text>
        <Text style={styles.subUserInfo}>
          {Math.floor(Math.random() * 50)} - friends in common
        </Text>
      </View>
      <View style={styles.addFriendSection}>
        <TouchableOpacity
          onPress={handleSendRequest}
          disabled={requestSent}
        >
          <MaterialCommunityIcons
            name={requestSent ? "account-clock-outline" : "account-plus"}
            size={26}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default FriendCard;

const styles = StyleSheet.create({
  cardHolder: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    padding: 8,
    minWidth: "90%",
    borderWidth: 1,
    borderColor: themeColors.border.light,
    justifyContent: "space-between",
    borderRadius: 10,
    marginVertical: vs(5),
    marginHorizontal: hs(5),
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  pictureSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  infoSection: {
    display: "flex",
    flex: 3,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: vs(16),
  },
  userInfo: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: hs(5),
    color: "#333",
  },
  subUserInfo: {
    fontSize: 10,
    color: themeColors.text.lightGrey,
  },
  addFriendSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: vs(8),
  },
  participantAvatar: {
    width: mhs(45),
    height: mvs(45),
    borderRadius: mhs(30),
  },
});
