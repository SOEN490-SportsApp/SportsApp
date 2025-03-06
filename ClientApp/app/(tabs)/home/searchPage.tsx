import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import themeColors from "@/utils/constants/colors";
import { hs, vs } from "@/utils/helpers/uiScaler";
import { searchUser } from "@/services/userService";
import CustomTabMenu from "@/components/Helper Components/CustomTabMenu";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FriendCard from "@/components/Helper Components/FriendCard";
import { Profile } from "@/types";
import MapView, { Marker } from "react-native-maps";
import { getAllEvents } from "@/services/eventService";
import { Event } from "@/types/event";
import * as Location from "expo-location";
import { Linking } from "react-native";
import { Platform } from "react-native";
import EventList from "@/components/Event/EventList";

export default function searchPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [cancel, setCancel] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchText) {
        await fetchResults(searchText);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchResults = async (searchText: string) => {
    setLoading(true);
    try {
      const response = await searchUser(searchText);
      if (response) {
        setResults(response);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeText = (text: string) => {
    setCancel(true);
    setSearchText(text);
  };

  const LoadingScreen = () => {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={themeColors.sportIcons.lightGrey} />
      </View>
    );
  }
  const UsersTab = () => (
    <View >
      {loading ? (
        <View>
          <LoadingScreen />
        </View>
      ) : (searchText.length >= 1) ? (
        <FlatList
          data={results}
          renderItem={({ item }) => <FriendCard user={item} />}
          ListEmptyComponent={<CenterMessage  message={"No users found"}/>}
        />
      ) : (
        <CenterMessage  message={"Connect with others and plan events!"}/>
      )}
    </View>
  );

  const CenterMessage = ({message}: {message:string}) => (
    <View style={{paddingTop:'50%'}}>
      <Text style={[{textAlign:"center"}, styles.initialSearchText]}>{message} </Text>
    </View>
  )

  const EventsTab = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const mapRef = useRef<MapView | null>(null);
    const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [isMapExpanded, setIsMapExpanded] = useState(false);
    const [viewMode, setViewMode] = useState<"map" | "list">("list");

    useEffect(() => {
      const fetchEvents = async () => {
        setLoading(true);
        try {
          const response = await getAllEvents();
          setEvents(response);
        } catch (err) {
          console.log("Error fetching events:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchEvents();
    }, []);

    useEffect(() => {
      const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location.coords);
        }
      };
      getLocation();
    }, []);

    const onEventCardPress = (event: Event) => {
      mapRef.current?.animateToRegion(
        {
          latitude: Number(event.locationResponse.coordinates?.y),
          longitude: Number(event.locationResponse.coordinates?.x),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    };

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      );
    }

    const handleEventPress = (eventId: string) => {
      router.push(`/events/${eventId}`);
    };

    const centerOnUser = () => {
      if (userLocation && mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1000
        );
      }
    };

    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => {
            setViewMode(viewMode === "map" ? "list" : "map");
            setIsMapExpanded(!isMapExpanded);
          }}
        >
          <MaterialCommunityIcons
            name={viewMode === "map" ? "format-list-bulleted" : "map"}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <MapView
          // mapType="hybrid"
          showsUserLocation
          ref={mapRef}
          style={{ flex: isMapExpanded ? 1 : 0.3 }}
          initialRegion={
            userLocation
            ? {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : {
                latitude: events.length && events[0].locationResponse.coordinates?.y !== undefined
                  ? Number(events[0].locationResponse.coordinates.y)
                  : 45.5017,
                longitude: events.length && events[0].locationResponse.coordinates?.x !== undefined
                  ? Number(events[0].locationResponse.coordinates.x)
                  : -73.5673,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }
            }
        >
          {events.map((event) => (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.locationResponse.coordinates?.y ? Number(event.locationResponse.coordinates.y) : 0,
                longitude: event.locationResponse.coordinates?.x ? Number(event.locationResponse.coordinates.x) : 0,
              }}
              title={event.eventName}
              onPress={() => handleEventPress(event.id)}
            />
          ))}
        </MapView>

        {viewMode === "map" ? (
          <>
            <TouchableOpacity style={styles.centerButton} onPress={centerOnUser}>
              <MaterialCommunityIcons name="crosshairs-gps" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.eventListContainer}>
              <FlatList
                data={events}
                horizontal
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                renderItem={({ item }) => (
                  <EventCard event={item} onPress={() => onEventCardPress(item)} />
                )} />
            </View>
          </>
        ) : (
          <View style={styles.eventListSection}>
            <EventList fetchEventsFunction={() => getAllEvents().then(data => ({ data: { content: data, totalElements: data.length, totalPages: 1, pageable: { pageNumber: 0, pageSize: data.length } } }))} />
          </View>
        )}
      </View>
    );
  };

  const openNavigation = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };
  
  const EventCard = ({ event, onPress }: { event: Event; onPress: () => void }) => {
    const router = useRouter();
  
    return (
      <TouchableOpacity style={styles.eventCard} onPress={onPress}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventName}>{event.eventName}</Text>
          <Text style={styles.eventType}>{event.sportType} • {event.eventType}</Text>
          <Text style={styles.eventLocation}>📍 {event.locationResponse.city || "Unknown Location"}</Text>
  
          <View style={styles.buttonContainer}>
          <TouchableOpacity 
              style={styles.detailsButton} 
              onPress={() => router.push(`/events/${event.id}`)}
            >
              <Text style={styles.buttonText2}>Details</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navigateButton} 
              onPress={() => {
                const latitude = Number(event.locationResponse.coordinates?.y);
                const longitude = Number(event.locationResponse.coordinates?.x);
                if (!isNaN(latitude) && !isNaN(longitude)) {
                  openNavigation(latitude, longitude);
                }
              }}
            >
              <Text style={styles.buttonText}>Navigate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  

  const routes = [
    { key: "users", title: "Users", testID: "Users" },
    { key: "events", title: "Events", testID: "Events" },
  ];

  const scenes = {
    users: <UsersTab />,
    events: <EventsTab />,
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Animated.View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="arrow-left"
              testID="backArrow"
              size={30}
              color="#aaa"
            />
          </View>
        </TouchableOpacity>
        <TextInput
          style={[styles.searchInput]}
          placeholder="Search..."
          value={searchText}
          onChangeText={(text) => handleChangeText(text)}
          placeholderTextColor="#999"
        />
        {cancel && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setSearchText("")}
          >
            <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="window-close"
              testID="window-close"
              size={30}
              color="#aaa"
            />
            </View>
          </TouchableOpacity>
        )}
      </Animated.View>
      <View style={{ flex: 1 }}>
        <CustomTabMenu routes={routes} scenes={scenes} backgroundColor="#f5f5f5"/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: vs(128)
    },
  header1: {
    padding: 15,
    marginTop: vs(50),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: hs(15),
    paddingVertical: vs(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f5f5f5",
  },
  logoText: {
    color: "#0C9E04",
    fontSize: vs(28),
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    width: "80%",
    borderWidth: 1,
    borderColor: "#d3d3d3",
  },
  iconButton: {
    marginLeft: vs(15),
  },
  searchInput: {
    flex: 1,
    marginHorizontal: hs(10),
    height: vs(40),
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 20,
    paddingHorizontal: hs(15),
    backgroundColor: "#f5f5f5",
    color: "000",
  },
  iconCircle: {
    width: vs(30),
    height: hs(40),
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeColors.background.lightGrey,
    borderRadius: 24,
    paddingLeft: hs(8),
    minHeight: vs(56),
  },
  initialSearchText:{
    color: themeColors.sportIcons.lightGrey,
    fontSize: 24,
    fontWeight: "bold",
  },
  eventListContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  eventCard: {
    width: 250,
    height: Platform.OS === "ios" ? 100 : 110,
    backgroundColor: "white",
    borderRadius: 10,
    marginRight: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  eventType: {
    fontSize: 14,
    color: "gray",
  },
  eventLocation: {
    fontSize: 12,
    color: "gray",
  },
  navigateText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navigateButton: {
    marginTop: 5,
    backgroundColor: themeColors.primary,
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    width: "30%",
    marginLeft: "auto",
    marginRight: 0,
  },
  detailsButton: {
    marginTop: 5,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    width: "25%",
    marginLeft: 100,
    marginRight: 0,
    borderWidth: 1,
    borderColor: themeColors.primary,
  },
  buttonText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  buttonText2: {
    color: themeColors.primary,
    fontSize: 11,
    fontWeight: "bold",
  },
  centerButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 470 : 360,
    right: 20,
    backgroundColor: themeColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  centerButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  expandButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: themeColors.primary,
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  eventListSection: {
    flex: 1,
  },
  toggleButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: themeColors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
