import themeColors from "@/utils/constants/colors";
import supportedSports from "@/utils/constants/supportedSports";
import React from "react";
import { View, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface EventHeaderProps {
  sportType: string;
}

const EventHeader: React.FC<EventHeaderProps> = ({ sportType }) => {
  const getSportIcon = (type: string) => {
    const sport = supportedSports.find(
      (sport) => sport.name.toLowerCase() === type.toLowerCase()
    );
    return sport?.icon || "help-circle"; 
  };

  return (
    <View style={styles.header}>
      {/* Background Design */}
      <View style={styles.curvedBackground}></View>

      {/* Circle with Sport Icon */}
      <View style={styles.circle}>
        <MaterialCommunityIcons
          name={getSportIcon(sportType)}
          size={60}
          color={themeColors.primary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: themeColors.background.light,
    paddingBottom: 0,
  },
  curvedBackground: {
    backgroundColor: themeColors.background.dark,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    backgroundColor: "#fff",
    width: 100,
    height: 100,
    borderRadius: 50,
    position: "absolute",
    bottom: 5,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default EventHeader;
