import themeColors from "@/utils/constants/colors";
import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, TextInput, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getAxiosInstance } from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/utils/api/endpoints";
import { Controller, useForm, useWatch } from "react-hook-form";
import { hs, vs, mhs } from "@/utils/helpers/uiScaler";
import supportedSports from "@/utils/constants/supportedSports";
import GooglePlacesInput from "../Helper Components/GooglePlacesInput";
import CustomDateTimePicker from "../Helper Components/CustomDateTimePicker";
import { editEvent } from "@/services/eventService";

interface EditEventModalProps {
  visible: boolean;
  onClose: () => void;
  eventId: string;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ visible, onClose }) => {

  interface EventDetails {
    eventName: string;
    // eventType: string;
    sportType: string;
    // location: {
    //   name: string;
    //   streetNumber: string;
    //   streetName: string;
    //   city: string;
    //   province: string;
    //   country: string;
    //   postalCode: string;
    //   addressLine2: string;
    //   phoneNumber: string;
    //   coordinates: {
    //     x: number;
    //     y: number;
    //     coordinates: number[];
    //     type: string;
    //   }
    // };
    // date: string;
    // startTime: {
    //   hour: number;
    //   minute: number;
    //   second: number;
    //   nano: number;
    // };
    // endTime: {
    //   hour: number;
    //   minute: number;
    //   second: number;
    //   nano: number;
    // };
    // duration: string;
    maxParticipants: string;
    // participants: [
    //   {
    //     userId: string;
    //     attendStatus: string;
    //     joinedOn: string;
    //   }
    // ];
    // createdBy: string;
    // teams: [
    //   {
    //     teamId: string;
    //   }
    // ];
    // cutOffTime: string;
    description: string;
    // isPrivate: boolean;
    // whiteListedUsers: string[];
    // requiredSkillLevel: string[];
    // reactors: [
    //   {
    //     userId: string;
    //     reactionType: string;
    //   }
    // ];
  }

  useEffect(() => {
    if (visible) {
      fetchEventDetails();
    }
  }, [visible]);

  const [eventDetails, setEventDetails] = useState<any>(null);

  const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<EventDetails>({
      defaultValues: {
        eventName: "",
        // eventType: "",
        sportType: "",
        maxParticipants: "",
        description: "",
      },
    });

  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [loading, setLoading] = useState(true);
  const { setValue, watch } = useForm();
  const [requiredSkillLevel, setRequiredSkillLevel] = useState<string[]>([]);
  const [isSportTypeModalVisible, setSportTypeModalVisible] = useState(false);
  const [isLocationModalVisible, setLocationModalVisible] = useState(false);
  // const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [eventStartTime, setEventStartTime] = useState<Date | null>(null);
  const [eventEndTime, setEventEndTime] = useState<Date | null>(null);
  const [cutOffDate, setCutOffDate] = useState<Date | null>(null);
  const [cutOffTime, setCutOffTime] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedSkillLevels, setSelectedSkillLevels] = useState<string[]>([]);

  useEffect(() => {
    if (eventDetails?.eventType) {
      setValue("eventType", eventDetails.eventType);
    }
  }, [eventDetails, setValue]);

  useEffect(() => {
    if (eventDetails) {
      reset({
        sportType: eventDetails.sportType || "",
        maxParticipants: eventDetails.maxParticipants ? String(eventDetails.maxParticipants) : "",
      });
      // setSelectedLocation(`${eventDetails.locationResponse.name}, ${eventDetails.locationResponse.city}`);
    }
  }, [eventDetails, reset]);

  useEffect(() => {
    if (eventDetails?.date) {
      setEventDate(new Date(eventDetails.date));
    }
  }, [eventDetails]);

  useEffect(() => {
    if (eventDetails?.startTime) {
      setEventStartTime(new Date(`1970-01-01T${eventDetails.startTime}`)); // Convert to Date object
    }
    if (eventDetails?.endTime) {
      setEventEndTime(new Date(`1970-01-01T${eventDetails.endTime}`)); // Convert to Date object
    }
  }, [eventDetails]);

  useEffect(() => {
    if (eventDetails?.cutOffTime) {
      const cutOffDateTime = new Date(eventDetails.cutOffTime);
      setCutOffDate(new Date(cutOffDateTime.toDateString())); // Extract date
      setCutOffTime(new Date(`1970-01-01T${cutOffDateTime.toTimeString().slice(0, 8)}`)); // Extract time
    }
  }, [eventDetails]);

  useEffect(() => {
    if (eventDetails?.description) {
      setDescription(eventDetails.description);
    }
  }, [eventDetails]);

  useEffect(() => {
    if (eventDetails?.sportType) {
      setSelectedSport(eventDetails.sportType);
    }
  }, [eventDetails]);

  useEffect(() => {
    if (eventDetails?.requiredSkillLevel) {
      setSelectedSkillLevels(eventDetails.requiredSkillLevel);
    }
  }, [eventDetails]);

  const fetchEventDetails = async () => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(API_ENDPOINTS.GET_EVENT_BY_ID.replace("{id}", eventId));
      setEventDetails(response.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (formData: any) => {
    try {
      const updatedEventData: any = {};
  
      if (formData.eventName && formData.eventName !== eventDetails.eventName) {
        updatedEventData.eventName = formData.eventName;
      }
      
      if (selectedSport && selectedSport !== eventDetails.sportType) {
        updatedEventData.sportType = selectedSport;
      }
      
      if (formData.maxParticipants && formData.maxParticipants !== eventDetails.maxParticipants) {
        updatedEventData.maxParticipants = parseInt(formData.maxParticipants);
      }
      
      if (description && description !== eventDetails.description) {
        updatedEventData.description = description;
      }
  
      console.log("Payload Sent to API: ", JSON.stringify(updatedEventData, null, 2)); // For Debugging
  
      await editEvent(eventId, updatedEventData);
      Alert.alert("Success", "Event updated successfully!");
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to update event. Please try again.");
      if (error instanceof Error) {
        console.error("Error updating event:", (error as any).response?.data || error.message);
      } else {
        console.error("Error updating event:", error);
      }
    }
  };  

  const toggleSkillLevel = (level: string) => {
    let updatedLevels = [...selectedSkillLevels];

    if (updatedLevels.includes(level)) {
      updatedLevels = updatedLevels.filter((item) => item !== level);
    } else {
      updatedLevels.push(level);
    }

    setSelectedSkillLevels(updatedLevels);
    setValue("requiredSkillLevel", updatedLevels);
  };

  const renderSportTypeModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isSportTypeModalVisible}
      onRequestClose={() => setSportTypeModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalWrapper}>
          <Text style={styles.modalTitle}>Select a Sport</Text>
          <ScrollView style={styles.scrollableList}>
            {supportedSports.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                onPress={() => {
                  setSelectedSport(sport.name);
                  setValue("sportType", sport.name);
                  setSportTypeModalVisible(false);
                }}
                style={styles.modalItem}
              >
                <Text style={styles.modalItemText}>{sport.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={() => setSportTypeModalVisible(false)}
            style={styles.modalCloseButton}
          >
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Event</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#007BFF" />
          ) : (
            <ScrollView style={styles.scrollView}>
              {eventDetails ? (
                <>
                  {/* event name */}
                  <Text style={styles.eventDetail}><Text style={styles.bold}>Name:</Text></Text>
                  <Controller
                    control={control}
                    name="eventName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder={eventDetails.eventName}
                        placeholderTextColor="black"
                        style={styles.inputField}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value || ""}
                      />
                    )}
                  />
                  {/* event type */}
                  {/* <View style={styles.segmentedControl}>
                    {["public", "private"].map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setValue("eventType", type)}
                        style={[
                          styles.segmentButton,
                          watch("eventType") === type && styles.segmentButtonSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.segmentButtonText,
                            watch("eventType") === type && styles.segmentButtonTextSelected,
                          ]}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View> */}
                  {/* sport type */}
                  <View style={styles.sportTypeContainer}>
                    <Text style={styles.bold}>Sport Type:</Text>
                    <TouchableOpacity
                      style={styles.sportDropdown}
                      onPress={() => setSportTypeModalVisible(true)}
                    >
                      <Text>{selectedSport || "Select a Sport"}</Text>
                    </TouchableOpacity>
                    {renderSportTypeModal()}
                  </View>
                  {/* max participants */}
                  <View style={styles.maxParticipantsContainer}>
                    <Text style={styles.bold}>Max Participants:</Text>
                    <Controller
                      control={control}
                      name="maxParticipants"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={styles.inputFieldPar}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          keyboardType="numeric"
                        />
                      )}
                    />
                  </View>
                  {/* skill level */}
                  {/* <Text style={styles.bold}>Skill Level:</Text>
                  <View style={styles.skillLevelGroup}>
                    {["Beginner", "Intermediate", "Advanced"].map((level) => (
                      <TouchableOpacity
                        key={level}
                        testID={`skill-level-${level}`}
                        style={[
                          styles.skillLevelOption,
                          selectedSkillLevels.includes(level.toUpperCase()) && styles.skillLevelSelected,
                        ]}
                        onPress={() => toggleSkillLevel(level.toUpperCase())} // Convert to uppercase to match stored values
                      >
                        <Text
                          style={[
                            styles.skillLevelText,
                            selectedSkillLevels.includes(level.toUpperCase()) && styles.skillLevelTextSelected,
                          ]}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View> */}
                  {/* location */}
                  {/* <Text><Text style={styles.bold}>Location:</Text> {eventDetails.locationResponse.name}, {eventDetails.locationResponse.city}</Text> */}
                  {/* date and time */}
                  {/* <Text style={styles.bold}>Date:</Text>
                  <CustomDateTimePicker
                    value={eventDate}
                    mode="date"
                    onChange={(newDate) => setEventDate(newDate)}
                    label="Select Event Date"
                  />
                  <Text style={styles.bold}>From:</Text>
                  <CustomDateTimePicker
                    value={eventStartTime}
                    mode="time"
                    onChange={(newTime) => setEventStartTime(newTime)}
                    label="Select Start Time"
                  />
                  <Text style={styles.bold}>To:</Text>
                  <CustomDateTimePicker
                    value={eventEndTime}
                    mode="time"
                    onChange={(newTime) => setEventEndTime(newTime)}
                    label="Select End Time"
                  /> */}
                  {/* cut off time */}
                  {/* <Text style={styles.bold}>Register by:</Text>
                  <CustomDateTimePicker
                    value={cutOffDate}
                    mode="date"
                    onChange={(newDate) => setCutOffDate(newDate)}
                    label="Select Cut-off Date"
                  />
                  <CustomDateTimePicker
                    value={cutOffTime}
                    mode="time"
                    onChange={(newTime) => setCutOffTime(newTime)}
                    label="Select Cut-off Time"
                  /> */}
                  {/* description */}
                  <Text style={styles.bold}>Description:</Text>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="Enter event description..."
                        placeholderTextColor="black"
                        style={styles.descriptionInput}
                        onBlur={onBlur}
                        onChangeText={(text) => {
                          onChange(text);
                          setDescription(text);
                        }}
                        value={value || description}
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                      />
                    )}
                  />
                </>
              ) : (
                <Text style={styles.errorText}>Failed to load event details.</Text>
              )}
            </ScrollView>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(handleUpdateEvent)}
          >
            <Text style={styles.submitButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: themeColors.button.primaryBackground,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  scrollView: {
    maxHeight: 300,
    width: "100%",
  },
  eventDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: themeColors.text.dark,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 5,
    marginBottom: 15,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 5,
    marginBottom: 15,
  },
  segmentButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  segmentButtonSelected: {
    backgroundColor: themeColors.primary,
  },
  segmentButtonText: {
    fontSize: 16,
    color: themeColors.text.dark,
  },
  segmentButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  skillLevelOption: {
    padding: hs(12),
    borderWidth: 1,
    borderColor: themeColors.border.light,
    borderRadius: mhs(8),
    backgroundColor: themeColors.background.lightGrey,
  },
  skillLevelText: {
    fontSize: mhs(14),
    color: themeColors.text.dark,
  },
  skillLevelTextSelected: {
    color: themeColors.text.light,
    fontWeight: "bold",
  },
  skillLevelGroup: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: vs(10),
    width: "42%",
  },
  skillLevelSelected: {
    backgroundColor: themeColors.primary,
    borderColor: themeColors.primary,
  },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalWrapper: { width: "80%", backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  scrollableList: { maxHeight: 250, width: "100%" },
  modalItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#ccc", alignItems: "center" },
  modalItemText: { fontSize: 16 },
  modalCloseButton: { marginTop: 10, padding: 10, backgroundColor: themeColors.primary, borderRadius: 5 },
  modalCloseButtonText: { color: "white", fontWeight: "bold", textAlign: "center" },
  sportTypeContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  sportDropdown: { padding: 10, backgroundColor: "#f5f5f5", borderRadius: 5, marginRight: 90 },
  maxParticipantsContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  inputFieldPar: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 5,
    marginRight: 115,
  },
  descriptionInput: {
    fontSize: 16,
    color: themeColors.text.dark,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    minHeight: 60,
    maxHeight: 200,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: themeColors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditEventModal;