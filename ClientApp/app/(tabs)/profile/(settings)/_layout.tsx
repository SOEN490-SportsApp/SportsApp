import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="settingsPage" 
        options={{ title: "Settings", headerShown: true, }} 
      />
      <Stack.Screen 
        name="notificationsPage" 
        options={{ title: "Notifications", headerShown: true, }} 
      />
      <Stack.Screen 
        name="languagePage" 
        options={{ title: "Language", headerShown: true, }} 
      />
      <Stack.Screen 
        name="helpPage" 
        options={{ title: "Help & Support", headerShown: true, }} 
      />
        <Stack.Screen 
        name="deleteAccountPage" 
        options={{ title: "Delete Account", headerShown: true, }} 
      />
    </Stack>
  );
}
