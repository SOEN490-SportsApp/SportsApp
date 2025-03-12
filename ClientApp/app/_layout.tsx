import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/state/store';
import "../global.css";
import { setupAxiosInstance } from '@/services/axiosInstance';
import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import * as Notifications from "expo-notifications";
import registerForPushNotificationsAsync from '@/utils/notifications/registerForPushNotifications';

export default function RootLayout() {
    
    const { dispatch } = store;
    setupAxiosInstance(dispatch);

    useEffect(() => {
        async function setupPushNotifications() {
            try {
                const token = await registerForPushNotificationsAsync();
                console.log("Push Notification Token:", token);
            } catch (error) {
                console.error("Error setting up push notifications:", error);
            }
        }

        setupPushNotifications();

        // Handle incoming notifications
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            console.log("Received Notification:", notification);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
        };
    }, []);

    return (
        <Provider store={store}>
            <Stack initialRouteName="auth/login">
                <Stack.Screen name="auth/login" options={{ headerShown: false }} />
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
        </Provider>
    );
}
