import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import themeColors from "@/utils/constants/colors";
import { mhs } from "@/utils/helpers/uiScaler";

interface CustomDateTimePickerProps {
  value: Date | null;
  mode: "date" | "time";
  onChange: (date: Date) => void;
  label: string;
}

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  value,
  mode,
  onChange,
  label,
}) => {
  const [isPickerVisible, setPickerVisible] = useState(false);

  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);

  const handleConfirm = (selectedDate: Date) => {
    hidePicker();
    onChange(selectedDate);
  };

  return (
    <View>
      {/* <Text style={styles.label}>{label}</Text> */}
      <TouchableOpacity onPress={showPicker} style={styles.input}>
        <Text style={styles.inputText}>
          {value
            ? mode === "date"
              ? value.toDateString()
              : value.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
            : `Select ${mode}`}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode={mode}
        date={value || new Date()}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        display="spinner"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: mhs(12),
    color: themeColors.text.dark,
  },
  input: {
    backgroundColor: themeColors.background.lightGrey,
    padding: 10,
    borderRadius: 20,
  },
  inputText: {
    fontSize: mhs(12),
    color: themeColors.text.dark,
  },
});

export default CustomDateTimePicker;
