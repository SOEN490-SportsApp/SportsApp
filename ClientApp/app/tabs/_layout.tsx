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
          marginTop: -10,
          fontSize: 12,
          padding: 10,
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
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      
      {/* Plus Tab */}
      <Tabs.Screen
        name="plus"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
      
      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
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





