import React, { useCallback } from 'react';
import { FlatList, View, StyleSheet, Text, Animated, RefreshControl, ActivityIndicator } from 'react-native';
import EventCard from './EventCard';
import { Event } from '@/types/event';
import { router, useFocusEffect } from 'expo-router';
import { useSelector } from 'react-redux';
import usePagination from '@/app/hooks/usePagination';
import { useTranslation } from 'react-i18next';

interface userEventsListProps {
  forProfile: boolean, 
  fetchEventsFunction: (page: number, size: number) => Promise<{ data: { content: Event[] ; totalElements: number; totalPages: number; pageable: { pageNumber: number; pageSize: number } } }>;
}

const EventsList: React.FC<userEventsListProps> = ({ forProfile, fetchEventsFunction }) => {
  const user = useSelector((state: { user: any }) => state.user);
  const { t } = useTranslation();

  const {
    data: events,
    refreshing,
    loadingMore,
    handleRefresh,
    loadMore,
    initialLoader,
    totalPages,
    pageNo,
  } = usePagination<Event>((page: any, size: any) => fetchEventsFunction(page, size), user.id);
  
  const handleEventPress = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };
  
  // Auto-refresh when user visits the screen
  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [])
  );
  
  if (initialLoader) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{t('event_list.loading_events')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {events.length === 0 ? (
        <View style = {styles.noActivityContainer}>
          <Text style={styles.noActivityText}>{t('event_list.wow_couldnt_find')}</Text>
          <Text style={styles.noActivityText}>{t('event_list.be_the_first_to_create')}</Text>
        </View>
      ) : (
        <FlatList
          data={events || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={handleEventPress} isForProfile={forProfile} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          onEndReached={() => {
            if (!loadingMore && pageNo + 1 < totalPages) {
              loadMore();
            }
          }}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() =>
            pageNo + 1 < totalPages ? (
              <View style={styles.endMessageContainer}>
                <Text style={styles.endMessageText}>{t('event_list.loading_more')}</Text>
              </View>
            ) : (
              <View style={styles.endMessageContainer}>
                <Text style={styles.endMessageText}>{t('event_list.all_done')}</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
};

export default EventsList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 0,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noActivityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
  loadingMoreContainer: {
    paddingVertical: 15,
    alignItems: "center",
  },
  noActivityContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  loadingMoreText: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  endMessageContainer: {
    paddingVertical: 6,
    alignItems: "center",
  },
  endMessageText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "gray",
  },
});
