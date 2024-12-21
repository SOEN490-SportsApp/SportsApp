import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/state/store';
import "../global.css";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack initialRouteName="login">
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/registerAccount" options={{ headerShown: false }} />
        <Stack.Screen name="auth/registerProfile" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>   
      </Provider> 
  );
}
