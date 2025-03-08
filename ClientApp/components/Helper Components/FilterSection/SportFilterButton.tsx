import themeColors from "@/utils/constants/colors";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface Sport {
  name: string;
  ranking: string;
}

interface FavoriteSportsBadgesProps {
  sport: string;
  icon: string;
  isSelected: boolean;
  onPress: () => void
}

const SportFilterButton: React.FC<FavoriteSportsBadgesProps> = ({
  sport,
  icon,
  isSelected,
  onPress
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.badgeContainer}>
        <TouchableOpacity onPress={onPress} >
        <View style={[styles.badge, {backgroundColor: isSelected ? themeColors.primary: "#fff"}]}>
          <Text
            style={[
              styles.text,
              {
                color: isSelected ? "#fff" : themeColors.primary,
                backgroundColor: isSelected ? themeColors.primary : "#fff",
              },
            ]}
          >
            {sport}
          </Text>
          <MaterialCommunityIcons
            name={icon}
            size={16}
            color={isSelected ? "#fff" : themeColors.primary}
          />
        </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SportFilterButton;

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    alignItems: "center",
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    justifyContent: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: themeColors.primary,
    backgroundColor: "white",
    // minWidth: 100,
    gap: 4,
    margin: 2,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    color: themeColors.primary,
    fontSize: 14,
  },
  noSportsText: {
    fontSize: 16,
    color: "#808080",
  },
});
