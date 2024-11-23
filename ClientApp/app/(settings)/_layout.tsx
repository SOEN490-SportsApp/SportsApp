import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, title: "Settings" }}>
      <Stack.Screen name="settingsPage/index" />
      <Stack.Screen name="notificationsPage/index" />
      <Stack.Screen name="languagePage/index" />
      <Stack.Screen name="helpPage/index" />
    </Stack>
  );
}
