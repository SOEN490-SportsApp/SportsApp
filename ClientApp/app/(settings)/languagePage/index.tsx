import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
            size={24}
            color={selectedLanguage === 'English' ? '#0C9E04' : '#E0E0E0'}
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
            size={24}
            color={selectedLanguage === 'French' ? '#0C9E04' : '#E0E0E0'}
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
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  optionsContainer: {
    marginTop: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
  },
  selectedOption: {
    borderColor: '#0C9E04',
    backgroundColor: '#E8F5E9',
  },
  icon: {
    marginRight: 16,
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
});

export default languagePage;
