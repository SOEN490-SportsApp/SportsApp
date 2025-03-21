import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import themeColors from "@/utils/constants/colors";
import { mhs } from "@/utils/helpers/uiScaler";
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import 'moment/locale/fr';

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

  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'fr' ? 'fr' : 'en';
  moment.locale(locale);

  const currentMode = mode === "date" ? t('custom_date_time_picker.date') : t('custom_date_time_picker.time');

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
              ? moment(value).format('ddd D MMM YYYY')
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
    fontSize: mhs(13),
    color: themeColors.text.dark,
  },
  input: {
    backgroundColor: themeColors.background.lightGrey,
    padding: 10,
    borderRadius: 20,
  },
  inputText: {
    fontSize: mhs(13),
    color: themeColors.text.dark,
  },
});

export default CustomDateTimePicker;
