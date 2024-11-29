import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import themeColors from "@/utils/constants/colors";
import { hs, vs, mvs, mhs } from "@/utils/helpers/uiScaler";

const helpPage: React.FC = () => {
  const handleContactSupport = () => {
    Linking.openURL('mailto:yousfino-8@hotmail.com');
  };

  const handlePrivacyPolicy = () => {
    // Open Privacy Policy link in a web browser
    // Linking.openURL('https://developer.moneris.com/More/Compliance/Sample%20Privacy%20Policy');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Help & Support</Text>

      {/* Contact Support */}
      <TouchableOpacity style={styles.option} onPress={handleContactSupport}>
        <Ionicons name="mail-outline" size={mvs(24)} color={themeColors.text.dark} style={styles.icon} />
        <Text style={styles.text}>Contact Support</Text>
      </TouchableOpacity>

      {/* Privacy Policy */}
      <TouchableOpacity style={styles.option} onPress={handlePrivacyPolicy}>
        <Ionicons name="document-text-outline" size={mvs(24)} color={themeColors.text.dark} style={styles.icon} />
        <Text style={styles.text}>Privacy Policy</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          For further assistance, please contact us at{' '}
          <Text style={styles.link} onPress={handleContactSupport}>
            yousfino-8@hotmail.com
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(16),
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border.light,
    backgroundColor: themeColors.background.lightGrey,
    borderRadius: mhs(8),
    paddingHorizontal: hs(16),
    marginBottom: vs(12),
  },
  icon: {
    marginRight: hs(16),
  },
  text: {
    fontSize: mhs(16),
    color: themeColors.text.dark,
  },
  footer: {
    marginTop: vs(32),
    paddingHorizontal: hs(16),
  },
  footerText: {
    fontSize: mhs(14),
    color: themeColors.text.grey,
    textAlign: 'center',
  },
  link: {
    color: themeColors.primary,
    textDecorationLine: 'underline',
  },
});

export default helpPage;