import React from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Icon } from "react-native-elements";
import { mhs } from "@/utils/helpers/uiScaler";
import themeColors from "@/utils/constants/colors";

interface TopBarInterface {
  onPress: () => void;
  isCalendarVisible: boolean
}
const TopBar: React.FC<TopBarInterface> = ({ onPress, isCalendarVisible }) => {
  const logo = require("@/assets/images/sporta_logo.png");
  const router = useRouter();
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Sporta </Text>
        <Image source={logo} style={styles.logo} />
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          testID="search-icon"
          onPress={() => router.push("/(tabs)/home/searchPage")}
        >
          <View style={styles.iconCircle}>
            <Icon name="search" type="font-awesome" color="#000" size={18} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} testID="search-icon" onPress={() => router.push('/(tabs)/home/(notifications)/notificationsPage')}>
          <View style={styles.iconCircle}>
            <Icon name="bell" type="font-awesome" color="#000" size={18} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} testID="calendar-icon" onPress={onPress}>
          <View style={[styles.iconCircle, {backgroundColor: isCalendarVisible ? themeColors.primary:"#d3d3d3"}]}>
            <Icon name="calendar" type="font-awesome" color={isCalendarVisible ? "#fff" : "#000"} size={18} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  header1: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logoText: {
    color: "#0C9E04",
    fontSize: 28,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#d3d3d3",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: mhs(48),
    height: mhs(48),
    marginTop:2,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center", // Ensures the text and image are vertically aligned
    gap: 2, // Adjust spacing between text and logo if needed
  },
});
