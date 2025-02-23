import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import FriendRequestNotification from '@/components/Helper Components/FriendRequestNotification';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { respondToFriendRequest } from '@/utils/api/profileApiClient';
import { removeNotification } from '@/state/notifications/notificationSlice';

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock the Redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

// Mock the API call
jest.mock('@/utils/api/profileApiClient', () => ({
  respondToFriendRequest: jest.fn(),
}));

// Mock the Redux action
jest.mock('@/state/notifications/notificationSlice', () => ({
  removeNotification: jest.fn(),
}));

describe('FriendRequestNotification', () => {
  const mockDispatch = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for a received friend request', () => {
    const props = {
      userId: '123',
      requestId: '1',
      senderId: '456',
      senderName: 'John Doe',
      senderProfilePic: '',
      timeAgo: '2 hours ago',
      status: 'RECEIVED',
    };

    render(<FriendRequestNotification {...props} />);

    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('2 hours ago')).toBeTruthy();

    expect(screen.getByTestId('accept-button')).toBeTruthy();
    expect(screen.getByTestId('decline-button')).toBeTruthy();
  });

  it('renders correctly for an accepted friend request', () => {
    const props = {
      userId: '123',
      requestId: '1',
      senderId: '456',
      senderName: 'John Doe',
      senderProfilePic: '',
      timeAgo: '2 hours ago',
      status: 'ACCEPTED',
    };

    render(<FriendRequestNotification {...props} />);

    expect(screen.getByText('Accepted')).toBeTruthy();
  });

  it('renders correctly for a declined friend request', () => {
    const props = {
      userId: '123',
      requestId: '1',
      senderId: '456',
      senderName: 'John Doe',
      senderProfilePic: '',
      timeAgo: '2 hours ago',
      status: 'DECLINED',
    };

    render(<FriendRequestNotification {...props} />);

    expect(screen.getByText('Declined')).toBeTruthy();
  });

  it('calls handleAccept when the accept button is pressed', async () => {
    const props = {
      userId: '123',
      requestId: '1',
      senderId: '456',
      senderName: 'John Doe',
      senderProfilePic: '',
      timeAgo: '2 hours ago',
      status: 'RECEIVED',
    };

    (respondToFriendRequest as jest.Mock).mockResolvedValue({});

    render(<FriendRequestNotification {...props} />);

    fireEvent.press(screen.getByTestId('accept-button'));

    await waitFor(() => {
      expect(respondToFriendRequest).toHaveBeenCalledWith('123', '456', '1', 'ACCEPT');
    });

    expect(mockDispatch).toHaveBeenCalledWith(removeNotification('1'));
  });

  it('calls handleDecline when the decline button is pressed', async () => {
    const props = {
      userId: '123',
      requestId: '1',
      senderId: '456',
      senderName: 'John Doe',
      senderProfilePic: '',
      timeAgo: '2 hours ago',
      status: 'RECEIVED',
    };

    (respondToFriendRequest as jest.Mock).mockResolvedValue({});

    render(<FriendRequestNotification {...props} />);

    fireEvent.press(screen.getByTestId('decline-button'));

    await waitFor(() => {
      expect(respondToFriendRequest).toHaveBeenCalledWith('123', '456', '1', 'DECLINE');
    });

    expect(mockDispatch).toHaveBeenCalledWith(removeNotification('1'));
  });

  it('navigates to the user profile when pressed', () => {
    const props = {
      userId: '123',
      requestId: '1',
      senderId: '456',
      senderName: 'John Doe',
      senderProfilePic: '',
      timeAgo: '2 hours ago',
      status: 'RECEIVED',
    };

    render(<FriendRequestNotification {...props} />);

    fireEvent.press(screen.getByText('John Doe'));

    expect(mockRouterPush).toHaveBeenCalledWith('/(tabs)/home/userProfiles/456');
  });
});