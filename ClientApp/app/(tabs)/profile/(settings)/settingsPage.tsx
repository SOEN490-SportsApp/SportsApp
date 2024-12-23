import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import themeColors from "@/utils/constants/colors";
import { hs, vs, mvs, mhs } from "@/utils/helpers/uiScaler";

const settingsPage: React.FC = () => {
  const handleLogout = () => {
    router.replace('/auth/login');
  };

  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Notification Settings */}
        <TouchableOpacity style={styles.option} onPress={() => router.push('/(tabs)/profile/(settings)/notificationsPage')}>
          <Ionicons name="notifications-outline" size={mvs(24)} color="black" style={styles.icon} />
          <Text style={styles.text}>Notification Settings</Text>
        </TouchableOpacity>

        {/* Language Option */}
        <TouchableOpacity style={styles.option} onPress={() => router.push('/(tabs)/profile/(settings)/languagePage')}>
          <Ionicons name="language-outline" size={mvs(24)} color="black" style={styles.icon} />
          <Text style={styles.text}>Language</Text>
        </TouchableOpacity>

        {/* Help */}
        <TouchableOpacity style={styles.option} onPress={() => router.push('/profile/(settings)/helpPage')}>
          <Ionicons name="help-circle-outline" size={mvs(24)} color="black" style={styles.icon} />
          <Text style={styles.text}>Help</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Fixed Logout Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background.light,
  },
  content: {
    paddingHorizontal: hs(16),
    paddingBottom: vs(80), // Space for the fixed footer
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(16),
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border.light,
  },
  icon: {
    marginRight: hs(16),
  },
  text: {
    fontSize: mhs(16),
    color: themeColors.text.dark,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: themeColors.background.light,
    paddingVertical: vs(20),
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: themeColors.border.light,
  },
  logout: {
    width: '80%',
    backgroundColor: themeColors.primary,
    paddingVertical: vs(12),
    borderRadius: mhs(25),
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logoutText: {
    color: themeColors.text.light,
    fontSize: mhs(16),
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default settingsPage;
