import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from "react-native";
import { API_ENDPOINTS } from "@/utils/api/endpoints";
import { Event } from "@/types/event";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { mvs } from "@/utils/helpers/uiScaler";
import { IconPlacement } from "@/utils/constants/enums";
import EventHeader from "@/components/EventHeader";
import ConfirmButton from "@/components/ConfirmButton";
import axiosInstance from "@/services/axiosInstance";
import { useSelector } from "react-redux";
import themeColors from "@/utils/constants/colors";

const EventDetails = () => {
  const user = useSelector((state: { user: any }) => state.user);
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleJoinEvent = async () => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.JOIN_EVENT_BY_ID.replace("{id}", eventId!),
        null,
        { params: { userId: user.id } }
      );
      alert("Successfully joined event.");
      router.back();
    } catch (err) {
      setError("Failed to join event.");
      console.error(err);
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
        setError("Failed to fetch event details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" testID="loader"/>
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

  const cutoffTime = new Date();
  cutoffTime.setHours(cutoffTime.getHours() + parseInt(event.cutOffTime, 10));
  const currentTime = new Date();
  const timeDiff = cutoffTime.getTime() - currentTime.getTime();
  const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* EventHeader Component */}
        <EventHeader sportType={event.sportType} />

        {/* Event Details */}
        <View style={styles.detailsContainer}>
          {/* Event Title */}
          <View style={styles.eventHeader}>
            <Text style={styles.eventName}>{event.eventName}</Text>
          </View>

          {/* Address */}
          <Text style={styles.eventLocation}>
            {`${event.locationResponse.streetNumber} ${event.locationResponse.streetName}, ${event.locationResponse.city}, ${event.locationResponse.province}`}
          </Text>

          {/* Badges */}
          <View style={styles.badgesContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{event.requiredSkillLevel.join(", ")}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{event.isPrivate ? "Private" : "Public"}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{event.date}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
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
                    style={[
                      styles.participant,
                      participant.userId === user.id && styles.currentUserBorder,
                    ]}
                  >
                    <Image
                      source={require("@/assets/images/avatar-placeholder.png")}
                      style={styles.participantAvatar}
                      testID="participant-avatar"
                    />
                  </View>
                ))
            ) : (
              <Text style={styles.noParticipantsText}>
                No participants yet. Be the first to join!
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      {!isUserParticipant && (
        <View style={styles.joinButtonContainer}>
          <ConfirmButton
            text="Join Event"
            onPress={handleJoinEvent}
            icon={
              <MaterialCommunityIcons name="login" size={mvs(24)} color="#fff" />
            }
            iconPlacement={IconPlacement.left}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollView: {
    flex: 1,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  eventHeader: {
    marginBottom: 8,
  },
  eventName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  cutoffTime: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e53935",
    marginLeft: 8,
  },
  eventDate: {
    fontSize: 16,
    color: "#777",
    marginVertical: 4,
  },
  eventLocation: {
    fontSize: 16,
    color: "#555",
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  badge: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    backgroundColor: "#f0f0f0",
  },
  badgeText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skillLevel: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
    fontStyle: "italic",
  },
  eventPrivacy: {
    fontSize: 16,
    color: "#555",
    marginLeft: 16,
  },
  section: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 16,
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
  joinButtonContainer: {
    marginHorizontal: 64,
    padding: 16,
    backgroundColor: "#f9f9f9",
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
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  noParticipantsText: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    marginVertical: 16,
  },
});

export default EventDetails;
