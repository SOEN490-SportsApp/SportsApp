import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  FlatList,
  StatusBar,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller, useWatch, set } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import ConfirmButton from "@/components/Helper Components/ConfirmButton";
import { IconPlacement } from "@/utils/constants/enums";
import themeColors from "@/utils/constants/colors";
import { hs, vs, mhs } from "@/utils/helpers/uiScaler";
import { createEvent } from "@/services/eventService";
import { useSelector } from "react-redux";
import supportedSports from "@/utils/constants/supportedSports";

const provinces = [
  { id: 1, name: "Alberta" },
  { id: 2, name: "British Columbia" },
  { id: 3, name: "Manitoba" },
  { id: 4, name: "New Brunswick" },
  { id: 5, name: "Newfoundland and Labrador" },
  { id: 6, name: "Nova Scotia" },
  { id: 7, name: "Ontario" },
  { id: 8, name: "Prince Edward Island" },
  { id: 9, name: "Quebec" },
  { id: 10, name: "Saskatchewan" },
  { id: 11, name: "Northwest Territories" },
  { id: 12, name: "Nunavut" },
  { id: 13, name: "Yukon" },
];

const Create = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EventFormData>({
    defaultValues: {
      eventType: "public",
      sportType: "",
      province: "",
    },
  });
  const router = useRouter();
  const [isSportTypeModalVisible, setSportTypeModalVisible] = useState(false);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isProvinceModalVisible, setProvinceModalVisible] = useState(false);
  const [cutOffDate, setCutOffDate] = useState<Date | null>(null);
  const [cutOffTime, setCutOffTime] = useState<Date | null>(null);
  const [showCutOffDatePicker, setShowCutOffDatePicker] = useState(false);
  const [showCutOffTimePicker, setShowCutOffTimePicker] = useState(false);
  const [requiredSkillLevel, setRequiredSkillLevel] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  const user = useSelector((state: { user: any }) => state.user);

  interface EventFormData {
    eventName: string;
    eventType: string;
    sportType: string;
    locationName: string;
    city: string;
    province: string;
    country: string;
    cutOffTime: string;
    description: string;
    maxParticipants: string;
    requiredSkillLevel: string[];
  }

  const onSubmit = async (data: EventFormData) => {
    try {
      if (!cutOffDate || !cutOffTime || !eventDate || !startTime || !endTime) {
        Alert.alert("Error", "Please select all date and time fields");
        return;
      }

      const formattedStartTime = startTime
        .toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        })
        .replace(/\s?(AM|PM)$/, "");

      const formattedEndTime = endTime
        .toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        })
        .replace(/\s?(AM|PM)$/, "");

      if (startTime >= endTime) {
        Alert.alert("Error", "End time must be after start time.");
        return;
      }

      const combinedCutOffDateTime = new Date(
        cutOffDate.getFullYear(),
        cutOffDate.getMonth(),
        cutOffDate.getDate(),
        cutOffTime.getHours(),
        cutOffTime.getMinutes()
      );

      const eventRequest = {
        eventName: data.eventName,
        eventType: data.eventType,
        sportType: data.sportType,
        location: {
          name: data.locationName,
          streetNumber: "",
          streetName: "",
          city: data.city,
          province: data.province,
          country: "Canada",
          postalCode: "",
          addressLine2: "",
          phoneNumber: "",
          latitude: "",
          longitude: "",
        },
        date: eventDate ? eventDate.toISOString().split("T")[0] : "",
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        duration: "",
        maxParticipants: parseInt(data.maxParticipants, 10),
        participants: [],
        createdBy: user.id,
        teams: [],
        cutOffTime: combinedCutOffDateTime.toISOString(),
        description: data.description,
        isPrivate: data.eventType === "private",
        whiteListedUsers: [],
        requiredSkillLevel: requiredSkillLevel.map((level) =>
          level.toUpperCase()
        ),
      };

      await createEvent(eventRequest);

      reset({
        eventName: "",
        eventType: "public",
        sportType: "",
        locationName: "",
        city: "",
        province: "",
        country: "",
        cutOffTime: "",
        description: "",
        maxParticipants: "",
      });
      setEventDate(null);
      setCutOffDate(null);
      setCutOffTime(null);
      setRequiredSkillLevel([]);
      setSuccessModalVisible(true);
      setStartTime(null);
      setEndTime(null);
    } catch (error) {
      Alert.alert("Error", "Error occurred while creating the event");
      throw error;
    }
  };

  const renderSportTypeModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isSportTypeModalVisible}
      onRequestClose={() => setSportTypeModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <FlatList
            data={supportedSports}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.flatListContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setValue("sportType", item.name, { shouldValidate: true });
                  setSportTypeModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            style={styles.scrollableList}
          />
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity
              onPress={() => setSportTypeModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderProvinceModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isProvinceModalVisible}
      onRequestClose={() => setProvinceModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <FlatList
            data={provinces}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.flatListContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setValue("province", item.name, { shouldValidate: true }); // Trigger validation
                  setProvinceModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            style={styles.scrollableList}
          />
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity
              onPress={() => setProvinceModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const watch = useWatch({ control });

  const toggleSkillLevel = (level: string) => {
    const updatedSkillLevels = requiredSkillLevel.includes(level)
      ? requiredSkillLevel.filter((item) => item !== level)
      : [...requiredSkillLevel, level];

    setRequiredSkillLevel(updatedSkillLevels);
    setValue("requiredSkillLevel", updatedSkillLevels);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust for iOS and Android
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust offset for iOS
      >
        <View
          style={[
            styles.container,
            { paddingTop: StatusBar.currentHeight || vs(24) },
          ]}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.label}>Event Name</Text>
            <Controller
              control={control}
              name="eventName"
              rules={{ required: "Event Name is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter Event Name"
                  placeholderTextColor={themeColors.text.placeholder}
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.eventName && (
              <Text style={styles.errorText}>{errors.eventName.message}</Text>
            )}

            <Text style={styles.label}>Event Type</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                onPress={() => setValue("eventType", "public")}
                style={[
                  styles.radioButton,
                  watch.eventType === "public"
                    ? styles.radioButtonSelected
                    : null,
                ]}
              >
                <Text
                  style={[
                    styles.radioText,
                    watch.eventType === "public" && styles.selectedText,
                  ]}
                >
                  Public
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setValue("eventType", "private")}
                style={[
                  styles.radioButton,
                  watch.eventType === "private"
                    ? styles.radioButtonSelected
                    : null,
                ]}
              >
                <Text
                  style={[
                    styles.radioText,
                    watch.eventType === "private" && styles.selectedText,
                  ]}
                >
                  Private
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Sport Type</Text>
            <Controller
              control={control}
              name="sportType"
              rules={{ required: "Sport Type is required" }}
              render={({ field: { value } }) => (
                <TouchableOpacity
                  style={[styles.input, errors.sportType && styles.inputError]}
                  onPress={() => setSportTypeModalVisible(true)}
                >
                  <Text>{value || "Select a Sport"}</Text>
                </TouchableOpacity>
              )}
            />
            {renderSportTypeModal()}
            {errors.sportType && (
              <Text style={styles.errorText}>{errors.sportType.message}</Text>
            )}

            <Text style={styles.label}>Location</Text>
            <Controller
              control={control}
              name="locationName"
              rules={{ required: "Location Name is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Location Name"
                  placeholderTextColor={themeColors.text.placeholder}
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.locationName &&
              typeof errors.locationName.message === "string" && (
                <Text style={styles.errorText}>
                  {errors.locationName.message}
                </Text>
              )}

            <Controller
              control={control}
              name="city"
              rules={{ required: "City is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="City"
                  placeholderTextColor={themeColors.text.placeholder}
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.city && typeof errors.city.message === "string" && (
              <Text style={styles.errorText}>{errors.city.message}</Text>
            )}

            <Controller
              control={control}
              name="province"
              rules={{ required: "Province is required" }}
              render={({ field: { value } }) => (
                <TouchableOpacity
                  style={[styles.input, errors.province && styles.inputError]}
                  onPress={() => setProvinceModalVisible(true)}
                >
                  <Text>{value || "Select a Province"}</Text>
                </TouchableOpacity>
              )}
            />
            {renderProvinceModal()}
            {errors.province && (
              <Text style={styles.errorText}>{errors.province.message}</Text>
            )}

            <Text style={styles.label}>Event Date and Time</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.input}
            >
              <Text>
                {eventDate ? eventDate.toDateString() : "Select event date"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={eventDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setEventDate(selectedDate);
                }}
              />
            )}

            <TouchableOpacity
              onPress={() => setShowStartTimePicker(true)}
              style={styles.input}
            >
              <Text>
                {startTime
                  ? startTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Select start time"}
              </Text>
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                value={startTime || new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowStartTimePicker(false);
                  if (selectedTime) {
                    const formattedTime = selectedTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    if (!timeFormatRegex.test(formattedTime)) {
                      Alert.alert("Error", "Time must be in HH:MM format.");
                      return;
                    }
                    setStartTime(selectedTime); // Valid time is set
                  }
                }}
              />
            )}

            <TouchableOpacity
              onPress={() => setShowEndTimePicker(true)}
              style={styles.input}
            >
              <Text>
                {endTime
                  ? endTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Select end time"}
              </Text>
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime || new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowEndTimePicker(false);
                  if (selectedTime) setEndTime(selectedTime);
                }}
              />
            )}

            <Text style={styles.label}>Maximum Number of Participants</Text>
            <Controller
              control={control}
              name="maxParticipants"
              rules={{
                required: "Maximum number of participants is required",
                validate: (value) => {
                  const number = parseInt(value, 10);
                  return (
                    (!isNaN(number) && number > 0) ||
                    "Must be a positive integer greater than 0"
                  );
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter maximum participants"
                  placeholderTextColor={themeColors.text.placeholder}
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    if (/^\d*$/.test(text)) {
                      onChange(text);
                    }
                  }}
                  value={value}
                  keyboardType="numeric"
                />
              )}
            />
            {errors.maxParticipants && (
              <Text style={styles.errorText}>
                {errors.maxParticipants.message}
              </Text>
            )}

            <Text style={styles.label}>Cut Off Time</Text>
            <TouchableOpacity
              onPress={() => setShowCutOffDatePicker(true)}
              style={styles.input}
            >
              <Text>
                {cutOffDate ? cutOffDate.toDateString() : "Select cut off date"}
              </Text>
            </TouchableOpacity>
            {showCutOffDatePicker && (
              <DateTimePicker
                value={cutOffDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowCutOffDatePicker(false);
                  if (selectedDate) setCutOffDate(selectedDate);
                }}
              />
            )}

            <TouchableOpacity
              onPress={() => setShowCutOffTimePicker(true)}
              style={styles.input}
            >
              <Text>
                {cutOffTime
                  ? cutOffTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Select cut off time (in hours)"}
              </Text>
            </TouchableOpacity>
            {showCutOffTimePicker && (
              <DateTimePicker
                value={cutOffTime || new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowCutOffTimePicker(false);
                  if (selectedTime) setCutOffTime(selectedTime);
                }}
              />
            )}

            <Text style={styles.label}>Required Skill Level</Text>
            <View style={styles.skillLevelGroup}>
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.skillLevelOption,
                    requiredSkillLevel.includes(level) &&
                      styles.skillLevelSelected,
                  ]}
                  onPress={() => toggleSkillLevel(level)}
                >
                  <Text
                    style={[
                      styles.skillLevelText,
                      requiredSkillLevel.includes(level) &&
                        styles.skillLevelTextSelected,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Description</Text>
            <Controller
              control={control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter Description"
                  placeholderTextColor={themeColors.text.placeholder}
                  style={[styles.input, styles.textArea]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={4}
                />
              )}
            />
            {errors.description &&
              typeof errors.description.message === "string" && (
                <Text style={styles.errorText}>
                  {errors.description.message}
                </Text>
              )}
          </ScrollView>
          <View style={styles.footer}>
            <ConfirmButton
              text="CREATE EVENT"
              onPress={handleSubmit(onSubmit)}
              icon={null}
              iconPlacement={IconPlacement.left}
            />
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={isSuccessModalVisible}
            onRequestClose={() => setSuccessModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.successModal}>
                <Text style={styles.successText}>
                  🎉 Event Created Successfully! 🎉
                </Text>
                <TouchableOpacity
                  style={styles.successButton}
                  onPress={() => {
                    setSuccessModalVisible(false);
                    router.replace("/(tabs)/home");
                  }}
                >
                  <Text style={styles.successButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background.light,
  },
  scrollContent: {
    padding: hs(16),
  },
  label: {
    fontSize: mhs(16),
    fontWeight: "600",
    color: themeColors.text.dark,
    marginBottom: vs(8),
  },
  input: {
    backgroundColor: themeColors.background.lightGrey,
    borderRadius: mhs(8),
    padding: hs(12),
    fontSize: mhs(16),
    color: themeColors.text.dark,
    marginBottom: vs(4),
  },
  textArea: {
    height: vs(100),
    textAlignVertical: "top",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "center",
    gap: hs(30),
    marginBottom: vs(16),
  },
  radioButton: {
    paddingVertical: vs(8),
    paddingHorizontal: hs(20),
    borderRadius: mhs(25),
    borderWidth: 1,
    borderColor: themeColors.border.light,
    backgroundColor: themeColors.background.lightGrey,
  },
  radioButtonSelected: {
    backgroundColor: themeColors.primary,
    borderColor: themeColors.primary,
  },
  radioText: {
    fontSize: mhs(14),
    color: themeColors.text.dark,
    textAlign: "center",
  },
  selectedText: {
    color: themeColors.text.light,
    fontWeight: "bold",
  },
  footer: {
    padding: hs(16),
    backgroundColor: themeColors.background.lightGrey,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: themeColors.background.light,
    padding: hs(16),
    borderRadius: mhs(8),
    alignItems: "center",
  },
  flatListContainer: {
    alignItems: "center",
  },
  scrollableList: {
    maxHeight: vs(200),
    width: "100%",
  },
  modalItem: {
    padding: hs(12),
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border.light,
    width: "90%",
    alignItems: "center",
  },
  modalItemText: {
    fontSize: mhs(16),
    color: themeColors.text.dark,
  },
  closeButtonContainer: {
    marginTop: vs(16),
  },
  modalCloseButton: {
    paddingVertical: vs(8),
    paddingHorizontal: hs(20),
    borderRadius: mhs(25),
    backgroundColor: themeColors.primary,
  },
  modalCloseButtonText: {
    color: themeColors.text.light,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    color: themeColors.text.error,
    fontSize: mhs(12),
    marginTop: vs(4),
    marginBottom: vs(8),
  },
  successModal: {
    backgroundColor: "white",
    padding: hs(24),
    borderRadius: mhs(12),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successText: {
    fontSize: mhs(18),
    fontWeight: "bold",
    color: themeColors.primary,
    textAlign: "center",
  },
  successButton: {
    marginTop: vs(16),
    paddingVertical: vs(10),
    paddingHorizontal: hs(20),
    backgroundColor: themeColors.primary,
    borderRadius: mhs(8),
  },
  successButtonText: {
    color: themeColors.text.light,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: mhs(16),
  },
  inputError: {
    borderWidth: 1,
    borderColor: themeColors.text.error,
  },
  skillLevelGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: vs(16),
  },
  skillLevelOption: {
    padding: hs(12),
    borderWidth: 1,
    borderColor: themeColors.border.light,
    borderRadius: mhs(8),
    backgroundColor: themeColors.background.lightGrey,
  },
  skillLevelSelected: {
    backgroundColor: themeColors.primary,
    borderColor: themeColors.primary,
  },
  skillLevelText: {
    fontSize: mhs(14),
    color: themeColors.text.dark,
  },
  skillLevelTextSelected: {
    color: themeColors.text.light,
    fontWeight: "bold",
  },
  safeArea: {
    flex: 1,
    backgroundColor: themeColors.background.light, // Use your background color
  },
});

export default Create;
