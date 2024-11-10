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
          marginTop: -5,  
          fontSize: 12,
          padding: 5,     
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
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} style={{ marginBottom: -5 }} />,
        }}
      />
      
      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} style={{ marginBottom: -5 }} />,
        }}
      />
      
      {/* Plus Tab  */}
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="plus-circle" color={color} style={{ marginBottom: -5 }} />
          ), 
        }}
      />
      
      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="cog" color={color} style={{ marginBottom: -5 }} />,
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







