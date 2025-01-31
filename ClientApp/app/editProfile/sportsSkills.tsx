import React, { useState } from "react";
import RegisterProfileSports from "@/components/RegisterProfile/RegisterProfileSports";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUpdateUserToStore } from "@/state/user/actions";
import { useSelector } from "react-redux";
import { selectUser } from "@/state/user/userSlice";
import { API_ENDPOINTS } from "@/utils/api/endpoints";
import { getAxiosInstance } from "@/services/axiosInstance";
import ConfirmButton from "@/components/Helper Components/ConfirmButton"; 
import themeColors from "@/utils/constants/colors";
import { vs, hs } from "@/utils/helpers/uiScaler";
import Icon from "react-native-vector-icons/Ionicons";  

const SportsSkillsPage: React.FC = () => {
  const navigation = useNavigation();
  const updateUserToStore = useUpdateUserToStore(); 
  const user = useSelector(selectUser); 
  const [selectedSports, setSelectedSports] = useState(user.profile.sportsOfPreference || []);

  const updateSportsOfPreferenceAPI = async (sports: { name: string; ranking: string }[]) => {
    const axiosInstance = getAxiosInstance();
    try {
      const response = await axiosInstance.patch(API_ENDPOINTS.UPDATE_PROFILE.replace("{userId}", user.id), {
        sportsOfPreference: sports,
      });
      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating sports:", error);
      throw error;
    }
  };

  const handleSaveChanges = async () => {
    try {
      await updateSportsOfPreferenceAPI(selectedSports); 
      await updateUserToStore(user.id); 
      navigation.goBack(); 
    } catch (error) {
      Alert.alert("Error", "Failed to update sports.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color={themeColors.text.dark} />  
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>Add your Favourite Sports</Text>    
      </View>

      {/* Sports Selection */}
      <View style={styles.sportsContainer}>
        <RegisterProfileSports onChange={setSelectedSports} />
      </View>

      {/* Save Changes Button */}
      <View style={styles.buttonContainer}>
        <ConfirmButton
          text="Save Changes"
          onPress={handleSaveChanges} 
          icon={null}
          iconPlacement={null}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background.light,
    paddingHorizontal: hs(16),
    paddingVertical: vs(20),
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: vs(12),
  },
  backButton: {
    padding: hs(8),  
  },
  headerTitle: {
    fontSize: vs(18),
    fontWeight: "bold",
  },
  cancelText: {
    fontSize: vs(16),
    color: "blue",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: vs(12),
  },
  sectionTitle: {
    fontSize: vs(24),
    fontWeight: "bold",
    textAlign: "center",
    color: themeColors.text.dark,
  },
  sectionSubtitle: {
    fontSize: vs(14),
    textAlign: "center",
    color: themeColors.text.grey,
    marginTop: vs(4),
  },
  sportsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  buttonContainer: {
    marginTop: vs(20),
  },
});

export default SportsSkillsPage;













