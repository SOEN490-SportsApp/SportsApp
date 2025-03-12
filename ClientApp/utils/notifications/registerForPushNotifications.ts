import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
        });
    }
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
            alert("Failed to get push token for push notification!");
            return;
        }
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
    return token;
}

export default registerForPushNotificationsAsync;
