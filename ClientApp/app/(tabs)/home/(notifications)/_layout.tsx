import { Stack } from 'expo-router';

export default function NotificationsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTitleAlign: "center", headerTitle: "Notifications" }}>
      <Stack.Screen 
        name="friendRequestsPage" 
        options={{ title: "Notifications", headerShown: true, }} 
      />
      <Stack.Screen 
        name="whatIsNewPage" 
        options={{ title: "Notifications", headerShown: true, }} 
      />
    </Stack>
  );
}
