import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/utils/context/AuthContext';

export default function TabLayout() {
  const router = useRouter();
  const { logout } = useAuth();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0C9E04',
        tabBarStyle: {
          paddingHorizontal: 10,
          height: 100,
        },
        tabBarLabelStyle: {
          marginTop: -5,
          fontSize: 12,
          padding: 5,
          textAlign: 'center',
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} style={{ marginBottom: -5 }} />,
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} style={{ marginBottom: -5 }} />,
        }}
      />

      {/* Add Tab  */}
      <Tabs.Screen
        name="create/index"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="plus-circle" color={color} style={{ marginBottom: -5 }} />
          ),
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings/index"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="cog" color={color} style={{ marginBottom: -5 }} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); 
            // FIXME this should be the logout button later 
            logout();
            // -------
          },
        }}
      />
    </Tabs>
  );
}







