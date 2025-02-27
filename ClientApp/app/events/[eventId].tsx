import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Pressable, SafeAreaView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { Event } from "@/types/event";
import ConfirmButton from "@/components/Helper Components/ConfirmButton";
import themeColors from "@/utils/constants/colors";
import { hs, mhs, mvs, vs } from "@/utils/helpers/uiScaler";
import { sportIconMap } from "@/utils/mappers/eventIconsMappers";
import { getEventById, joinEvent } from "@/utils/api/eventApiClient";
import SkillTag from "@/components/Event/SkillTag";
import CustomTabMenu from "@/components/Helper Components/CustomTabMenu";
import EventLocationMap from "@/components/Helper Components/EventLocationMap";

const EventPosts = () => {
  return (
    <View>
      <Text>Event Posts</Text>
    </View>
  );
}

const EventDetails = ({ event, handleJoinEvent }: { event: Event; handleJoinEvent: () => void }) => {
  const router = useRouter();
  const user = useSelector((state: { user: any }) => state.user);
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            {event.participants.filter((p) => p.attendStatus === "JOINED" || p.attendStatus === "CONFIRMED").length}/
            {event.maxParticipants}
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.participantsScrollContainer}>
          {event.participants.filter((p) => p.attendStatus === "JOINED" || p.attendStatus === "CONFIRMED").length >
            0 ? (
            event.participants
              .filter((p) => p.attendStatus === "JOINED" || p.attendStatus === "CONFIRMED")
              .map((participant) => (
                <Pressable
                  key={participant.userId}
                  onPress={() => {
                    if (participant.userId !== user.id) {
                      router.push({
                        pathname: `/userProfiles/[id]`,
                        params: { id: participant.userId },
                      });
                    }
                  }}
                >
                  <View style={styles.participant}>
                    <Image
                      source={require("@/assets/images/avatar-placeholder.png")}
                      style={[styles.participantAvatar, participant.userId === user.id && styles.currentUserBorder]}
                      testID="participant-avatar"
                    />
                    {participant.userId === user.id && (
                      <Text style={styles.currentUserText}>You</Text>
                    )}
                  </View>
                </Pressable>
              ))
          ) : (
            <Text style={styles.noParticipantsText}>
              No participants yet. Be the first to join!
            </Text>
          )}
        </ScrollView>
      </View>
      
      {/* Event Location Map */}
      {event.locationResponse?.latitude && event.locationResponse?.longitude && (
        <View style={styles.section}>
          <EventLocationMap 
            latitude={parseFloat(event.locationResponse.latitude)} 
            longitude={parseFloat(event.locationResponse.longitude)} 
          />
        </View>
      )}
    </ScrollView>
  );
};

const EventPage: React.FC = () => {
  const user = useSelector((state: { user: any }) => state.user);
  const [event, setEvent] = useState<Event | null>(null);
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventData = await getEventById(eventId!);
        setEvent(eventData);
      } catch (err) {
        setError("Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchEventDetails();
  }, [eventId]);

  const handleJoinEvent = async () => {
    try {
      await joinEvent(eventId!, user.id);
      setEvent((prevEvent) => {
        if (!prevEvent) return prevEvent;
        return {
          ...prevEvent,
          participants: [
            ...prevEvent.participants,
            { userId: user.id, attendStatus: "JOINED" },
          ],
        };
      });
    } catch (err) {
      setError("Failed to join the event.");
    }
  };

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

  let sportIcon = sportIconMap[event.sportType];

  const routes = [
    { key: "eventDetails", title: "Details", testID: "eventDetails" },
    { key: "eventPosts", title: "Posts", testID: "eventPosts" },
  ];
  
  const scenes = {
    eventDetails: <EventDetails event={event} handleJoinEvent={handleJoinEvent} />,
    eventPosts: <EventPosts />,
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.eventName}>{event.eventName}</Text>
          <View style={styles.details}>
            <Text style={styles.detailText}>
              📅 {new Date(event.date).toDateString()} •
              ⏰ {`${event.startTime.slice(0, -3)} - ${event.endTime.slice(0, -3)}`}
            </Text>
            <Text style={styles.detailText}>
              <MaterialCommunityIcons
                name={event.sportType ? sportIcon as any : "help-circle-outline"}
                size={20}
                color="#94504b"
              />
              {event.sportType} • {event.eventType}
            </Text>
            <View style={styles.skillTags}>
              {event.requiredSkillLevel.map((level, index) => (
                <SkillTag key={index} level={level} />
              ))}
            </View>
          </View>
          <View style={styles.joinButtonContainer}>
            {!isUserParticipant ? (
              <ConfirmButton text="Join Event" onPress={handleJoinEvent} icon={undefined} iconPlacement={null} />
            ) : (
              <View style={styles.joinedTextContainer}>
                <Text style={styles.joinedText}>Joined</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <CustomTabMenu routes={routes} scenes={scenes} backgroundColor={"#fff"} />
    </SafeAreaView>
  );
};

export default EventPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: mhs(8),
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
    padding: mhs(20),
  },
  errorText: {
    fontSize: mvs(16),
    color: "red",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: mvs(3),
    backgroundColor: "#ffffff",
    padding: mhs(10),
    borderRadius: mhs(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  eventName: {
    fontSize: mvs(23),
    fontWeight: "bold",
    marginLeft: mhs(8),
    color: "#333",
  },
  details: {
    backgroundColor: "#ffffff",
    padding: mhs(10),
    borderRadius: mhs(10),
    marginLeft: mhs(15),
  },
  detailText: {
    fontSize: mvs(13),
    color: "#555",
    marginBottom: mvs(3),
  },
  skillTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: mvs(5),
  },
  section: {
    marginVertical: mvs(5),
    backgroundColor: "#ffffff",
    padding: mhs(10),
    borderRadius: mhs(10),
  },
  sectionTitle: {
    fontSize: mvs(15),
    fontWeight: "bold",
    color: "#333",
    marginBottom: mvs(4),
  },
  sectionText: {
    fontSize: mvs(14),
    color: "#555",
  },
  participantsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: mvs(8),
  },
  participantsCount: {
    fontSize: mvs(16),
    color: "#777",
  },
  participant: {
    alignItems: "center",
    marginRight: mhs(16),
  },
  participantAvatar: {
    width: mhs(45),
    height: mvs(45),
    borderRadius: mhs(30),
  },
  currentUserBorder: {
    borderWidth: mhs(3),
    borderRadius: mhs(30),
    borderColor: themeColors.primary,
  },
  currentUserText: {
    fontSize: mvs(12),
    marginTop: mvs(5),
    textAlign: "center",
  },
  noParticipantsText: {
    fontSize: mvs(13),
    color: "#777",
    textAlign: "center",
    marginVertical: mvs(16),
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: mhs(8),
  },
  joinButtonContainer: {
    marginRight: mhs(60),
    marginLeft: mhs(46),
  },
  joinedTextContainer: {
    borderWidth: 2,
    borderColor: "green",
    backgroundColor: "white",
    height: vs(50),
    borderRadius: mhs(25),
    alignItems: 'center',
    justifyContent: "center",
    marginBottom: vs(16),
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: vs(2) },
    shadowOpacity: 0.25,
    shadowRadius: hs(4),
    minHeight: 40
  },
  joinedText: {
    color: "green",
    fontWeight: "bold",
    fontSize: mvs(16),
  },
  participantsScrollContainer: {
    flexDirection: "row",
    paddingVertical: vs(10),
  },
});
