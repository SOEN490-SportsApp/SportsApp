import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, Alert, Animated } from "react-native";
import TopBar from "@/components/Home Page/TopBar";
import HomePageFeed from "@/components/Home Page/HomePageFeed";
import MyCalendar from "@/components/Calendar/MyCalendar";
import { getAllEvents } from "@/services/eventService";
import { Event } from "@/types/event";
import { useSelector } from "react-redux";

const HomePage = () => {
  const [isCalendarVisible, setIsCalenarVisible] = useState(false)
  const user = useSelector((state: { user: any }) => state.user);

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* TopBar */}
      <TopBar onPress={() => setIsCalenarVisible(!isCalendarVisible)} isCalendarVisible={isCalendarVisible}/>

      {/* Feed */}
      <View style={styles.content}>
        <MyCalendar userId={user.id as string} isVisible={isCalendarVisible}/>
        <HomePageFeed />
      </View>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
