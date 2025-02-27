import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { hs, mhs, mvs, vs } from "@/utils/helpers/uiScaler";
import FavoriteSportsBadges from "../FavoriteSportsBadges";

interface ProfileRequest {
  user: any | null;
  friendStatus: string | null;
  handleFriendRequest: () => void | Promise<void> | null;
  isUserProfile: boolean;
}

const ProfileSection: React.FC<ProfileRequest> = ({
  user,
  friendStatus,
  handleFriendRequest,
  isUserProfile,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator testID="loading" size="large" color="#0C9E04" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-500">Failed to load user data</Text>
      </View>
    );
  }

  return (
    <>
      <ImageBackground
        className="flex flex-1 items-start justify-end"
        style={{ height: vs(320), marginTop: isUserProfile ? 16 : 0 }}
        resizeMode="cover"
        source={require("@/assets/images/testBackground.jpg")}
        defaultSource={require("@/assets/images/Unknown.jpg")}
      />

      <View
        className=""
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingVertical: mvs(15),
          marginTop: mhs(-200),
          borderColor: "#FFF",
          backgroundColor: "#FFF",
        }}
      >
        <View className="items-center flex flex-row gap-4">
          <View style={styles.container}>
            <Text testID="firstName" style={{ fontSize: 26, fontWeight: 700, marginBottom: vs(4) }}>
              {user?.profile.firstName} {user?.profile.lastName}
            </Text>
            <View style={styles.headerContainer}>
              {!isUserProfile ? (
                <>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        backgroundColor:
                          friendStatus === "UNKNOWN" ? "#0C9E04" : "#fff",
                        borderColor:
                          friendStatus !== "UNKNOWN" ? "#0C9E04" : "#fff",
                      },
                    ]}
                    onPress={handleFriendRequest}
                  >
                    <Text
                      className="font-bold"
                      style={{
                        color: friendStatus === "UNKNOWN" ? "#fff" : "#0C9E04",
                      }}
                    >
                      {friendStatus === "ACCEPTED"
                        ? "Friends"
                        : friendStatus === "PENDING"
                        ? "Pending"
                        : "Add"}
                    </Text>
                    <MaterialCommunityIcons
                      name={
                        friendStatus === "ACCEPTED"
                          ? "check"
                          : friendStatus === "PENDING"
                          ? "account-clock"
                          : "account-plus"
                      }
                      size={22}
                      color={friendStatus === "UNKNOWN" ? "#fff" : "#0C9E04"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        backgroundColor:
                          friendStatus === "UNKNOWN" ? "#fff" : "#0C9E04",
                      },
                    ]}
                  >
                    <Text
                      className="font-bold"
                      style={{
                        color: friendStatus === "UNKNOWN" ? "#0C9E04" : "#fff",
                      }}
                    >
                      Message
                    </Text>
                    <MaterialCommunityIcons
                      name={friendStatus === "UNKOWN" ? "chat-outline" : "chat"}
                      size={22}
                      color={friendStatus === "UNKNOWN" ? "#0C9E04" : "#fff"}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <FavoriteSportsBadges
                  sports={user?.profile.sportsOfPreference}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default ProfileSection;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    marginLeft: vs(8),
    width: "91.6667%",
  },
  button: {
    marginTop:vs(8),
    padding: 5,
    borderRadius: 5,
    width: "48%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    borderColor: "#0C9E04",
    borderWidth: 1,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  },
});
