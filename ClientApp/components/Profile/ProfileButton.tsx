import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, Text } from "react-native";


interface ProfileButtonProps{
  onPress: () => void;
  status: string,
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}
const ProfileButton: React.FC<ProfileButtonProps> = ({ status, onPress, icon }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: status === "ACCEPTED" ? "#fff": status === "PENDING" ? "#fff" : "#0C9E04",
        padding: 5,
        borderRadius: 5,
        width: "48%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        borderColor: "#0C9E04",
        borderWidth: 1,
      }}
    >
      <Text className=" font-bold" style={{ color: status === "ACCEPTED" ? "#fff" : "#0C9E04" }}>
        Message
      </Text>
      <MaterialCommunityIcons name={icon} size={22} color="#0C9E04" />
    </TouchableOpacity>
  );
};

export default ProfileButton;
