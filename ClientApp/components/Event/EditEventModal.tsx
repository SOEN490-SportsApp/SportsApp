import themeColors from "@/utils/constants/colors";
import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, TextInput, Alert, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getAxiosInstance } from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/utils/api/endpoints";
import { Controller, useForm, useWatch } from "react-hook-form";
import { hs, vs, mhs } from "@/utils/helpers/uiScaler";
import supportedSports from "@/utils/constants/supportedSports";
import GooglePlacesInput from "../Helper Components/GooglePlacesInput";
import TinyCustomDateTimePicker from "../Helper Components/TinyCustomDateTimePicker";
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
    date: string;
    startTime: {
      hour: number;
      minute: number;
      second: number;
      nano: number;
    };
    endTime: {
      hour: number;
      minute: number;
      second: number;
      nano: number;
    };
    maxParticipants: string;
    cutOffTime: string;
    description: string;
    // isPrivate: boolean;
    requiredSkillLevel: string[];
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
        sportType: "",
        maxParticipants: "",
        description: "",
        date: "",
        startTime: {
          hour: 0,
          minute: 0,
          second: 0,
          nano: 0,
        },
        endTime: {
          hour: 0,
          minute: 0,
          second: 0,
          nano: 0,
        },
        cutOffTime: "",
        requiredSkillLevel: [],
      },
    });

  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [loading, setLoading] = useState(true);
  const { setValue, watch } = useForm();
  const [isSportTypeModalVisible, setSportTypeModalVisible] = useState(false);
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
      setEventStartTime(new Date(`1970-01-01T${eventDetails.startTime}`));
    }
    if (eventDetails?.endTime) {
      setEventEndTime(new Date(`1970-01-01T${eventDetails.endTime}`));
    }
  }, [eventDetails]);

  useEffect(() => {
    if (eventDetails?.cutOffTime) {
      const cutOffDateTime = new Date(eventDetails.cutOffTime);
      setCutOffDate(new Date(cutOffDateTime.toDateString()));
      setCutOffTime(new Date(`1970-01-01T${cutOffDateTime.toTimeString().slice(0, 8)}`));
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

      if (eventDate && eventDate !== new Date(eventDetails.date)) {
        updatedEventData.date = eventDate.toISOString();
      }

      if (eventStartTime && eventStartTime !== new Date(`1970-01-01T${eventDetails.startTime}`)) {
        updatedEventData.startTime = eventStartTime.toTimeString().slice(0, 8);
      }

      if (eventEndTime && eventEndTime !== new Date(`1970-01-01T${eventDetails.endTime}`)) {
        updatedEventData.endTime = eventEndTime.toTimeString().slice(0, 8);
      }

      if (cutOffDate && cutOffTime && cutOffDate !== new Date(eventDetails.cutOffTime) || cutOffTime !== new Date(eventDetails.cutOffTime)) {
        if (cutOffDate && cutOffTime) {
          updatedEventData.cutOffTime = new Date(`${cutOffDate.toDateString()} ${cutOffTime.toTimeString().slice(0, 8)}`).toISOString();
        }
      }

      if (selectedSkillLevels.length > 0) {
        updatedEventData.requiredSkillLevel = selectedSkillLevels;
      } else {
        alert("Please select at least one skill level.");
        return;
      }
  
      console.log("Payload Sent to API: ", JSON.stringify(updatedEventData, null, 2));
  
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
          {/* <Text style={styles.modalTitle}>Select a Sport</Text> */}
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

  const handleCancel = () => {
    if (eventDetails) {
      reset({
        eventName: eventDetails.eventName || "",
        sportType: eventDetails.sportType || "",
        maxParticipants: eventDetails.maxParticipants ? String(eventDetails.maxParticipants) : "",
        description: eventDetails.description || "",
        date: eventDetails.date || "",
        startTime: eventDetails.startTime || { hour: 0, minute: 0, second: 0, nano: 0 },
        endTime: eventDetails.endTime || { hour: 0, minute: 0, second: 0, nano: 0 },
        cutOffTime: eventDetails.cutOffTime || "",
        requiredSkillLevel: eventDetails.requiredSkillLevel || [],
      });
    }
  
    setEventDate(eventDetails?.date ? new Date(eventDetails.date) : null);
    setEventStartTime(eventDetails?.startTime ? new Date(`1970-01-01T${eventDetails.startTime}`) : null);
    setEventEndTime(eventDetails?.endTime ? new Date(`1970-01-01T${eventDetails.endTime}`) : null);
    setCutOffDate(eventDetails?.cutOffTime ? new Date(eventDetails.cutOffTime) : null);
    setCutOffTime(eventDetails?.cutOffTime ? new Date(`1970-01-01T${eventDetails.cutOffTime.split('T')[1]}`) : null);
    setDescription(eventDetails?.description || "");
    setSelectedSport(eventDetails?.sportType || "");
    setSelectedSkillLevels(eventDetails?.requiredSkillLevel || []);
  
    onClose();
  };  

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "position" : undefined} 
          style={styles.modalContainer}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editing event ...</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#007BFF" />
            ) : (
              <ScrollView style={styles.scrollView}>
                {eventDetails ? (
                  <>
                    {/* event name */}
                    <View style={styles.rowView}>
                        <Text style={styles.bold}>Name:</Text>
                      <Controller
                        control={control}
                        name="eventName"
                        rules={{
                          maxLength: {
                            value: 20,
                            message: "Event name cannot exceed 20 characters.",
                          },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <View style={{ flex: 1 }}>
                            <TextInput
                              placeholder={eventDetails.eventName}
                              placeholderTextColor="black"
                              style={styles.inputField}
                              onBlur={onBlur}
                              onChangeText={(text) => {
                                if (text.length <= 20) {
                                  onChange(text);
                                }
                              }}
                              value={value || ""}
                              maxLength={20}
                            />
                          </View>
                        )}
                      />
                    </View>
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
                    <View style={styles.spaceView}>
                      <View style={styles.sportTypeContainer}>
                        <Text style={styles.bold}>Sport Type:</Text>
                        <TouchableOpacity
                          style={styles.sportDropdown}
                          onPress={() => setSportTypeModalVisible(true)}
                        >
                          <Text style={{ fontSize: mhs(13) }}>{selectedSport || "Select a Sport"}</Text>
                        </TouchableOpacity>
                        {renderSportTypeModal()}
                      </View>
                    </View>
                    {/* max participants */}
                    <View style={styles.spaceView}>
                      <View style={styles.rowView}>
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
                      </View>
                    </View>
                    {/* skill level */}
                    <View style={styles.spaceView}>
                      <View style={styles.rowView}>
                        <Text style={styles.bold}>Skill Level:</Text>
                        <View style={styles.skillLevelGroup}>
                          {["Beginner", "Intermediate", "Advanced"].map((level) => (
                            <TouchableOpacity
                              key={level}
                              testID={`skill-level-${level}`}
                              style={[
                                styles.skillLevelOption,
                                selectedSkillLevels.includes(level.toUpperCase()) && styles.skillLevelSelected,
                              ]}
                              onPress={() => toggleSkillLevel(level.toUpperCase())}
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
                        </View>
                      </View>
                    </View>
                    {/* location */}
                    {/* <Text><Text style={styles.bold}>Location:</Text> {eventDetails.locationResponse.name}, {eventDetails.locationResponse.city}</Text> */}
                    {/* date and time */}
                    <View style={styles.spaceView}>
                      <View style={styles.rowView}>
                        <Text style={styles.bold}>Date:</Text>
                        <View style={styles.dateView}>
                          <TinyCustomDateTimePicker
                            value={eventDate}
                            mode="date"
                            onChange={(newDate) => setEventDate(newDate)}
                            label="Select Event Date"
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.spaceView}>
                      <View style={styles.rowViewRegister}>
                        <Text style={styles.bold}>From:</Text>
                        <View style={styles.timeView}>
                          <TinyCustomDateTimePicker
                            value={eventStartTime}
                            mode="time"
                            onChange={(newTime) => setEventStartTime(newTime)}
                            label="Select Start Time"
                          />
                        </View>
                        <Text style={styles.bold}>To:</Text>
                        <View style={styles.timeView}>
                          <TinyCustomDateTimePicker
                            value={eventEndTime}
                            mode="time"
                            onChange={(newTime) => setEventEndTime(newTime)}
                            label="Select End Time"
                          />
                        </View>
                      </View>
                    </View>
                    {/* cut off time */}
                    <View style={styles.spaceView}>
                      <View style={styles.rowViewRegister}>
                        <Text style={styles.bold}>Register by:</Text>
                        <TinyCustomDateTimePicker
                          value={cutOffDate}
                          mode="date"
                          onChange={(newDate) => setCutOffDate(newDate)}
                          label="Select Cut-off Date"
                        />
                        <TinyCustomDateTimePicker
                          value={cutOffTime}
                          mode="time"
                          onChange={(newTime) => setCutOffTime(newTime)}
                          label="Select Cut-off Time"
                        />
                      </View>
                    </View>
                    {/* description */}
                    <View style={styles.spaceView}>
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
                    </View>
                  </>
                ) : (
                  <Text style={styles.errorText}>Failed to load event details.</Text>
                )}
              </ScrollView>
            )}
            <View style={styles.rowViewButtons}>
              <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit(handleUpdateEvent)}
              >
                <Text style={styles.submitButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
    width: 350,
    height: 700,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "red",
    borderRadius: 20,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollView: {
    maxHeight: 500,
    width: "100%",
  },
  bold: {
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: mhs(12),
  },
  inputField: {
    flex: 1,
    fontSize: mhs(13),
    color: themeColors.text.dark,
    backgroundColor: themeColors.background.lightGrey,
    borderRadius: 20,
    marginLeft: 6,
    padding: 15,
  },
  skillLevelOption: {
    padding: hs(5),
    borderWidth: 1,
    borderColor: themeColors.border.light,
    borderRadius: 20,
    backgroundColor: themeColors.background.lightGrey,
    marginRight: 3.8,
  },
  skillLevelText: {
    fontSize: mhs(12),
    color: themeColors.text.dark,
  },
  skillLevelTextSelected: {
    color: themeColors.text.light,
    fontWeight: "bold",
  },
  skillLevelGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "75%",
    flexWrap: "wrap",
  },
  skillLevelSelected: {
    backgroundColor: themeColors.primary,
    borderColor: themeColors.primary,
  },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalWrapper: { width: "40%", backgroundColor: "white", padding: 20, borderRadius: 20, alignItems: "center" },
  scrollableList: { maxHeight: 250, width: "100%" },
  modalItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#ccc", alignItems: "center" },
  modalItemText: { fontSize: 16 },
  modalCloseButton: { marginTop: 10, padding: 8, backgroundColor: "red", borderRadius: 20 },
  modalCloseButtonText: { color: "white", fontWeight: "bold", textAlign: "center" },
  sportTypeContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sportDropdown: { padding: 10, backgroundColor: themeColors.background.lightGrey, borderRadius: 20, marginRight: 150 },
  maxParticipantsContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginRight: 35 },
  inputFieldPar: {
    backgroundColor: themeColors.background.lightGrey,
    borderRadius: 20,
    marginLeft: 5,
    width: 50,
    textAlign: "center",
    fontSize: mhs(13),
  },
  descriptionInput: {
    fontSize: mhs(13),
    color: themeColors.text.dark,
    backgroundColor: themeColors.background.lightGrey,
    borderRadius: 20,
    padding: 15,
    minHeight: 60,
    maxHeight: 200,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: themeColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 20,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  rowView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowViewRegister: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 20,
  },
  dateView: {
    flex: 1,
    marginLeft: 10,
    marginRight: 110,
  },
  timeView: {
    flex: 1,
    marginLeft: 10,
    marginRight: 30,
  },
  rowViewButtons: {
    flexDirection: "row",
    marginTop: 50,
  },
  spaceView: {
    marginTop: 20,
  },
});

export default EditEventModal;