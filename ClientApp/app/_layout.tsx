import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/state/store';
import { setupAxiosInstance } from '@/services/axiosInstance';
import { NotificationProvider } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications"
import 'react-native-get-random-values';
import '@/utils/localization/i18n';
import "../global.css";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
    // Inject Redux dispatch into Axios
    const { dispatch } = store;
    setupAxiosInstance(dispatch);

    return (
        <Provider store={store}>
            <NotificationProvider>
                <Stack initialRouteName="auth/login">
                    <Stack.Screen name="auth/login" options={{ headerShown: false, gestureEnabled: false }} />
                    <Stack.Screen name="auth/registerAccount" options={{ headerShown: false }} />
                    <Stack.Screen name="auth/registerProfile" options={{ headerShown: false }} />
                    <Stack.Screen name="auth/resetPassword" options={{ headerShown: true, headerBackVisible: true, headerBackTitle: 'Back', headerTitle: '' }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false, }} />
                    <Stack.Screen name="editProfile/index" options={{ headerShown: false }} />
                    <Stack.Screen name="editProfile/sportsSkills" options={{ headerShown: false}} />
                    <Stack.Screen name="events" options={{ headerShown: false }} />
                    <Stack.Screen name="userProfiles" options={{ headerShown: false }} />
                    <Stack.Screen name="posts" options={{ headerShown: false }} />
                </Stack>
            </NotificationProvider>
        </Provider>
    );
}
