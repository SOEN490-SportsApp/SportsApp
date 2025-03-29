import { Sport } from "@/types/sport";
import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import FavoriteSportsBadges from "../FavoriteSportsBadges";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          ✍️ {t('user_info_card.username')} {username || t('user_info_card.not_provided')}
        </Text>
        <Text style={styles.infoText}>
          👤 {t('user_info_card.gender')} {gender || t('user_info_card.not_provided')}
        </Text>
        <Text style={styles.infoText}>📅 Age: {age}</Text>
        <Text style={styles.infoText}>
          📞 {t('user_info_card.phone')} {phoneNumber || t('user_info_card.not_provided')}
        </Text>
      </View>
      {sports && (
        <View style={styles.childrenContainer}>
          <Text style={styles.infoText}>{t('user_info_card.favourite_sports')} </Text>
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
