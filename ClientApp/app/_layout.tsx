import { Stack } from 'expo-router';
import { AuthProvider } from '../utils/context/AuthContext';
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack initialRouteName="login">
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/registerAccount" options={{ headerShown: false }} />
        <Stack.Screen name="auth/registerProfile" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
    
  );
}
