import { Sport } from "@/types/sport";
import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import FavoriteSportsBadges from "../FavoriteSportsBadges";

interface UserInfoCardProps {
  username: string;
  gender: string;
  age: string;
  phoneNumber: string;
  sports: Sport[] | undefined;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  username,
  gender,
  age,
  phoneNumber,
  sports,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          ✍️ Username: {username || "Not Provided"}
        </Text>
        <Text style={styles.infoText}>
          👤 Gender: {gender || "Not Provided"}
        </Text>
        <Text style={styles.infoText}>📅 Age: {age}</Text>
        <Text style={styles.infoText}>
          📞 Phone: {phoneNumber || "Not Provided"}
        </Text>
      </View>
      {sports && (
        <View style={styles.childrenContainer}>
          <Text style={styles.infoText}>Favourite sports: </Text>
          <FavoriteSportsBadges sports={sports} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  infoContainer: {
    marginTop: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  childrenContainer: {
    marginTop: 10,
  },
});

export default UserInfoCard;
