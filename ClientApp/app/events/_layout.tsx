import React, { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";
import { Menu, Provider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import themeColors from "@/utils/constants/colors";
import { deleteEvent } from "@/services/eventService";
import { useLocalSearchParams } from "expo-router";

export default function EventDetailsLayout() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleOptionPress = async (option: string) => {
    closeMenu();
    switch (option) {
      case "invite":
        console.log("Invite friend selected");
        // Add invite friend logic
        break;
      case "leave":
        console.log("Leave event selected");
        // Add leave event logic
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
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEvent(eventId);
              Alert.alert("Success", "Event has been deleted.");
              router.replace("/(tabs)/home");
              // Navigate or update UI accordingly
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
            <Menu
              style={{
                backgroundColor: themeColors.background.lightGrey,
                position: "absolute",
                top: 50,
                right: 10,
                left: "auto",
              }}
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity onPress={openMenu}>
                  <MaterialCommunityIcons name="dots-vertical" size={24} />
                </TouchableOpacity>
              }
            >
              <Menu.Item
                onPress={() => handleOptionPress("invite")}
                title="Invite Friend"
              />
              <Menu.Item
                onPress={() => handleOptionPress("leave")}
                title="Leave Event"
              />
              <Menu.Item
                onPress={() => handleOptionPress("delete")}
                title="Delete Event"
                titleStyle={{ color: "red" }}
              />
            </Menu>
          ),
        }}
      />
    </Provider>
  );
}
