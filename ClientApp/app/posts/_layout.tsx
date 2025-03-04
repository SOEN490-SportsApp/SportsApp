import { store } from "@/state/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

export default function PostPageLayout() {
    return (
        <Provider store={store}>
            <Stack
                screenOptions={{
                    headerShown: true,
                    headerTitle: "",
                }}
            />
        </Provider>
    );
}