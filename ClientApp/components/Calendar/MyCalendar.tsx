import { getEventsJoined } from "@/services/eventService";
import themeColors from "@/utils/constants/colors";
import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Event } from "@/types/event";
import { useRouter } from "expo-router";
import CalendarEventCard from "../Event/CalendarEventCard";
import { vs } from "@/utils/helpers/uiScaler";
import { ActivityIndicator } from "react-native-paper";

interface EventList {
  userId: string;
}
const MyCalendar: React.FC<EventList> = ({ userId }) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  // const [events, setEvents] = useState<any[]>([]);
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
  useEffect(() => {
    setSelectedDate("");
    const fetchEvents = async () => {
      const response = await getEventsJoined(userId);
      events.current = response.data.content;
      const eventDates = events.current.map((event) => event.date);

      const updatedMarkedDates = eventDates.reduce((acc: any, date: string) => {
        acc[date] = {
          marked: true,
          dotColor: themeColors.primary,
          activeOpacity: 0,
        };
        return acc;
      }, {});
      setMarkedDates((prevMarkedDates: any) => ({
        ...prevMarkedDates,
        ...updatedMarkedDates,
      }));
    };
    fetchEvents();
  }, []);

  console.log(markedDates);
  const onDayPress = (day: any) => {
    setModalVisible(true);
    const selectedDate = day.dateString;
    setSelectedDate(selectedDate);
    const eventsForSelectedDate = events.current.filter(
      (event) => event.date === selectedDate
    );
    setDisplayEvents(eventsForSelectedDate);
    console.log("Events: ", displayEvents);

    // setEvents(markedDates[selectedDate] || []);
  };

  const CustomLeftArrow = ({ onPress }: any) => (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.arrow}>{"<"}</Text>
    </TouchableOpacity>
  );

  // Custom right arrow component
  const CustomRightArrow = ({ onPress }: any) => (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.arrow}>{">"}</Text>
    </TouchableOpacity>
  );

  const handleMonthChange = (direction: "left" | "right") => {
    const [year, month] = currentMonth.split("-");
    const currentDate = new Date(parseInt(year), parseInt(month) - 1);

    if (direction === "left") {
      currentDate.setMonth(currentDate.getMonth() - 1); // Go to previous month
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1); // Go to next month
    }

    const newMonth = currentDate.toISOString().split("T")[0].slice(0, 7); // YYYY-MM

    setCurrentMonth(newMonth);
  };

  const handleEventPress = (eventId: string) => {
    setSelectedDate("");
    router.push(`/events/${eventId}`);
  };

  return (
    <View style={{ height: "90%" }}>
      {!!events.current ? (
        <Calendar
          style={{
            // height: vs(800),
            height: 500,
          }}
          current={currentMonth}
          theme={{
            textDayFontSize: 18, // Day text font size
            textMonthFontSize: 22, // Month text font size
            selectedDayBackgroundColor: themeColors.primary, // Selected day background color
            selectedDayTextColor: "#fff", // Text color for selected day
            todayTextColor: themeColors.primary, // Today text color
            // Dot size for marked dates
            arrowColor: "green",
          }}
          minDate={Date()}
          // renderArrow={(direction: any) =>
          //   direction === 'left' ? (
          //     <CustomLeftArrow onPress={() => handleMonthChange('left')} />
          //   ) : (
          //     <CustomRightArrow onPress={() => handleMonthChange('right')} />
          //   )
          // }
          onMonthChange={(month: any) =>
            setCurrentMonth(month.dateString.split("T")[0].slice(0, 7))
          }
          markedDates={markedDates}
          onDayPress={onDayPress}
        />
      ) : (
        <ActivityIndicator />
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
                  displayEvents.map((event, index) => (
                    <CalendarEventCard
                      event={event}
                      onPress={handleEventPress}
                      isForProfile={false}
                      key={index}
                    />
                  ))
                ) : (
                  <Text>No events for this day.</Text>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
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
    width: 350,
    padding: 20,
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
  eventText: { fontSize: 16, marginVertical: 5 },
});

export default MyCalendar;
