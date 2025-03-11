import React, { useState, useEffect } from "react";
import { Alert, Platform, TouchableOpacity, View } from "react-native";
import { router, Stack } from "expo-router";
import { Menu, Provider } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import themeColors from "@/utils/constants/colors";
import { deleteEvent, getEventDetails } from "@/services/eventService";
import { useLocalSearchParams } from "expo-router";
import QR from "@/components/QR/QR";
import { mvs } from "@/utils/helpers/uiScaler";
import { useSelector } from "react-redux";
import { selectUser } from "@/state/user/userSlice";
import EditEventModal from "@/components/Event/EditEventModal";

export default function EventDetailsLayout() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [eventData, setEventData] = useState(null);
  
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
        console.error("Error fetching event details:", error);
      }
    };
    
    fetchEventDetails();
  }, [eventId, userId]);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleOptionPress = async (option: string) => {
    closeMenu();
    switch (option) {
      case "invite":
        console.log("Invite friend selected");
        break;
      case "leave":
        console.log("Leave event selected");
        break;
      case "edit":
        console.log("Edit event selected");
        setEditModalVisible(true);
        break;
      case "delete":
        handleDeleteEvent(eventId);
        break;
      default:
        break;
    }
  };

  const handleDeleteEvent = async (eventId: string | undefined) => {
    if (!eventId) {
      Alert.alert("Error", "Event ID is missing.");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this event?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEvent(eventId);
              Alert.alert("Success", "Event has been deleted.");
              router.replace("/(tabs)/home");
            } catch (error) {
              Alert.alert("Error", "Unable to delete event. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
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
  <Menu.Item onPress={() => handleOptionPress("invite")} title="Invite Friend" titleStyle={{ color: "black" }} />
  {!isCreator && isParticipant && (
    <Menu.Item onPress={() => handleOptionPress("leave")} title="Leave Event" titleStyle={{ color: "black" }} />
        )}
  {isCreator && (
    <React.Fragment>
      <Menu.Item onPress={() => handleOptionPress("edit")} title="Edit Event" />
      <Menu.Item onPress={() => handleOptionPress("delete")} title="Delete Event" titleStyle={{ color: "red" }} />
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
  );
}

