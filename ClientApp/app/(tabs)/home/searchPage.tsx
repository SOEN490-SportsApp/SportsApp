import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
import { getAllRelevantEvents, searchEventsWithFilter } from "@/services/eventService";
import { Event } from "@/types/event";
import * as Location from "expo-location";
import { Linking } from "react-native";
import { Platform } from "react-native";
import EventList from "@/components/Event/EventList";
import { useSelector } from "react-redux";
import FilterModal, {
  FilterState,
} from "@/components/Helper Components/FilterSection/FilterModal";
import { useTranslation } from 'react-i18next';
import { debounce } from "lodash";

export default function searchPage() {
  const router = useRouter();
  const initialState: FilterState = {
    filterType: "All",
    skillLevel: "All",
    minDate: new Date(),
    maxDate: new Date(),
    filterDate: false
  };
  const [events, setEvents] = useState<Event[]>([]);
  const [searchText, setSearchText] = useState("");
  const [userResults, setUserResults] = useState<Profile[]>([]);
  const [cancel, setCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [activeIndex, setActiveIndex] = useState(0)
  const location = useSelector(
    (state: { location: Location.LocationObjectCoords | null }) =>
      state.location
  );
  const [userLocation, setUserLocation] =
    useState<Location.LocationObjectCoords | null>(location);
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState(false);
  const [filterState, setFilterState] = useState(initialState);
  const LocationOfUser = useSelector((state: { location: any }) => state.location);
  const { t } = useTranslation();
  const userProfile = useSelector((state: { user: { profile: Profile } }) => state.user.profile);

  useEffect(() => {
    const fetchInitialEvents = async () => {
      const response = await getAllRelevantEvents(LocationOfUser,100, true, false, 0 , 10);
      setEvents(response.data);
    };
    fetchInitialEvents();
  },[])


  const fetchEvents = useCallback(async (): Promise<void> => {
    try {
      let response;
      
      if (activeIndex === 0) {
        await fetchUserResults(searchText);
        
      } else {        
        response = await handleEventListData(0,10, setEvents);     
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if(activeIndex === 1){
       const fetchAndSetEvents = async () => {
      await fetchEvents()
    }
      fetchAndSetEvents()
    }
  }, [fetchEvents, activeIndex]);

  
  const handleFilterToggle = async () => {
    setFilter(true);
    setIsVisible(false);
  };

  const handleCleanFilters = () => {
    setFilterState(initialState);
    setFilter(false);
    setIsVisible(false);
  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location.coords);
        } else if (userProfile?.postalCode) {
          const coords = await getCoordsFromPostalCode(userProfile.postalCode);
          if (coords) {
            setUserLocation({
              latitude: coords.latitude,
              longitude: coords.longitude,
              altitude: 0,
              accuracy: 0,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            });
          }
        }
      } catch (error) {
        console.error("Location error:", error);
      }
    };
  
    if (!location) {
      getLocation();
    }
  }, [location]);
  
  const getCoordsFromPostalCode = async (postalCode: string) => {
    try {
      const apiKey = "YOUR_GOOGLE_GEOCODING_API_KEY";
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&region=ca&key=${apiKey}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        console.warn("Geocoding failed:", data.status);
        return null;
      }
    } catch (error) {
      console.error("Error fetching geocoding:", error);
      return null;
    }
  };  

  const handleEventListData = async (page: number, size: number, updateState?: (events: Event[]) => void): Promise<{ data: { content: Event[]; totalElements: number; totalPages: number; pageable: { pageNumber: number; pageSize: number; } } }> => {
      let response;
      try {
        if (filter || searchText) {
          response = await searchEventsWithFilter(searchText, filterState, LocationOfUser, page, size);
        } else {
          response = await getAllRelevantEvents(LocationOfUser, 50, true, true, page, size);
        }
        const eventArray = response?.data?.content || [];
  
        if (updateState) {
          updateState(eventArray);
        }
        return {
          data: {
            content: eventArray,
            totalElements: response?.data?.totalElements || 0,
            totalPages: response?.data?.totalPages || 0,
            pageable: response?.data?.pageable || { pageNumber: page, pageSize: size },
          },
        };
      } catch (error) {
        console.log(error);
        return {
          data: {
            content: [],
            totalElements: 0,
            totalPages: 0,
            pageable: { pageNumber: page, pageSize: size },
          },
        };
      } finally {
        setLoading(false);
      }
    };

  
  const fetchUserResults = async (searchText: string) => {
    try {
      const response = await searchUser(searchText);
      if (response) {
        setUserResults(response);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };


  const debouncedFetchEvents = useMemo(() => debounce(() => fetchEvents(), 700), [fetchEvents])
  const handleChangeText = (text: string) => {
    if(!loading){
      setLoading(true)
    }
    setCancel(true);
    setSearchText(text);
    debouncedFetchEvents()
  };

  
  const UsersTab = () => {
    return (
      <View>
        {loading ? (
          <View>
            <View style={styles.container}>
              <ActivityIndicator
                size="large"
                color={themeColors.sportIcons.lightGrey}
              />
            </View>
          </View>
        ) : searchText.length >= 1 ? (
          <FlatList
            data={userResults}
            renderItem={({ item }) => <FriendCard user={item} />}
            ListEmptyComponent={
              <CenterMessage message={t("search_page.no_users_found")} />
            }
          />
        ) : (
          <CenterMessage message={t("search_page.connect_with_others")} />
        )}
      </View>
    );
  };

  const CenterMessage = ({ message }: { message: string }) => (
    <View style={{ paddingTop: "50%" }}>
      <Text style={[{ textAlign: "center" }, styles.initialSearchText]}>
        {message}{" "}
      </Text>
    </View>
  );

  const EventsTab = ({
    userLocation,
  }: {
    userLocation: Location.LocationObjectCoords | null;

  }) => {
    const router = useRouter();
    const mapRef = useRef<MapView | null>(null);
    const [isMapExpanded, setIsMapExpanded] = useState(viewMode === "map");

    const onEventCardPress = (event: Event) => {
      mapRef.current?.animateToRegion(
        {
          latitude: Number(
            event.locationResponse.coordinates?.coordinates?.[1]
          ),
          longitude: Number(
            event.locationResponse.coordinates?.coordinates?.[0]
          ),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    };

    if (loading) {
      return (
        <View>
        <View style={styles.container}>
          <ActivityIndicator
            size="large"
            color={themeColors.sportIcons.lightGrey}
          />
        </View>
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

    const handleToggleViewMode = () => {
      const newMode = viewMode === "map" ? "list" : "map";
      setViewMode(newMode);
      setIsMapExpanded(newMode === "map");
    };

    const MemoizedMap = useMemo(() => (
      <MapView
        showsMyLocationButton={false}
        showsUserLocation
        ref={mapRef}
        style={{
          flex: isMapExpanded ? 1 : 0.3,
          margin: isMapExpanded ? 0 : 10,
        }}
        initialRegion={
          userLocation
            ? {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : {
                latitude:
                  events.length &&
                  events[0].locationResponse.coordinates?.coordinates?.[1] !==
                    undefined
                    ? Number(
                        events[0].locationResponse.coordinates.coordinates[1]
                      )
                    : 45.5017,
                longitude:
                  events.length &&
                  events[0].locationResponse.coordinates?.coordinates?.[0] !==
                    undefined
                    ? Number(
                        events[0].locationResponse.coordinates.coordinates[0]
                      )
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
              latitude: event.locationResponse.coordinates?.coordinates?.[1]
                ? Number(event.locationResponse.coordinates.coordinates[1])
                : 0,
              longitude: event.locationResponse.coordinates?.coordinates?.[0]
                ? Number(event.locationResponse.coordinates.coordinates[0])
                : 0,
            }}
            title={event.eventName}
            onPress={() => handleEventPress(event.id)}
          />
        ))}
      </MapView>
    ), [events, userLocation, isMapExpanded]);
    

    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={handleToggleViewMode}
        >
          <MaterialCommunityIcons
            name={viewMode === "map" ? "format-list-bulleted" : "map"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        {MemoizedMap}
       
        {viewMode === "map" ? (
          <>
            <TouchableOpacity
              style={styles.centerButton}
              onPress={centerOnUser}
            >
              <MaterialCommunityIcons
                name="crosshairs-gps"
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <View style={styles.eventListContainer}>
              <FlatList
                data={events}
                horizontal
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                renderItem={({ item }) => (
                  <EventCard
                    event={item}
                    onPress={() => onEventCardPress(item)}
                  />
                )}
              />
            </View>
          </>
        ) : (
          <View style={styles.eventListSection}>
            <EventList
              forProfile={true}
              fetchEventsFunction={handleEventListData}
            />
          </View>
        )}
      </View>
    );
  };

  const openNavigation = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const EventCard = ({
    event,
    onPress,
  }: {
    event: Event;
    onPress: () => void;
  }) => {
    const router = useRouter();
    const { t } = useTranslation();

    return (
      <TouchableOpacity style={styles.eventCard} onPress={onPress}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventName}>{event.eventName}</Text>
          <Text style={styles.eventType}>
            {event.sportType} • {t(`search_page.${event.eventType.toLowerCase()}`)}
          </Text>
          <Text style={styles.eventLocation}>
            📍 {event.locationResponse.city || t('search_page.unknown_location')}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => router.push(`/events/${event.id}`)}
            >
              <Text style={styles.buttonText2}>{t('search_page.details')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navigateButton}
              onPress={() => {
                const latitude = Number(
                  event.locationResponse.coordinates?.coordinates?.[1]
                );
                const longitude = Number(
                  event.locationResponse.coordinates?.coordinates?.[0]
                );
                if (!isNaN(latitude) && !isNaN(longitude)) {
                  openNavigation(latitude, longitude);
                }
              }}
            >
              <Text style={styles.buttonText}>{t('search_page.navigate')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const routes = [
    { key: "users", title: t('search_page.users'), testID: "Users" },
    { key: "events", title: t('search_page.events'), testID: "Events" },
  ];

  const scenes = {
    events: <EventsTab userLocation={userLocation} />,
    users: <UsersTab />,
    
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
          placeholder={t("search_page.search")}
          value={searchText}
          onChangeText={(text) => handleChangeText(text)}
          placeholderTextColor="#999"
          clearButtonMode="while-editing"
        />
         
        <View style={{}}>    
          {activeIndex === 1 && (
            <TouchableOpacity
              style={{
                marginLeft: 4,
                borderColor: filter
                  ? themeColors.primary
                  : themeColors.border.dark,
                borderRadius: 20,
                borderWidth: 1,
                padding: 4,
                backgroundColor: filter ? themeColors.primary : "white",
              }}
              onPress={() => setIsVisible(true)}
            >
              <MaterialCommunityIcons
                name="filter-variant"
                size={28}
                color={filter ? "white" : themeColors.border.dark}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          
        }}
      >
        <CustomTabMenu
          routes={routes}
          scenes={scenes}
          backgroundColor="#f5f5f5"
          setActiveIndex={setActiveIndex}
        />
        <FilterModal
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          setFilterState={setFilterState}
          handleFilterToggle={handleFilterToggle}
          filterState={filterState}
          handleCleanFilter={handleCleanFilters}
        />
      </View>
    </SafeAreaView>
  );
}
// four block, event name, sport type, location, skill level
// date range
// increaase range

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: vs(128),
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
    marginLeft: vs(10),
  },
  searchInput: {
    flex: 1,
    marginHorizontal: hs(15),
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
  initialSearchText: {
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
    top: Platform.OS === "ios" ? vs(400) : vs(420),
    right: 20,
    backgroundColor: themeColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 10,
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
    top: 20,
    right: 20,
    backgroundColor: themeColors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 20,
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  mapView: {
    padding: 1,
  },
  modalFilterButton: {
    backgroundColor: "white", // Important for shadows
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  filterButtonText: {
    textAlign: "center",
    color: themeColors.background.dark,
    fontSize: 16,
    fontWeight: "bold",
  },
  mapContainer: {
    marginTop: 10,
    marginBottom: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: themeColors.primary,
    marginBottom: 5,
    marginLeft: 5,
  },
});
