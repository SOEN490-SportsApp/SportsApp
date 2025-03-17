import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import themeColors from "@/utils/constants/colors";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const currentMode = mode === "date" ? t('custom_date_time_picker.date') : t('custom_date_time_picker.time');

  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);

  const handleConfirm = (selectedDate: Date) => {
    hidePicker();
    onChange(selectedDate);
  };

  return (
    <View>
      <TouchableOpacity onPress={showPicker} style={styles.input}>
        <Text style={styles.inputText}>
          {value
            ? currentMode === t('custom_date_time_picker.date')
              ? value.toDateString()
              : value.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
            : `${t('custom_date_time_picker.select')} ${currentMode}`}
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
    fontSize: 16,
    fontWeight: "600",
    color: themeColors.text.dark,
    marginBottom: 5,
  },
  input: {
    backgroundColor: themeColors.background.lightGrey,
    padding: 12,
    borderRadius: 8,
  },
  inputText: {
    fontSize: 15,
    color: themeColors.text.dark,
  },
});

export default CustomDateTimePicker;
