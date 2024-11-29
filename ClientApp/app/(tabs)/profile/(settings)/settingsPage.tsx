import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/utils/context/AuthContext';
import { useRouter } from 'expo-router';

const settingsPage: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Notification Settings */}
      <TouchableOpacity style={styles.option} onPress={() => router.push('/(tabs)/profile/(settings)/notificationsPage')}>
        <Ionicons name="notifications-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.text}>Notification Settings</Text>
      </TouchableOpacity>

      {/* Language Option */}
      <TouchableOpacity style={styles.option} onPress={() => router.push('/(tabs)/profile/(settings)/languagePage')}>
        <Ionicons name="language-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.text}>Language</Text>
      </TouchableOpacity>

      {/* Help */}
      <TouchableOpacity style={styles.option} onPress={() => router.push('/profile/(settings)/helpPage')}>
        <Ionicons name="help-circle-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.text}>Help</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  icon: {
    marginRight: 16,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 20,
    alignItems: 'center', // Centering the button horizontally
  },
  logout: {
    width: '80%', // Adjust width for better alignment
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 5, // Adds shadow for a modern look (on Android)
    shadowColor: '#000', // Shadow properties for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default settingsPage;
