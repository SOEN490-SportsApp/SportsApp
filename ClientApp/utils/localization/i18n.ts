import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en.json';
import fr from './fr.json';

const LANGUAGE_KEY = 'appLanguage';

const resources = {
  en: { translation: en },
  fr: { translation: fr }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false
    }
  });

export const setLanguage = async (language: string) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
  await i18n.changeLanguage(language);
};

export const getLanguage = async () => {
  const storedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (storedLang) {
    await i18n.changeLanguage(storedLang);
  }
};

export default i18n;
