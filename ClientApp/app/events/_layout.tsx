import React, { useState, useEffect } from "react";
import { Alert, Platform, TouchableOpacity, View } from "react-native";
import { router, Stack } from "expo-router";
import { Menu, Provider } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import themeColors from "@/utils/constants/colors";
import { deleteEvent, getEventDetails, leaveEvent } from "@/services/eventService";
import { useLocalSearchParams } from "expo-router";
import QR from "@/components/QR/QR";
import { mvs } from "@/utils/helpers/uiScaler";
import { useSelector } from "react-redux";
import { selectUser } from "@/state/user/userSlice";
import EditEventModal from "@/components/Event/EditEventModal";
import { useTranslation } from "react-i18next";
import { Event } from "@/types/event";
import { Participant } from "@/types/event";
import { createContext } from "react";

export const EventContext = createContext<{
  eventData: Event | null;
  setEventData: React.Dispatch<React.SetStateAction<Event | null>>;
} | null>(null);

export default function EventDetailsLayout() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [eventData, setEventData] = useState<Event | null>(null);
  const { t } = useTranslation();
  const user = useSelector(selectUser); 
  const userId = user.id; 

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!userId) return;
  
        const eventDetails = await getEventDetails(eventId);
  
        if (userId === eventDetails.createdBy) {
          setIsCreator(true);
        }
  
        const hasJoined = eventDetails.participants.some(
          (participant: { userId: string }) => participant.userId === userId
        );
        setIsParticipant(hasJoined);
      } catch (error) {
        console.error(t('event_details_layout.error_fetching_details'), error);
      }
    };
  
    fetchEventDetails();
  }, [eventId, userId]);  

  useEffect(() => {
 
  }, [eventData]);
  
  
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleOptionPress = async (option: string) => {
    closeMenu();
    switch (option) {
      case "invite":
        console.log("Invite friend selected");
        break;
      case "leave":
        handleLeaveEvent(); 
        break;
      case "edit":
        setEditModalVisible(true);
        break;
      case "delete":
        handleDeleteEvent(eventId);
        break;
      default:
        break;
    }
  };
  
  const handleLeaveEvent = async () => {
    if (!eventId || !user.id) {
      Alert.alert("Error", "Event ID or User ID is missing.");
      return;
    }
  
    Alert.alert("Confirm Leave", "Are you sure you want to leave this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          try {
            const updatedEvent = await getEventDetails(eventId);
            if (!updatedEvent) return;
  
            const filteredParticipants = updatedEvent.participants.filter(
              (p: Participant) => p.userId !== user.id
            );
            setEventData({
              ...updatedEvent,
              participants: filteredParticipants,
            });
  
            setIsParticipant(false); 
  
            await leaveEvent(eventId, user.id); 
  
            const refetched = await getEventDetails(eventId);
            setEventData(refetched); 
  
            Alert.alert("Success", "You have left the event.");
          } catch (error) {
            Alert.alert("Error", "Unable to leave event. Please try again.");
          }
        },
      },
    ]);
  };
  
  const handleDeleteEvent = async (eventId: string | undefined) => {
    if (!eventId) {
      Alert.alert("Error", "Event ID is missing.");
      return;
    }

    Alert.alert(
      t('event_details_layout.confirm_delete_1'),
      t('event_details_layout.confirm_delete_2'),
      [
        { text: t('event_details_layout.cancel'), style: "cancel" },
        {
          text: t('event_details_layout.delete'),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEvent(eventId);
              Alert.alert(t('event_details_layout.success_1'), t('event_details_layout.success_2'));
              router.replace("/(tabs)/home");
            } catch (error) {
              Alert.alert(t('event_details_layout.error'), t('event_details_layout.error_deleting_event'));
            }
          },
        },
      ]
    );
  };

  return (
    <EventContext.Provider value={{ eventData, setEventData }}>
    <Provider>
      <Stack
        screenOptions={{
          headerShown: true,
          title: "",
          headerRight: () => (
            <>
              <View style={{ marginRight: 8 }}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Ionicons name="qr-code-outline" size={mvs(24)} color="black" />
                </TouchableOpacity>
                <QR id={eventId} isVisible={modalVisible} setIsVisible={setModalVisible} isProfile={false} />
              </View>
              <Menu
            contentStyle={{
              backgroundColor: themeColors.background.lightGrey,
              borderRadius: 8,
              elevation: 3,
              top: Platform.OS === "ios" ? mvs(80) : mvs(35)
            }}
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
    <TouchableOpacity onPress={openMenu}>
      <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
    </TouchableOpacity>
  } 
>
  <Menu.Item onPress={() => handleOptionPress("invite")} title={t('event_details_layout.invite_friend')} titleStyle={{ color: "black" }} />
  {!isCreator && isParticipant && (
    <Menu.Item onPress={() => handleOptionPress("leave")} title={t('event_details_layout.leave_event')} titleStyle={{ color: "black" }} />
        )}
  {isCreator && (
    <React.Fragment>
      <Menu.Item onPress={() => handleOptionPress("edit")} title={t('event_details_layout.edit_event')} />
      <Menu.Item onPress={() => handleOptionPress("delete")} title={t('event_details_layout.delete_event')} titleStyle={{ color: "red" }} />
    </React.Fragment>
  )}
      </Menu>
          </>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <EditEventModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} eventId={eventId} />
    </Provider>
    </EventContext.Provider>
  );
}

