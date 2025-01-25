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


  const EventsTab = () => (
    <View>
      <CenterMessage message={"Events incoming... "} />
    </View>
  );

  const routes = [
    { key: "users", title: "Users", testID: "Users" },
    { key: "events", title: "Events", testID: "Events" },
  ];

  const scenes = {
    users: <UsersTab />,
    events: <EventsTab />,
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Animated.View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="arrow-left"
              testID="backArrow"
              size={33}
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
              size={25}
              color="#aaa"
            />
            </View>
          </TouchableOpacity>
        )}
      </Animated.View>
      <View style={{ flex: 1 }}>
        <CustomTabMenu routes={routes} scenes={scenes} />
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
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    color: "000",
  },
  iconCircle: {
    width: vs(50),
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
  }
});
