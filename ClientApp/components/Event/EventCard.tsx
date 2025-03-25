import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Event } from "@/types/event";
import SkillTag from "./SkillTag";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

// all the show props are optional and default to true to modularize the component
interface EventCardProps {
  event: Event;
  onPress: (eventId: string) => void;
  showSkillTags?: boolean;
  showCapacity?: boolean;
  showDescription?: boolean;
  showDetailPreview?: boolean;
  showDate?: boolean;
  showLocation?: boolean;
  showSportType?: boolean;
  showTimeLeft?: boolean;
  isForProfile?: boolean;
  isForVisitedProfile?: boolean,
}

export const stringToDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return new Date(+year, +month - 1, +day);
}

export const formatDate = (date: Date, locale: string) => {
  return format(date, 'EEE MMM dd yyyy', { locale: locale === 'fr' ? fr : enUS });
};

const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  isForProfile = false,
  showSkillTags = isForProfile ? false : true,
  showCapacity = isForProfile ? false : true,
  showDescription = isForProfile ? false : true,
  showDetailPreview = true,
  showDate = true,
  showLocation = isForProfile ? false : true,
  showTimeLeft = isForProfile ? false : true,
  showSportType = true,
  isForVisitedProfile = false,
}) => {
  // Sport Icon Mapping (type-safe)
  const sportIcons: {
    [key: string]: keyof typeof MaterialCommunityIcons.glyphMap;
  } = {
    Football: "soccer",
    Basketball: "basketball",
    Baseball: "baseball",
    Hockey: "hockey-puck",
    Soccer: "soccer",
    Golf: "golf",
    Tennis: "tennis",
    Hiking: "hiking",
    Boxing: "boxing-glove",
    Cycling: "bike",
    Rugby: "rugby",
    Running: "run",
    "Ping-Pong": "table-tennis",
  };

  const getTimeLeftColor = (daysLeft: number) => {
    if (daysLeft >= 1) return "#0C9E04"; // Green
    else return "#FF0000"; // Red (hours or minutes left)
  };

  const currentTime = new Date();
  const cutoffTime = new Date(event.cutOffTime);

const { t, i18n } = useTranslation();
const locale = i18n.language === 'fr' ? 'fr' : 'en';

  let timeLeftShown = "";
  let eventStarted = false;
  let canJoin = true;
  let daysLeft = 0;

  if (!isNaN(cutoffTime.getTime())) {
    const timeDifference = cutoffTime.getTime() - currentTime.getTime();
    const adjustedTimeDifference = timeDifference - cutoffTime.getTimezoneOffset() * 60 * 1000; // Convert offset to milliseconds

    if (adjustedTimeDifference > 0) {
      const minutesLeft = Math.floor(adjustedTimeDifference / (1000 * 60));
      const hoursLeft = Math.floor(minutesLeft / 60);
      daysLeft = Math.floor(hoursLeft / 24);
      const weeksLeft = Math.floor(daysLeft / 7);

      if (minutesLeft < 60) {
        timeLeftShown = `${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""} ${t('event_card.left_to_join')}`;
      } else if (hoursLeft < 24) {
        timeLeftShown = `${hoursLeft} ${t('event_card.hour')}${hoursLeft !== 1 ? "s" : ""} ${t('event_card.left_to_join')}`;
      } else if (daysLeft < 7) {
        timeLeftShown = `${daysLeft} ${t('event_card.day')}${daysLeft !== 1 ? "s" : ""} ${t('event_card.left_to_join')}`;
      } else {
        timeLeftShown = `${weeksLeft} ${t('event_card.week')}${weeksLeft !== 1 ? "s" : ""} ${t('event_card.left_to_join')}`;
      }
    } else {
      eventStarted = true;
      canJoin = false;
      timeLeftShown = t('event_card.registration_closed');
    }
  } else {
    eventStarted = true;
    canJoin = false;
    timeLeftShown = "Invalid cutoff time";
  }

  const timeLeftColor = getTimeLeftColor(daysLeft);

  // Dynamic styling for the card
  const dynamicCardStyle = {
    backgroundColor: eventStarted && isForProfile ? "#B9B9B9" : "#ffffff", // Light red for expired, white for active
    borderColor: canJoin ? "#f5c2c7" : "#cccccc", // Red border for expired, grey for active
    padding: isForProfile ? 7 : 15,
  };

  const dynamicTimeLeftStyle = {
    color: canJoin ? "#dc3545" : "#000000", // Red text for expired, black for active
  };

  return (
    <TouchableOpacity testID='event-card' style={[styles.card, dynamicCardStyle]} onPress={() => onPress(event.id)}>
      <Text
  style={[
    styles.eventName,
    event.cancellation && { color: "red" }
  ]}
>
  {event.eventName}
  {event.cancellation && " (Cancelled)"}
</Text>
 {showDetailPreview &&(
          <Text style={styles.eventDetails}>
            {isForVisitedProfile
          ? `${event.sportType}`
          : showSportType
            ? `${event.sportType} - ${event.far} ${t('event_card.km_away')}`
            : `${event.far} ${t('event_card.km_away')}`}
        </Text>
    )}

      {showSportType &&
        <View style={styles.sportIconContainer}>
          <MaterialCommunityIcons
            name={sportIcons[event.sportType] || 'help-circle-outline'} // Fallback icon
            size={40}
            color="#94504b"
          />
        </View>}

      {showDate &&
        <Text style={styles.date}>
          📅 {formatDate(new Date(event.date), i18n.language)}
        </Text>}

      {showLocation && (
        <Text style={styles.location}>
          📍 {event.locationResponse.city}, {event.locationResponse.province}
        </Text>
      )}

      {showDescription && (
        <Text style={styles.description}>
          {event.description.length > 100
            ? `${event.description.slice(0, 100)}...`
            : event.description}
        </Text>
      )}

      {showSkillTags && (
        <View style={styles.skillLevelContainer}>
          {event.requiredSkillLevel.map((level, index) => (
            <SkillTag key={index} level={level} />
          ))}
        </View>
      )}

      {showCapacity && (
        <Text style={styles.capacity}>
          {event.participants.length}/{event.maxParticipants}
        </Text>
      )}

      {showTimeLeft && (
        <Text style={[styles.timeLeft, { color: timeLeftColor }]}>
          {timeLeftShown}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  skillLevelContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  eventDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  sportIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  date: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  description: {
    fontSize: 13,
    color: "#777",
    marginBottom: 5,
  },
  capacity: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
    fontWeight: "bold",
    position: "absolute",
    bottom: 15,
    right: 15,
  },
  timeLeft: {
    marginTop: 10,
    fontSize: 14,
  },
});
