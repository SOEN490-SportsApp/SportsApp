import React from 'react';
import { render } from '@testing-library/react-native';
import Feed from '../../components/Home Page/HomePageFeed';
import EventsList from '../../components/Event/EventsListHomePage';

jest.mock('../../components/Event/EventsListHomePage', () => jest.fn());

describe('Feed Component', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Feed />);
    expect(getByTestId('feed-container')).toBeTruthy();
  });

  it('applies the correct container styles', () => {
    const { getByTestId } = render(<Feed />);
    const container = getByTestId('feed-container');

    expect(container.props.style).toEqual(
      expect.objectContaining({
        flex: 1,
        backgroundColor: '#ffffff',
      })
    );
  });
});
