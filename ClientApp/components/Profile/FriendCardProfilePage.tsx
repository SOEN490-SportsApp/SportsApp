import themeColors from "@/utils/constants/colors";
import { hs, mhs, mvs, vs } from "@/utils/helpers/uiScaler";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image} from "react-native";

const FriendCardProfilePage = ({ friend }: { friend: any }) => {
  const router = useRouter();
  const userId = friend.friendUserId;
  console.log(friend);
  return (
    <TouchableOpacity
      style={styles.cardHolder}
      onPress={() => router.push({pathname: `/(tabs)/home/userProfiles/[id]`, params: {id: userId}})}
    >
      <View style={styles.pictureSection}>
        <Image
          source={require("@/assets/images/avatar-placeholder.png")}
          style={[styles.participantAvatar]}
          testID="participant-avatar"
        />
      </View>
      <View style={styles.infoSection}>
        <View>
          <Text style={styles.userInfo}>
            {friend.profile.firstName + " " + friend.profile.lastName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

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
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  pictureSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  participantAvatar: {
    width: mhs(45),
    height: mvs(45),
    borderRadius: mhs(30),
  },
  infoSection: {
    display: "flex",
    flex: 4,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: vs(4),
  },
  userInfo: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: hs(5),
    color: "#333",
  },
});

export default FriendCardProfilePage;
