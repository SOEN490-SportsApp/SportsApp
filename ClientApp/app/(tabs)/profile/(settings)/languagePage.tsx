import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import themeColors from "@/utils/constants/colors";
import { hs, vs, mvs, mhs } from "@/utils/helpers/uiScaler";
import { useTranslation } from 'react-i18next';
import { setLanguage, getLanguage } from "@/utils/localization/i18n";

const languagePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);

  useEffect(() => {
    getLanguage();
  }, []);

  const handleLanguageSelect = async (language: string) => {
    await setLanguage(language);
    setSelectedLanguage(language);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings.language')}</Text>

      <TouchableOpacity
        style={[styles.option, selectedLanguage === 'en' && styles.selectedOption]}
        onPress={() => handleLanguageSelect('en')}
      >
        <Ionicons
          name="checkmark-circle"
          size={mvs(24)}
          color={selectedLanguage === 'en' ? themeColors.primary : themeColors.border.light}
          style={styles.icon}
        />
        <Text style={styles.text}>{t('settings.english')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, selectedLanguage === 'fr' && styles.selectedOption]}
        onPress={() => handleLanguageSelect('fr')}
      >
        <Ionicons
          name="checkmark-circle"
          size={mvs(24)}
          color={selectedLanguage === 'fr' ? themeColors.primary : themeColors.border.light}
          style={styles.icon}
        />
        <Text style={styles.text}>{t('settings.french')}</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: mhs(20),
    fontWeight: 'bold',
    marginBottom: vs(16),
  },
});

export default languagePage;
