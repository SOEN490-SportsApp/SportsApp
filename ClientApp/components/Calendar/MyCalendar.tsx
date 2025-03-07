import { getAllEvents, getAllRelevantEvents, getEventsJoined } from "@/services/eventService";
import themeColors from "@/utils/constants/colors";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
  FlatList,
} from "react-native";

import { Calendar } from "react-native-calendars";
import { Event } from "@/types/event";
import { useFocusEffect, useRouter } from "expo-router";
import CalendarEventCard from "./CalendarEventCard";
import { mhs, mvs, vs } from "@/utils/helpers/uiScaler";
import { useSelector } from "react-redux";

interface EventList {
  userId: string;
  isVisible: boolean;
}
const MyCalendar: React.FC<EventList> = ({ userId, isVisible }) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const events = useRef<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [currentMonth, setCurrentMonth] = useState<string>(
    new Date().toISOString().split("T")[0].slice(0, 7)
  );
  const [displayEvents, setDisplayEvents] = useState<Event[]>();
  const [markedDates, setMarkedDates] = useState({
    [today]: {
      selected: true,
      selectedColor: themeColors.primary,
    },
  });
  const Location = useSelector((state: { location: any }) => state.location);
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isVisible ? mvs(310) : 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [isVisible]);

  useFocusEffect(
    useCallback(() => {
      setSelectedDate("");
      const fetchEvents = async () => {
        const response = await getAllRelevantEvents(Location.longitude, Location.latitude, 25, false, false);
        events.current = response;
        const eventDates = events.current.map((event) => event.date);
        const updatedMarkedDates = eventDates.reduce(
          (acc: any, date: string) => {
            acc[date] = {
              marked: true,
              dotColor: themeColors.primary,
              activeOpacity: 0,
            };
            return acc;
          },
          {}
        );
        setMarkedDates((prevMarkedDates: any) => ({
          ...prevMarkedDates,
          ...updatedMarkedDates,
        }));
      };
      fetchEvents();
    }, [])
  );

  const onDayPress = (day: any) => {
    setModalVisible(true);
    const selectedDate = day.dateString;
    setSelectedDate(selectedDate);
    const eventsForSelectedDate = events.current.filter(
      (event) => event.date === selectedDate
    );
    setDisplayEvents(eventsForSelectedDate);
  };

  const handleEventPress = (eventId: string) => {
    setSelectedDate("");
    router.push(`/events/${eventId}`);
  };

  return (
    <Animated.View style={[styles.animatedContainer, { height: heightAnim }]}>
      {!!events.current && isVisible && (
        <Calendar
          style={{
            flexGrow: 1,
            height: mvs(300),
            borderRadius: 20,
            margin: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 5,
          }}
          current={currentMonth}
          theme={{
            textDayFontSize: mvs(18),
            textMonthFontSize: mvs(22),
            textMonthFontWeight: "bold",
            selectedDayBackgroundColor: themeColors.primary,
            selectedDayTextColor: "#fff",
            todayTextColor: themeColors.primary,
            arrowColor: themeColors.primary,
            arrowWidth: 28,
            textDayStyle: {
              textAlign: "center",
            },
            weekVerticalMargin: 2,
          }}
          enableSwipeMonth={true}
          minDate={Date()}
          onMonthChange={(month: any) =>
            setCurrentMonth(month.dateString.split("T")[0].slice(0, 7))
          }
          markedDates={markedDates}
          onDayPress={onDayPress}
        />
      )}

      {selectedDate && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Events for {selectedDate}</Text>
                {displayEvents && displayEvents.length > 0 ? (
                  <ScrollView style={{ width: "100%" }}>
                    {displayEvents.map((event, index) => (
                      <CalendarEventCard
                        event={event}
                        onPress={handleEventPress}
                        isForProfile={false}
                        key={index}
                      />
                    ))}
                  </ScrollView>
                ) : (
                  <Text>No events for this day.</Text>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: mhs(350),
    maxHeight: mvs(400),
    padding: mvs(20),
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: vs(16) },
  arrow: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#007AFF",
  },
  eventText: { fontSize: 16, marginVertical: mvs(5) },
  animatedContainer: { overflow: "hidden" },
});

export default MyCalendar;
