import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/state/user/userSlice';
import notificationsReducer from "@/state/notifications/notificationSlice";


export const store = configureStore({
  reducer: {
    user: userReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;