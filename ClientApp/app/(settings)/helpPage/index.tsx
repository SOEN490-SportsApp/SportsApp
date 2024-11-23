import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const helpPage: React.FC = () => {
  const handleContactSupport = () => {
    Linking.openURL('mailto:yousfino-8@hotmail.com');
  };

  const handlePrivacyPolicy = () => {
    // Open Privacy Policy link in a web browser
    Linking.openURL('https://developer.moneris.com/More/Compliance/Sample%20Privacy%20Policy');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Help & Support</Text>

      {/* Contact Support */}
      <TouchableOpacity style={styles.option} onPress={handleContactSupport}>
        <Ionicons name="mail-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.text}>Contact Support</Text>
      </TouchableOpacity>

      {/* Privacy Policy */}
      <TouchableOpacity style={styles.option} onPress={handlePrivacyPolicy}>
        <Ionicons name="document-text-outline" size={24} color="black" style={styles.icon} />
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  icon: {
    marginRight: 16,
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#6C6C6C',
    textAlign: 'center',
  },
  link: {
    color: '#0C9E04',
    textDecorationLine: 'underline',
  },
});

export default helpPage;
