import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import themeColors from "@/utils/constants/colors";
import { hs, vs, mvs, mhs } from "@/utils/helpers/uiScaler";
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/services/authService';

const settingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    logoutUser(dispatch);
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
        <TouchableOpacity style={styles.option} onPress={() => router.push('/(tabs)/profile/(settings)/helpPage')}>
          <Ionicons name="help-circle-outline" size={mvs(24)} color="black" style={styles.icon} />
          <Text style={styles.text}>Help</Text>
        </TouchableOpacity>
         {/* Delete Account */}
        <TouchableOpacity style={[styles.option, styles.deleteOption]} onPress={() => router.push('/(tabs)/profile/(settings)/deleteAccountPage')}>
          <Ionicons name="trash-outline" size={mvs(24)} color="red" style={styles.icon} />
          <Text style={[styles.text, styles.deleteText]}>Delete Account</Text>
        </TouchableOpacity>
        {/* Log out */}
        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={mvs(24)} color="black" style={styles.icon} />
          <Text style={styles.text}>Log out</Text>
        </TouchableOpacity>
          
      </ScrollView>
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
  deleteOption: {
 
  },
  deleteText: {
    color: 'red', 
  },
});

export default settingsPage;
