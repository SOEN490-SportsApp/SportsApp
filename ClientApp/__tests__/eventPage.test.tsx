import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import EventDetails from '@/app/events/[eventId]';
import { useSelector } from 'react-redux';
import { getAxiosInstance } from '@/services/axiosInstance';

const mockEvent = {
  eventName: 'Victory Sprint',
  eventType: 'Private',
  sportType: 'Football',
  locationResponse: {
    name: 'Central Park',
    streetNumber: '89',
    streetName: 'Central Park W',
    city: 'New York',
    province: 'NY',
    country: 'USA',
    postalCode: 'H7W 9L5',
    addressLine2: 'test',
    phoneNumber: '212-310-6600',
    latitude: '40.785091',
    longitude: '-73.968285',
  },
  date: '2025-01-11',
  duration: '2',
  maxParticipants: 22,
  participants: [
    {
      userId: "1256",
      attendStatus: null,
      joinedOn: "2025-01-11"
    },
  ],
  createdBy: '6771945a2e3e020133f217d3',
  teams: [],
  cutOffTime: '5',
  description: 'Join us for a thrilling sprint event in Central Park. A challenge for both beginners and intermediate runners.',
  isPrivate: true,
  whitelistedUsers: [],
  requiredSkillLevel: ['INTERMEDIATE'],
};

const mockUser = { id: '1', name: 'John Doe' };

jest.mock('@/services/axiosInstance', () => ({
  getAxiosInstance: () => ({
    get: jest.fn(() => Promise.resolve({ data: mockEvent })),
    post: jest.fn(() => Promise.resolve()),
  }),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ back: jest.fn() })),
  useLocalSearchParams: jest.fn(() => ({ eventId: '123' })),
}));

describe('EventDetails Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders event details correctly', async () => {
    (getAxiosInstance().get as jest.Mock).mockResolvedValueOnce({ data: mockEvent });
    (useSelector as unknown as jest.Mock).mockReturnValue(mockUser);

    render(<EventDetails />);
    await waitFor(() => {
      expect(screen.getByText(mockEvent.eventName)).toBeTruthy();
      expect(
        screen.getByText(
          `📍 ${mockEvent.locationResponse.streetNumber} ${mockEvent.locationResponse.streetName}, ${mockEvent.locationResponse.city}, ${mockEvent.locationResponse.province}`
        )
      ).toBeTruthy();
      expect(screen.getByText(mockEvent.description)).toBeTruthy();
    });
  });

  it('shows the \'Join Event\' button if user is not a participant', async () => {
    const nonParticipantEvent = { ...mockEvent, participants: [] };
    (getAxiosInstance().get as jest.Mock).mockResolvedValueOnce({ data: nonParticipantEvent });
    (useSelector as unknown as jest.Mock).mockReturnValue(mockUser);

    render(<EventDetails />);
    await waitFor(() => {
      expect(screen.getByText('Join Event')).toBeTruthy();
    });
  });

  it('does not show the \'Join Event\' button if user is a participant', async () => {
    (getAxiosInstance().get as jest.Mock).mockResolvedValueOnce({ data: mockEvent });
    (useSelector as unknown as jest.Mock).mockReturnValue(mockUser);

    render(<EventDetails />);
    await waitFor(() => {
      expect(screen.queryByText('Join Event')).toBeNull();
    });
  });

  it('renders participant avatar', async () => {
    render(<EventDetails />);
    await waitFor(() => {
      expect(screen.getByTestId('participant-avatar')).toBeTruthy(); 
    });
  });
});