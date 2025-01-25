import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Profile } from "@/types";
import themeColors from "@/utils/constants/colors";
import { useState } from "react";

interface FriendCardProp {
  user: Profile;
}

function generateRandomFriendsInCommon() {
  return Math.floor(Math.random() * 50);;
}

const FriendCard: React.FC<FriendCardProp> = ({ user }) => {
  const [requestSent, setRequestSent] = useState(false);

  return (
    <TouchableOpacity
      style={styles.cardHolder}
      onPress={() => alert("Redirect to profile..")}
    >
      <View style={styles.pictureSection}>
        <MaterialCommunityIcons name="account" size={50} color="#94504b" />
      </View>
      <View style={styles.infoSection}>
        <View>
          <Text style={styles.userInfo}>
            {user.firstName + " " + user.lastName}{" "}
          </Text>
        </View>

        <View>
          <Text style={styles.subUserInfo}>{generateRandomFriendsInCommon()} - friends in common</Text>
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
    marginVertical: 5,
    marginHorizontal: 5,
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
    marginLeft: 16,
  },
  userInfo: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
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
    marginRight: 8,
  },
  tagContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});
