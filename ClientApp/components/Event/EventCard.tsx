import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Event } from '@/types/event';
import SkillTag from './SkillTag';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  showSkillTags = true, 
  showCapacity = true, 
  showDescription = true,
  showDetailPreview = true,
  showDate = true,
  showLocation = true,
  showTimeLeft = true,
  showSportType = true,
}) => {

// Sport Icon Mapping (type-safe)
const sportIcons: { [key: string]: keyof typeof MaterialCommunityIcons.glyphMap } = {
  Football: 'soccer',
  Basketball: 'basketball',
  Baseball: 'baseball',
  Hockey: 'hockey-puck',
  Soccer: 'soccer',
  Golf: 'golf',
  Tennis: 'tennis',
  Hiking: 'hiking',
  Boxing: 'boxing-glove',
  Cycling: 'bike',
  Rugby: 'rugby',
  'Ping-Pong': 'table-tennis',
};

const currentTime = new Date();
const cutoffTime = new Date(event.cutOffTime);
let hoursLeft = 0;
let minutesLeft = 0;
const timeLeftshown = "";

// Ensure both currentTime and cutoffTime are valid
let timeLeftShown = "";

if (!isNaN(cutoffTime.getTime())) {
  const timeLeft = cutoffTime.getTime() - currentTime.getTime();
  if (timeLeft > 1) {
    // Calculate remaining time in minutes, hours, and days
    const minutesLeft = Math.floor(timeLeft / (1000 * 60));
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const weeksLeft = Math.floor(daysLeft / 7);

    if (minutesLeft < 60) {
      timeLeftShown = `${minutesLeft} minutes`;
    } else if (hoursLeft < 24) {
      timeLeftShown = `${hoursLeft} hours`;
    } else if (daysLeft < 7) {
      timeLeftShown = `${daysLeft} days`;
    } else {
      timeLeftShown = `${weeksLeft} week${weeksLeft > 1 ? "s" : ""}`;
    }
  } else {
    return null  }
} else {
  console.error("Invalid cutoff time format.");
}

return (
  <TouchableOpacity style={styles.card} onPress={() => onPress(event.id)}>
    <Text style={styles.eventName}>{event.eventName}</Text> 
    {showDetailPreview && 
    <Text style={styles.eventDetails}>
      {showSportType ? `${event.sportType} - X km away` : `X km away`}
      </Text>}
    
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
      📅 {new Date(event.date).toDateString()}
    </Text>}

    {showLocation && 
    <Text style={styles.location}>
      📍 {event.locationResponse.city}, {event.locationResponse.province}
    </Text>}
    
    {showDescription && (
      <Text style={styles.description}>
        {event.description.length > 100
          ? `${event.description.slice(0, 100)}...`
          : event.description}
      </Text>)}

    {showSkillTags && (
      <View style={styles.skillLevelContainer}>
        {event.requiredSkillLevel.map((level, index) => (
          <SkillTag key={index} level={level} />
        ))}
      </View>)}

    {showCapacity && (
      <Text style={styles.capacity}>
        {event.participants.length}/{event.maxParticipants}
      </Text>)}

    {showTimeLeft && <Text style={styles.timeLeft}>
      {timeLeftShown} left to join
    </Text>}

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
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  skillLevelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  sportIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  date: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  description: {
    fontSize: 13,
    color: '#777',
    marginBottom: 5,
  },
  capacity: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  timeLeft: {
    marginTop: 10,
    fontSize: 14,
    color: '#0C9E04',
  },
});
