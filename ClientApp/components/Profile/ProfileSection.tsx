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
import themeColors from "@/utils/constants/colors";
import { createUserChatroom } from "@/services/chatService";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

interface ProfileRequest {
  visitedId: string;
  user: any | null;
  friendStatus: string | null;
  handleFriendRequest: () => void | Promise<void> | null;
  handleRemoveFriend?: () => void | Promise<void>;
  isUserProfile: boolean;
}

const ProfileSection: React.FC<ProfileRequest> = ({
  visitedId,
  user,
  friendStatus,
  handleFriendRequest,
  handleRemoveFriend,
  isUserProfile,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const loggedInUser = useSelector((state: { user: any }) => state.user);  
  const { t } = useTranslation();

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
        <Text className="text-lg text-red-500">{t('profile_section.failed_to_load_user_data')}</Text>
      </View>
    );
  }

  const handlePressMessage = async () => {
    // Handle press event
    console.log("Message button pressed");
    try{
      const response = await createUserChatroom(loggedInUser.id, visitedId, user.username, [], false, false);          
    }catch(e){
      console.log("Error in handlePress", e);
    }
  };

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
            <View
              style={{
                display:'flex',
                flexDirection:'row',
                gap:vs(8),
                width:'86%',
                alignItems:'baseline'
              }}
            >
              <Text
                testID="firstName"
                style={{ fontSize: 26, fontWeight: 700, marginBottom: vs(4) }}
              >
                {user?.profile.firstName} {user?.profile.lastName}
              </Text>
              <Text style={{fontSize:18, color:themeColors.border.dark}}>@{user?.username}</Text>
            </View>
            <View style={styles.headerContainer}>
              {!isUserProfile ? (
                <>
                  {friendStatus === "ACCEPTED" ? (
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: "#fff", borderColor: "#0C9E04" }]}
                      onPress={handleRemoveFriend}
                    >
                      <Text style={{ color: "#0C9E04", fontWeight: "bold" }}>{t('profile_section.unfriend')}</Text>
                      <MaterialCommunityIcons name="account-remove" size={22} color="#0C9E04" />
                    </TouchableOpacity>
                  ) : (
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
                      disabled={friendStatus !== "UNKNOWN"}
                    >
                      <Text
                        className="font-bold"
                        style={{
                          color: friendStatus === "UNKNOWN" ? "#fff" : "#0C9E04",
                        }}
                      >
                        {friendStatus === "PENDING" ? "Pending" : "Add"}
                      </Text>
                      <MaterialCommunityIcons
                        name={
                          friendStatus === "PENDING"
                            ? "account-clock"
                            : "account-plus"
                        }
                        size={22}
                        color={friendStatus === "UNKNOWN" ? "#fff" : "#0C9E04"}
                      />
                    </TouchableOpacity>
                  )}

                  {/* Message button */}
                  <TouchableOpacity style={[styles.button,{backgroundColor:friendStatus === "UNKNOWN" ? "#fff" : "#0C9E04",},]} onPress={handlePressMessage}>
                    <Text
                      className="font-bold"
                      style={{
                        color: friendStatus === "UNKNOWN" ? "#0C9E04" : "#fff",
                      }}
                    >
                      {t('profile_section.message')}
                    </Text>

                    <MaterialCommunityIcons
                      name={
                        friendStatus === "UNKNOWN"
                          ? "chat-outline"
                          : "chat"
                      }
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
    marginTop: vs(8),
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
