import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EventCard, { stringToDate } from '../../components/Event/EventCard';
import { Event } from '@/types/event';

describe('EventCard Component', () => {
  const mockEvent: Event = {
    id: '67806f20ba257b1899v46ff25',
    eventName: 'Lovely Sprint',
    eventType: 'Private',
    sportType: 'Basketball',
    locationResponse: {
      name: 'Central Park',
      streetNumber: '59',
      streetName: 'Central Park W',
      city: 'New York',
      province: 'NY',
      country: 'USA',
      postalCode: '10023',
      phoneNumber: '212-310-6600',
      latitude: '40.785091',
      longitude: '-73.968285',
    },
    date: '2026-06-15',
    maxParticipants: 50,
    participants: [],
    createdBy: 'user123',
    teams: [],
    cutOffTime: '2026-06-14T22:00:00',
    description: 'Join us for a thrilling sprint event in Central Park. A challenge for both beginners and intermediate runners.',
    isPrivate: false,
    whitelistedUsers: [],
    requiredSkillLevel: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
  };

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render all event details correctly on the home page', () => {
      const { getByText } = render(<EventCard event={mockEvent} onPress={() => {}} isForProfile={false} />);
      
      expect(getByText('Lovely Sprint')).toBeTruthy();
      expect(getByText('Basketball - X km away')).toBeTruthy();
      expect(getByText('📅 Mon Jun 15 2026')).toBeTruthy();
      expect(getByText('📍 New York, NY')).toBeTruthy();
      expect(getByText('BEGINNER')).toBeTruthy();
      expect(getByText('INTERMEDIATE')).toBeTruthy();
      expect(getByText('ADVANCED')).toBeTruthy();
    });

    it('should render correctly on the profile page with specific fields', () => {
      const { getByText, queryByText } = render(<EventCard event={mockEvent} onPress={() => {}} isForProfile={true} />);
      
      expect(getByText('Lovely Sprint')).toBeTruthy();
      expect(getByText('Basketball - X km away')).toBeTruthy();
      expect(getByText('📅 Mon Jun 15 2026')).toBeTruthy();
      expect(queryByText('📍 New York, NY')).toBeNull(); // Location should not be shown in profile mode
    });

    // it('should not render the event if the cutoff time has passed', () => {
    //   jest.useFakeTimers().setSystemTime(new Date('2026-06-15T03:24:00'));

    //   const { queryByText } = render(<EventCard event={mockEvent} onPress={() => {}} isForProfile={false} />);

    //   expect(queryByText('Lovely Sprint')).toBeNull();
    // });
  });

  describe('Time Left Calculation', () => {
    it('should calculate time left correctly in weeks', () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-05'));

      const { getByText } = render(<EventCard event={mockEvent} onPress={() => {}} isForProfile={false} />);
      expect(getByText('1 week left to join')).toBeTruthy();
    });

    it('should calculate time left correctly in days', () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-13T21:24:00'));

      const { getByText } = render(<EventCard event={mockEvent} onPress={() => {}} isForProfile={false} />);
      expect(getByText('1 day left to join')).toBeTruthy();
    });

    it('should calculate time left correctly in hours', () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-14T20:20:00'));

      const { getByText } = render(<EventCard event={mockEvent} onPress={() => {}} isForProfile={false} />);
      expect(getByText('1 hour left to join')).toBeTruthy();
    });

    it('should calculate time left correctly in minutes', () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-14T21:20:00'));

      const { getByText } = render(<EventCard event={mockEvent} onPress={() => {}} isForProfile={false} />);
      expect(getByText('40 minutes left to join')).toBeTruthy();
    });

    // it('should not show time left if event has started', () => {
    //   jest.useFakeTimers().setSystemTime(new Date('2026-06-14T23:00:00'));

    //   const { queryByText } = render(<EventCard event={mockEvent} onPress={() => {}} />);
    //   expect(queryByText(/left to join/)).toBeNull();
    // });
  });

  describe('User Interaction', () => {
    it('should call onPress with event ID when clicked', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(<EventCard event={mockEvent} onPress={onPressMock} />);

      fireEvent.press(getByTestId('event-card'));
      expect(onPressMock).toHaveBeenCalledWith(mockEvent.id);
    });
  });

  describe('Styling', () => {
    // it('should apply correct styles when event has started', () => {
    //   jest.useFakeTimers().setSystemTime(new Date('2026-06-16'));

    //   const { getByTestId } = render(<EventCard event={mockEvent} onPress={() => {}} isForProfile={true} />);
    //   expect(getByTestId('event-card')).toHaveStyle({ backgroundColor: '#B9B9B9' });
    // });

    it('should apply active styles for upcoming events', () => {
      const { getByTestId } = render(<EventCard event={mockEvent} onPress={() => {}} />);
      expect(getByTestId('event-card')).toHaveStyle({ backgroundColor: '#ffffff' });
    });
  });

  describe('Utility Function: stringToDate', () => {
    it('should correctly convert a valid date string to a Date object', () => {
      expect(stringToDate('2026-06-05')).toEqual(new Date(2026, 5, 5));
    });

    it('should handle single-digit months and days correctly', () => {
      expect(stringToDate('2026-01-02')).toEqual(new Date(2026, 0, 2));
    });

    it('should return an invalid date for incorrect input', () => {
      expect(stringToDate('invalid-date').toString()).toBe('Invalid Date');
    });

    it('should correctly handle leap years', () => {
      expect(stringToDate('2024-02-29')).toEqual(new Date(2024, 1, 29));
    });
  });
});
