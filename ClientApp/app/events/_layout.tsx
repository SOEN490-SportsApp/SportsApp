import React, { useState } from "react";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Menu, Provider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import themeColors from "@/utils/constants/colors";

export default function EventDetailsLayout() {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleOptionPress = (option: string) => {
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
        console.log("Delete event selected");
        // Add delete event logic
        break;
      default:
        break;
    }
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
                <TouchableOpacity
                  onPress={openMenu}
                >
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={24}
                  />
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
