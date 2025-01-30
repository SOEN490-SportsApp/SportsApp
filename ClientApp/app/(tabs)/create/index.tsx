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
  TouchableWithoutFeedback,
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
import GooglePlacesInput from "@/components/Helper Components/GooglePlacesInput";

const Create = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EventFormData>({
    defaultValues: {
      eventName: "",
      eventType: "public",
      sportType: "",
      maxParticipants: "1",
      description: "",
    },
  });
  const router = useRouter();
  const [isSportTypeModalVisible, setSportTypeModalVisible] = useState(false);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [cutOffDate, setCutOffDate] = useState<Date | null>(null);
  const [cutOffTime, setCutOffTime] = useState<Date | null>(null);
  const [showCutOffDatePicker, setShowCutOffDatePicker] = useState(false);
  const [showCutOffTimePicker, setShowCutOffTimePicker] = useState(false);
  const [requiredSkillLevel, setRequiredSkillLevel] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showLocationPage, setShowLocationPage] = useState(false);
  const [location, setLocation] = useState(null);
  const [buttonPressed, setButtonPressed] = useState(false);

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
    if (!location) {
      Alert.alert("Error", "Please select a location.");
      return;
    }

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

      const combinedStartDateTime = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        startTime.getHours(),
        startTime.getMinutes()
      );

      if (combinedCutOffDateTime >= combinedStartDateTime) {
        Alert.alert(
          "Error",
          "Cutoff time must be before the event start time."
        );
        return;
      }
      const eventRequest = {
        eventName: data.eventName,
        eventType: data.eventType,
        sportType: data.sportType,
        location,
        date: eventDate ? eventDate.toISOString().split("T")[0] : "",
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        duration: "",
        maxParticipants: parseInt(data.maxParticipants, 10),
        participants: [],
        createdBy: user.id,
        teams: [],
        cutOffTime: combinedCutOffDateTime.toISOString().slice(0, 19),
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
      Alert.alert("Success", "Event created successfully!");
      router.replace("/(tabs)/home");
    } catch (error: any) {
      if (error.message === "Network Error") {
        Alert.alert("Error", "Network Error");
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  const renderSportTypeModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isSportTypeModalVisible}
      onRequestClose={() => setSportTypeModalVisible(false)}
      accessibilityLabel="Sport Selection Modal"
    >
      <TouchableWithoutFeedback
        testID="modal-overlay"
        onPress={() => setSportTypeModalVisible(false)}
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
      </TouchableWithoutFeedback>
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

  if (showLocationPage) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Select Location
        </Text>
        <GooglePlacesInput setLocation={setLocation} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowLocationPage(false)}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <ConfirmButton
          text="Create Event"
          onPress={handleSubmit(onSubmit)}
          icon={undefined}
          iconPlacement={null}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
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
                  value={value || ""}
                />
              )}
            />

            {errors.eventName && (
              <Text style={styles.errorText}>{errors.eventName.message}</Text>
            )}

            <Text style={styles.label}>Event Type</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                testID="event-type-public"
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
                testID="event-type-private"
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
                testID="datetimepicker-time-start"
                value={startTime || new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowStartTimePicker(false);
                  if (selectedTime) {
                    setStartTime(selectedTime);
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
                testID="datetimepicker-time-end"
                value={endTime || new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowEndTimePicker(false);
                  if (selectedTime) {
                    setEndTime(selectedTime);
                  }
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
                  value={value || ""}
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
                testID="datetimepicker-cutoff-date"
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
              <Text testID="cut-off-time-text">
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
                testID="datetimepicker-cutoff-time"
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
                  testID={`skill-level-${level}`}
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
                  value={value || ""}
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
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setShowLocationPage(true)}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
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
    backgroundColor: themeColors.background.light,
  },
  nextButton: {
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: themeColors.primary,
    backgroundColor: themeColors.background.lightGrey,
  },
  nextButtonText: {
    color: themeColors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    alignSelf: "center",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: themeColors.primary,
    backgroundColor: themeColors.background.lightGrey,
  },
  backButtonText: {
    color: themeColors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Create;
