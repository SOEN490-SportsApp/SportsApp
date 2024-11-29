import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, title: "Settings" }}>
      <Stack.Screen name="(settings)/settingsPage" />
      <Stack.Screen name="(settings)/notificationsPage" />
      <Stack.Screen name="(settings)/languagePage" />
      <Stack.Screen name="(settings)/helpPage" />
    </Stack>
  );
}
