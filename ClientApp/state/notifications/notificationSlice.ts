import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FriendRequestNotification = {
  status: string;
  id: string;
  senderId: string;
  senderName: string;
  senderProfilePic?: string;
  timeAgo: string;
  type: "friend_request"; // Only one type of notification for now
};

type NotificationsState = {
  notifications: FriendRequestNotification[];
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
    setNotifications: (state, action: PayloadAction<FriendRequestNotification[]>) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action: PayloadAction<FriendRequestNotification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setNotifications, addNotification, removeNotification, setLoading } = notificationsSlice.actions;
export default notificationsSlice.reducer;