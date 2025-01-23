import React from "react";
import { useRouter } from "expo-router";
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { updateProfile } from "@/utils/api/profileApiClient";
import { useUpdateUserToStore } from "@/state/user/actions";
import { Picker } from "@react-native-picker/picker";

interface EditProfilePageFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  dateOfBirth: string;
}

const EditProfilePage: React.FC = () => {
  const router = useRouter();
  const updateUserToStore = useUpdateUserToStore();
  const user = useSelector((state: { user: any }) => state.user);

  const { control, handleSubmit } = useForm<EditProfilePageFormData>({
    defaultValues: {
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      phoneNumber: user.profile.phoneNumber,
      email: user.email,
      gender: user.profile.gender,
      dateOfBirth: user.profile.dateOfBirth,
    },
  });

  const onSubmit = async (data: EditProfilePageFormData) => {
    try {
      const updatedData = {
        ...data,
        sportsOfPreference: user.profile.sportsOfPreference,
      };
      console.log("Updated Data:", updatedData);
      const response = await updateProfile(updatedData, user.id);
      console.log("Profile updated successfully:", response);
      await updateUserToStore(user.id);
      router.replace("/(tabs)/profile");
    } catch (error: any) {
      console.error("Error occurred while updating profile:", error);
      const errorMessage =
        error?.message || "An error occurred while updating your profile.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <Text style={styles.doneButton}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Image Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity>
            <Image
              style={styles.profileImage}
              source={{ uri: "https://via.placeholder.com/100" }}
            />
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Public Information Section */}
        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>First Name</Text>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="First Name"
                />
              )}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Last Name</Text>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Last Name"
                />
              )}
            />
          </View>

          <TouchableOpacity style={styles.skillButton}>
            <Text style={styles.skillButtonText}>Sports and Skills</Text>
          </TouchableOpacity>
        </View>

        {/* Private Information Section */}
        <View style={styles.privateInfoSection}>
          <Text style={styles.privateInfoTitle}>Private Information</Text>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Email"
                />
              )}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Phone</Text>
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Phone Number"
                />
              )}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Gender</Text>
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>
              )}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Date of Birth</Text>
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="YYYY-MM-DD"
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  cancelButton: {
    color: "#000000",
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  doneButton: {
    color: "#007AFF",
    fontSize: 16,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#D9D9D9",
  },
  changePhotoText: {
    color: "#007AFF",
    marginTop: 8,
  },
  inputSection: {
    marginVertical: 16,
  },
  privateInfoSection: {
    marginVertical: 16,
  },
  privateInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: "#4A4A4A",
  },
  input: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D1D1",
    fontSize: 16,
    paddingVertical: 4,
  },
  skillButton: {
    alignSelf: "center",
    marginTop: 16,
  },
  skillButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  pickerContainer: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D1D1",
  },
  picker: {
    height: 50,
  },
});

export default EditProfilePage;

