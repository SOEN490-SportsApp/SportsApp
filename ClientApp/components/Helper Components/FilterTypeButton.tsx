import themeColors from "@/utils/constants/colors";
import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

interface FilterTypeButton {
    text: string,
    onPress: () => void

}

const FilterTypeButton: React.FC<FilterTypeButton> = ({text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.modalFilterButton}>
      <Text style={styles.filterButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default FilterTypeButton;

const styles = StyleSheet.create({
    modalFilterButton: {
        backgroundColor: "white", // Important for shadows
        borderRadius: 20,
        paddingHorizontal: 28,
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
      },
      filterButtonText: {
        textAlign: "center",
        color: themeColors.background.dark,
      },
})