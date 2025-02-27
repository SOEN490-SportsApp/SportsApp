import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "../skeleton";

const SkeletonEventCard = () => {
  return (
    <View style={styles.card}>
      {/* Image Placeholder to be updated once the card has an image*/}
      {/* <Skeleton width="100%" height={120} borderRadius={10} /> */}

      {/* Title Placeholder */}
      <Skeleton width="60%" height={20} style={styles.title} />

      {/* Distance and Date */}
      <View style={styles.row}>
        <Skeleton width="30%" height={15} />
        <Skeleton width="30%" height={15} />
      </View>

      {/* Location */}
      <Skeleton width="50%" height={15} style={styles.location} />

      {/* Description */}
      <Skeleton width="80%" height={12} style={styles.description} />
      <Skeleton width="70%" height={12} style={styles.description} />
      <Skeleton width="60%" height={12} style={styles.description} />

      {/* Tags */}
      <View style={styles.row}>
        <Skeleton width={60} height={20} borderRadius={10} />
        <Skeleton width={80} height={20} borderRadius={10} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "95%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginVertical: 10,
    alignSelf: "center",
  },
  title: {
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  location: {
    marginVertical: 5,
  },
  description: {
    marginVertical: 3,
  },
  joinButton: {
    marginTop: 15,
    alignSelf: "center",
  },
});

export default SkeletonEventCard;
