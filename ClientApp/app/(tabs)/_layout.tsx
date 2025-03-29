import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { mvs } from '@/utils/helpers/uiScaler';
import themeColors from '@/utils/constants/colors';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const iconStyle = { marginBottom: -5 };
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.primary,
        tabBarStyle: {
          paddingHorizontal: 10,
          height: mvs(65),
        },
        tabBarLabelStyle: {
          marginTop: -5,
          fontSize: mvs(11),
          padding: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('tab_layout.home'),
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              size={24}
              name="home"
              color={color}
              style={iconStyle}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create/index"
        options={{
          title: t('tab_layout.add'),
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="plus-circle" color={color} style={iconStyle} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: t('tab_layout.chats'),
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="comments" color={color} style={iconStyle} />
          ),
        }}
        listeners={{
          // tabPress: (e) => {
          //   console.log('Chats tab pressed');
          // },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tab_layout.profile'),
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="user" color={color} style={iconStyle} />
          ),
        }}
      />
    </Tabs>
  );
}
