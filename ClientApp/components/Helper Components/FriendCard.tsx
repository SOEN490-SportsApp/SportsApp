import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Profile } from "@/types";
import themeColors from "@/utils/constants/colors";
import { useState } from "react";
import { hs, mhs, mvs, vs } from "@/utils/helpers/uiScaler";
import { useRouter } from "expo-router";

interface FriendCardProp {
  user: any;
}

function generateRandomFriendsInCommon() {
  return Math.floor(Math.random() * 50);
}

const FriendCard: React.FC<FriendCardProp> = ({ user }) => {
  const router = useRouter();
  const [requestSent, setRequestSent] = useState(false);
  const userId = user.userId;
  return (
    <TouchableOpacity
      style={styles.cardHolder}
      onPress={() => router.push({pathname: `/userProfiles/[id]`, params: {id: userId}})}
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
            {user.profileResponse.firstName + " " + user.profileResponse.lastName}{" "}
          </Text>
        </View>

        <View>
          <Text style={styles.subUserInfo}>
            {generateRandomFriendsInCommon()} - friends in common
          </Text>
        </View>
      </View>
      <View style={styles.addFriendSection}>
        <TouchableOpacity
          style={{ marginRight: 8 }}
          onPress={() => setRequestSent(!requestSent)}
        >
          {requestSent === false ? (
            <MaterialCommunityIcons
              name="account-plus"
              size={26}
              color="#aaa"
            />
          ) : (
            <MaterialCommunityIcons
              name="account-clock-outline"
              size={26}
              color="#aaa"
            />
          )}
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
    flex: 3,
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: vs(8),
  },
  tagContainer: {
    paddingHorizontal: hs(10),
    paddingVertical: vs(5),
    borderRadius: 15,
    marginRight: vs(5),
    marginBottom: hs(5),
  },
  tagText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  participantAvatar: {
    width: mhs(45),
    height: mvs(45),
    borderRadius: mhs(30),
  },
});
