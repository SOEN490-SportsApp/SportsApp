import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/state/store';
import "../global.css";
import { setupAxiosInstance } from '@/services/axiosInstance';

export default function RootLayout() {
    // Inject Redux dispatch into Axios
    const { dispatch } = store;
    setupAxiosInstance(dispatch);

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
      </Stack>
        </Provider>
    );
}
