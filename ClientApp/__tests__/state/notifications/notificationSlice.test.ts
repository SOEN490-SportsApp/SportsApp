import notificationsReducer, { 
    setNotifications, 
    addNotification, 
    removeNotification, 
    setLoading 
  } from "@/state/notifications/notificationSlice";
  
  type FriendRequestNotification = {
    status: string;
    id: string;
    senderId: string;
    senderName: string;
    senderProfilePic?: string;
    timeAgo: string;
    type: "friend_request";
  };
  
  describe("notificationsSlice", () => {
    let initialState: { notifications: FriendRequestNotification[]; loading: boolean };
  
    beforeEach(() => {
      initialState = {
        notifications: [],
        loading: false,
      };
    });
  
    test("should return the initial state", () => {
      expect(notificationsReducer(undefined, { type: "unknown_action" })).toEqual(initialState);
    });
  
    test("should set notifications", () => {
      const notifications = [
        {
          id: "1",
          senderId: "123",
          senderName: "Alice",
          senderProfilePic: "pic.jpg",
          timeAgo: "5m ago",
          status: "pending",
          type: "friend_request" as "friend_request",
        },
      ];
      const newState = notificationsReducer(initialState, setNotifications(notifications));
      expect(newState.notifications).toEqual(notifications);
    });
  
    test("should add a new notification", () => {
      const newNotification: FriendRequestNotification = {
        id: "2",
        senderId: "456",
        senderName: "Bob",
        senderProfilePic: "pic2.jpg",
        timeAgo: "10m ago",
        status: "accepted",
        type: "friend_request",
      };
      const newState = notificationsReducer(initialState, addNotification(newNotification));
      expect(newState.notifications).toHaveLength(1);
      expect(newState.notifications[0]).toEqual(newNotification);
    });
  
    test("should remove a notification by ID", () => {
      const initialStateWithNotifications = {
        ...initialState,
        notifications: [
          { id: "1", senderId: "123", senderName: "Alice", senderProfilePic: "", timeAgo: "5m ago", status: "pending", type: "friend_request" as "friend_request" },
          { id: "2", senderId: "456", senderName: "Bob", senderProfilePic: "", timeAgo: "10m ago", status: "accepted", type: "friend_request" as "friend_request" },
        ],
      };
      const newState = notificationsReducer(initialStateWithNotifications, removeNotification("1"));
      expect(newState.notifications).toHaveLength(1);
      expect(newState.notifications[0].id).toBe("2");
    });
  
    test("should set loading state", () => {
      const newState = notificationsReducer(initialState, setLoading(true));
      expect(newState.loading).toBe(true);
  
      const newStateFalse = notificationsReducer(newState, setLoading(false));
      expect(newStateFalse.loading).toBe(false);
    });
  });
  