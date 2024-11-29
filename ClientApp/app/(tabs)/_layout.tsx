import React from 'react';
import { router, Tabs } from 'expo-router';
import { logoutUser } from '@/services/authService';
import FontAwesome from '@expo/vector-icons/FontAwesome';

async function handleLogout() {
  try {
    await logoutUser();
    router.replace('/auth/login');
  } catch (error) {
    console.error("Logout error:", error);
  }
}

export default function TabLayout() {
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
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
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
            handleLogout();
            // -------
          },
        }}
      />
    </Tabs>
  );
}







