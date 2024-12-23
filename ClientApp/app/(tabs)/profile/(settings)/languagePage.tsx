import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import themeColors from "@/utils/constants/colors";
import { hs, vs, mvs, mhs } from "@/utils/helpers/uiScaler";

const languagePage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Language</Text>

      <View style={styles.optionsContainer}>
        {/* English Option */}
        <TouchableOpacity
          style={[
            styles.option,
            selectedLanguage === 'English' && styles.selectedOption,
          ]}
          onPress={() => handleLanguageSelect('English')}
        >
          <Ionicons
            name="checkmark-circle"
            size={mvs(24)}
            color={selectedLanguage === 'English' ? themeColors.primary : themeColors.border.light}
            style={styles.icon}
          />
          <Text style={styles.text}>English</Text>
        </TouchableOpacity>

        {/* French Option */}
        <TouchableOpacity
          style={[
            styles.option,
            selectedLanguage === 'French' && styles.selectedOption,
          ]}
          onPress={() => handleLanguageSelect('French')}
        >
          <Ionicons
            name="checkmark-circle"
            size={mvs(24)}
            color={selectedLanguage === 'French' ? themeColors.primary : themeColors.border.light}
            style={styles.icon}
          />
          <Text style={styles.text}>Français</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background.light,
    paddingHorizontal: hs(16),
    paddingTop: vs(16),
  },
  header: {
    fontSize: mhs(20),
    fontWeight: 'bold',
    color: themeColors.text.dark,
    marginBottom: vs(16),
  },
  optionsContainer: {
    marginTop: vs(16),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: hs(16),
    marginBottom: vs(12),
    borderRadius: mhs(8),
    borderWidth: 1,
    borderColor: themeColors.border.light,
    backgroundColor: themeColors.background.lightGrey,
  },
  selectedOption: {
    borderColor: themeColors.primary,
    backgroundColor: themeColors.success,
  },
  icon: {
    marginRight: hs(16),
  },
  text: {
    fontSize: mhs(16),
    color: themeColors.text.dark,
  },
});

export default languagePage;
