import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack initialRouteName="login">
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ headerShown: false }} />
      <Stack.Screen
        name="auth/profilePreferenceForm"
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          title: "Profile preference",
        }}
      />
    </Stack>
  );
}
