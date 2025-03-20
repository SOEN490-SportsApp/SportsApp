import React from 'react';
import { FlatList } from 'react-native';
import EventCardSkeleton from './EventCardSkeleton';

const EventListSkeleton: React.FC = () => {
    return (
        <FlatList
        data={[1, 2, 3]}
        keyExtractor={(item) => item.toString()}
        renderItem={() => <EventCardSkeleton />}
      />
    );
};


export default EventListSkeleton;