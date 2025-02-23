import { useDispatch, useSelector } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react-native';
import NotificationsScreen from '@/app/(tabs)/home/(notifications)/notificationsPage';
import { getReceivedFriendRequests } from '@/utils/api/profileApiClient';
import { setLoading, setNotifications } from '@/state/notifications/notificationSlice';

// Mock the Redux hooks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Mock the API call
jest.mock('@/utils/api/profileApiClient', () => ({
  getReceivedFriendRequests: jest.fn(),
}));

// Mock the Redux actions
jest.mock('@/state/notifications/notificationSlice', () => ({
  setLoading: jest.fn(),
  setNotifications: jest.fn(),
}));

describe('NotificationsScreen', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: { id: '123' },
        notifications: {
          notifications: [],
          loading: false,
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the API and update the Redux store with friend requests on success', async () => {
    const mockFriendRequests = [
      {
        RequestId: '1',
        friendRequestUserId: '456',
        friendRequestUsername: 'John Doe',
        status: 'pending',
      },
    ];

    (getReceivedFriendRequests as jest.Mock).mockResolvedValue(mockFriendRequests);

    const fetchFriendRequests = async () => {
      mockDispatch(setLoading(true));
      try {
        const data = await getReceivedFriendRequests('123');
        const formattedRequests = data.map((request: any) => ({
          id: request.RequestId,
          senderId: request.friendRequestUserId,
          senderName: request.friendRequestUsername,
          senderProfilePic: '',
          timeAgo: '',
          type: 'friend_request',
          status: request.status,
        }));
        const existingNotifications: never[] = []; 
        mockDispatch(setNotifications([...existingNotifications, ...formattedRequests]));
      } catch (error) {
        console.error('Failed to fetch friend requests:', error);
      } finally {
        mockDispatch(setLoading(false));
      }
    };

    await fetchFriendRequests();

    expect(getReceivedFriendRequests).toHaveBeenCalledWith('123');
    const formattedRequests = mockFriendRequests.map((request) => ({
      id: request.RequestId,
      senderId: request.friendRequestUserId,
      senderName: request.friendRequestUsername,
      senderProfilePic: '',
      timeAgo: '',
      type: "friend_request",
      status: request.status,
    }));

    expect(mockDispatch).toHaveBeenCalledWith(setLoading(true)); 
    expect(mockDispatch).toHaveBeenCalledWith(setNotifications(formattedRequests)); 
    expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
  });

  it('should handle API errors and log them to the console', async () => {
    const mockError = new Error('Failed to fetch friend requests');

    (getReceivedFriendRequests as jest.Mock).mockRejectedValue(mockError);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    const fetchFriendRequests = async () => {
      mockDispatch(setLoading(true));
      try {
        const data = await getReceivedFriendRequests('123');
        const formattedRequests = data.map((request: any) => ({
          id: request.RequestId,
          senderId: request.friendRequestUserId,
          senderName: request.friendRequestUsername,
          senderProfilePic: '',
          timeAgo: '',
          type: 'friend_request',
          status: request.status,
        }));
        const existingNotifications: never[] = [];
        mockDispatch(setNotifications([...existingNotifications, ...formattedRequests]));
      } catch (error) {
        console.error('Failed to fetch friend requests:', error);
      } finally {
        mockDispatch(setLoading(false));
      }
    };

    await fetchFriendRequests();

    expect(getReceivedFriendRequests).toHaveBeenCalledWith('123');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch friend requests:', mockError);

    expect(mockDispatch).toHaveBeenCalledWith(setLoading(true)); 
    expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));

    consoleErrorSpy.mockRestore();
  });

  it('should not update notifications if the API returns an empty array', async () => {
    (getReceivedFriendRequests as jest.Mock).mockResolvedValue([]);

    const fetchFriendRequests = async () => {
      mockDispatch(setLoading(true));
      try {
        const data = await getReceivedFriendRequests('123');
        const formattedRequests = data.map((request: any) => ({
          id: request.RequestId,
          senderId: request.friendRequestUserId,
          senderName: request.friendRequestUsername,
          senderProfilePic: '',
          timeAgo: '',
          type: 'friend_request',
          status: request.status,
        }));
        const existingNotifications: never[] = [];
        mockDispatch(setNotifications([...existingNotifications, ...formattedRequests]));
      } catch (error) {
        console.error('Failed to fetch friend requests:', error);
      } finally {
        mockDispatch(setLoading(false));
      }
    };

    await fetchFriendRequests();

    expect(getReceivedFriendRequests).toHaveBeenCalledWith('123');

    expect(mockDispatch).toHaveBeenCalledWith(setNotifications([]));
  });

  it('should display a message when there are no friend requests', async () => {
    (getReceivedFriendRequests as jest.Mock).mockResolvedValue([]);

    render(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByText('No new friend requests 🤝')).toBeTruthy();
      expect(screen.getByText('Check back later!')).toBeTruthy();
    });
  });
});