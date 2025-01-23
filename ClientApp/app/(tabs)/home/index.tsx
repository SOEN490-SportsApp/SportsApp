import { useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import TopBar from "@/components/Home Page/TopBar";
import Feed from "@/components/Home Page/Feed";

const HomePage = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* TopBar */}
      <TopBar />

      {/* Feed */}
      <View style={styles.content}>
        <Feed />
      </View>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
