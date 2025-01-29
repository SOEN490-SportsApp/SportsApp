import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { updateUserSports } from "@/state/user/userSlice"; 

const { width } = Dimensions.get("window");

const sportsData = [
  { id: "1", name: "Soccer", icon: "⚽" },
  { id: "2", name: "Basketball", icon: "🏀" },
  { id: "3", name: "Football", icon: "🏈" },
  { id: "4", name: "Table Tennis", icon: "🏓" },
  { id: "5", name: "Chess", icon: "♟️" },
  { id: "6", name: "Cricket", icon: "🏏" },
  { id: "7", name: "Badminton", icon: "🏸" },
  { id: "8", name: "Boxing", icon: "🥊" },
  { id: "9", name: "Tennis", icon: "🎾" },
  { id: "10", name: "Baseball", icon: "⚾" },
  { id: "11", name: "Gaming", icon: "🎮" },
  { id: "12", name: "Golf", icon: "🏌️" },
];

const skillLevels = ["Beginner", "Intermediate", "Expert"];

const SportsSkillsPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedSports = useSelector((state: any) => state.user.profile.sportsOfPreference);

  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const selectSport = (sportName: string) => {
    setSelectedSport(sportName);
    setModalVisible(true);
    setSelectedSkill(null); 
    setIsConfirmed(false);
  };

  const handleConfirm = () => {
    if (selectedSport && selectedSkill) {
      dispatch(updateUserSports({ name: selectedSport, ranking: selectedSkill })); 
      setIsConfirmed(true);
      setTimeout(() => {
        setModalVisible(false);
      }, 300);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Add your Favorite Sports</Text>

      {/* Sports Grid */}
      <FlatList
        data={sportsData}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.sportItem,
              selectedSports.some((sport: any) => sport.name === item.name) ? styles.selectedSport : {},
            ]}
            onPress={() => selectSport(item.name)}
          >
            <Text style={styles.sportIcon}>{item.icon}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      {/* Skill Level Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Skill Level</Text>
            <Text style={styles.modalSubtitle}>{selectedSport}</Text>

            {/* Skill Level Selection (List of Buttons) */}
            <View style={styles.skillSelection}>
              {skillLevels.map((level) => (
                <TouchableOpacity key={level} onPress={() => setSelectedSkill(level)}>
                  <Text style={[styles.skillText, selectedSkill === level && styles.selectedSkillText]}>
                    {level}
                  </Text>
                  {selectedSkill === level && <View style={styles.underline} />}
                </TouchableOpacity>
              ))}
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              onPress={handleConfirm}
              style={[styles.confirmButton, isConfirmed && styles.confirmedButton]}
              disabled={!selectedSkill} 
            >
              <Text style={[styles.confirmButtonText, isConfirmed && styles.confirmedButtonText]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  cancelText: {
    fontSize: 16,
    color: "#007AFF",
    paddingRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  gridContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  sportItem: {
    width: width / 4.5,
    height: width / 4.5,
    alignItems: "center",
    justifyContent: "center",
    margin: 12,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedSport: {
    backgroundColor: "#00FF00", // ✅ Green Background (Selected)
    borderColor: "#00FF00",
  },
  sportIcon: {
    fontSize: 40,
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: "#008000",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: 320,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 15,
    color: "#333",
  },
  skillSelection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  skillText: {
    fontSize: 16,
    color: "#777",
    marginVertical: 5,
  },
  selectedSkillText: {
    color: "#000",
    fontWeight: "bold",
  },
  underline: {
    width: "100%",
    height: 2,
    backgroundColor: "#008000",
    marginTop: -2,
  },
  confirmButton: {
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#008000",
    backgroundColor: "transparent",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },
  confirmButtonText: {
    color: "#008000",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmedButton: {
    backgroundColor: "#008000",
  },
  confirmedButtonText: {
    color: "#fff",
  },
});

export default SportsSkillsPage;





