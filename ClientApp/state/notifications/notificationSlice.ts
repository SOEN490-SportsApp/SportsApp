import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type FriendRequestNotification = {
  status: string;
  id: string;
  senderId: string;
  senderName: string;
  senderProfilePic?: string;
  timeAgo: string;
  type: "friend_request";
};

type PushNotification = {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: "push_notification";
};

type Notification = FriendRequestNotification | PushNotification;
type NotificationsState = {
  notifications: Notification[];
  loading: boolean;
};

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = [...state.notifications, ...action.payload]; 
    },
    
    addFriendRequestNotification: (state, action: PayloadAction<FriendRequestNotification>) => {
      state.notifications.push(action.payload);
    },
    addPushNotification: (state, action: PayloadAction<PushNotification>) => {
      state.notifications.unshift(action.payload); 
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setNotifications,
  addFriendRequestNotification,
  addPushNotification,
  removeNotification,
  setLoading,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
