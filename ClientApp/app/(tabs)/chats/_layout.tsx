import { Stack } from 'expo-router';

export default function ChatsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ 
        headerShown: true, 
        headerBackTitle: 'Back', 
        presentation: 'card',
        }} />
    </Stack>
  );
}
