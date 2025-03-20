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
import { Platform } from "react-native";
import { ActionSheetIOS } from "react-native";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
      const response = await updateProfile(updatedData, user.id);
      await updateUserToStore(user.id);
      router.replace("/(tabs)/profile");
    } catch (error: any) {
     // console.error("Error occurred while updating profile:", error);
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
            <Text style={styles.cancelButton}>{t('edit_profile_page.cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('edit_profile_page.edit_profile')}</Text>
          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <Text style={styles.doneButton}>{t('edit_profile_page.done')}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Image Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity>
            <Image
              style={styles.profileImage}
              source={{ uri: "https://via.placeholder.com/100" }}
            />
            <Text style={styles.changePhotoText}>{t('edit_profile_page.change_profile_photo')}</Text>
          </TouchableOpacity>
        </View>

        {/* Public Information Section */}
        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>{t('edit_profile_page.first_name')}</Text>
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
            <Text style={styles.label}>{t('edit_profile_page.last_name')}</Text>
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

          <TouchableOpacity style={styles.skillButton}
            onPress={() => router.push("/editProfile/sportsSkills")}

          >

            <Text style={styles.skillButtonText}>{t('edit_profile_page.sports_and_skills')}</Text>
          </TouchableOpacity>
        </View>

        {/* Private Information Section */}
        <View style={styles.privateInfoSection}>
          <Text style={styles.privateInfoTitle}>{t('edit_profile_page.private_information')}</Text>

          <View style={styles.inputRow}>
            <Text style={styles.label}>{t('edit_profile_page.email')}</Text>
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
            <Text style={styles.label}>{t('edit_profile_page.phone')}</Text>
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
          <Text style={styles.label}>{t('edit_profile_page.gender')}</Text>
          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
             Platform.OS === "ios" ? (
          <TouchableOpacity
          style={styles.iosPickerButton}
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: ["Cancel", "Male", "Female", "Other"],
                cancelButtonIndex: 0,
              },
              (buttonIndex) => {
                if (buttonIndex === 1) onChange("Male");
                else if (buttonIndex === 2) onChange("Female");
                else if (buttonIndex === 3) onChange("Other");
              }
            );
          }}
        >
          <Text style={styles.iosPickerText}>{value || t('edit_profile_page.select_gender')}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={value}
            onValueChange={(itemValue) => onChange(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label={t('edit_profile_page.select_gender')} value="" />
            <Picker.Item label={t('edit_profile_page.male')} value="Male" />
            <Picker.Item label={t('edit_profile_page.female')} value="Female" />
            <Picker.Item label={t('edit_profile_page.other')} value="Other" />
          </Picker>
        </View>
          )
        )}
      />
       </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>{t('edit_profile_page.date_of_birth')}</Text>
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
  iosPickerButton: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D1D1",
    paddingVertical: 12,
    justifyContent: "center",
  },
  iosPickerText: {
    fontSize: 16,
    color: "#000",
  },  
});

export default EditProfilePage;

