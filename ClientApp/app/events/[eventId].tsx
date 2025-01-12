import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import SkillTag from "@/components/Event/SkillTag";
import { Event } from "@/types/event";
import { API_ENDPOINTS } from "@/utils/api/endpoints";
import { getAxiosInstance } from "@/services/axiosInstance";
import ConfirmButton from "@/components/Helper Components/ConfirmButton";
import themeColors from "@/utils/constants/colors";

const EventDetails = () => {
  const axiosInstance = getAxiosInstance();
  const user = useSelector((state: { user: any }) => state.user);
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleJoinEvent = async () => {
    try {
      await axiosInstance.post(
        API_ENDPOINTS.JOIN_EVENT_BY_ID.replace("{id}", eventId!),
        null,
        { params: { userId: user.id } }
      );
      alert("Successfully joined the event!");
      router.back();
    } catch (err) {
      console.error(err);
      setError("Failed to join the event.");
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axiosInstance.get<Event>(
          API_ENDPOINTS.GET_EVENT_BY_ID.replace("{id}", eventId!)
        );
        setEvent(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Event not found.</Text>
      </View>
    );
  }

  const isUserParticipant = event.participants.some(
    (participant) => participant.userId === user.id
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Event Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons
          name={event.sportType ? (event.sportType.toLowerCase() as any) : "help-circle-outline"}
          size={50}
          color="#94504b"
        />
        <Text style={styles.eventName}>{event.eventName}</Text>
      </View>

      {/* Event Details */}
      <View style={styles.details}>
        <Text style={styles.detailText}>
          📍 {event.locationResponse?.streetNumber} {event.locationResponse?.streetName}, {event.locationResponse.city}, {event.locationResponse.province}
        </Text>
        <Text style={styles.detailText}>
          📅 {new Date(event.date).toDateString()}
        </Text>
        <Text style={styles.detailText}>
          {event.isPrivate ? "🔒 Private Event" : "🌐 Public Event"}
        </Text>
        {/* Skill Tags */}
        <View style={styles.skillTags}>
          {event.requiredSkillLevel.map((level, index) => (
            <SkillTag key={index} level={level} />
          ))}
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.sectionText}>
          {event.description || "No description provided for this event."}
        </Text>
      </View>

      {/* Participants */}
      <View style={styles.section}>
        <View style={styles.participantsHeader}>
          <Text style={styles.sectionTitle}>Participants</Text>
          <Text style={styles.participantsCount}>
            {event.participants.filter((p) => p.attendStatus === null).length}/
            {event.maxParticipants}
          </Text>
        </View>
        <View style={styles.participantsContainer}>
          {event.participants.filter((p) => p.attendStatus === null).length >
            0 ? (
            event.participants
              .filter((p) => p.attendStatus === null)
              .map((participant) => (
                <View
                  key={participant.userId}
                  style={styles.participant}
                >
                  <Image
                    source={require("@/assets/images/avatar-placeholder.png")}
                    style={[styles.participantAvatar, participant.userId === user.id && styles.currentUserBorder ]}
                    testID="participant-avatar"
                  />
                  {participant.userId === user.id && (
                    <Text style={styles.currentUserText}>You</Text>
                  )}
                </View>
              ))
          ) : (
            <Text style={styles.noParticipantsText}>
              No participants yet. Be the first to join!
            </Text>
          )}
        </View>
      </View>

      {/* Join Button */}
      {!isUserParticipant && (
        <ConfirmButton
          text="Join Event"
          onPress={handleJoinEvent} icon={undefined} iconPlacement={null} />
      )}
    </ScrollView>
  );
};

export default EventDetails;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  eventName: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
    color: "#333",
  },
  details: {
    marginBottom: 15,
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  skillTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 5,
  },
  section: {
    marginVertical: 10,
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 14,
    color: "#555",
  },
  participantsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
  },
  participantsCount: {
    fontSize: 16,
    color: "#777",
  },
  participantsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  participant: {
    alignItems: "center",
    marginRight: 16,
  },
  participantAvatar: {
    width: 45,
    height: 45,
    borderRadius: 30,
  },
  currentUserBorder: {
    borderWidth: 3,
    borderRadius: 30,
    borderColor: themeColors.primary,
  },
  currentUserText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  noParticipantsText: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    marginVertical: 16,
  },
});
