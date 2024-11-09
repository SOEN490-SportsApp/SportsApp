import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0C9E04',
        tabBarStyle: {
          paddingHorizontal: 10,
          height: 100,
        },
        tabBarLabelStyle: {
          marginTop: -5,  // Adjust the margin to reduce the spacing between the text and icon
          fontSize: 12,
          padding: 5,     // Reduce padding to make text closer to icon
          textAlign: 'center',
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} style={{ marginBottom: -5 }} />,  // Reduce space between icon and text
        }}
      />
      
      {/* Plus Tab */}
      <Tabs.Screen
        name="plus"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="plus" color={color} style={{ marginBottom: -5 }} />, // Adjust icon margin
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} style={{ marginBottom: -5 }} />, // Adjust icon margin
        }}
      />
      
      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="cog" color={color} style={{ marginBottom: -5 }} />, // Adjust icon margin
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Prevent default tab switch
            router.push('/auth/login'); // Navigate to login page
          },
        }}
      />
    </Tabs>
  );
}






