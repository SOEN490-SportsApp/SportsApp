import themeColors from "@/utils/constants/colors";
import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, TextInput } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getAxiosInstance } from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/utils/api/endpoints";
import { Controller, useForm, useWatch } from "react-hook-form";
import { hs, vs, mhs } from "@/utils/helpers/uiScaler";

interface EditEventModalProps {
  visible: boolean;
  onClose: () => void;
  eventId: string;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ visible, onClose }) => {

  interface EventDetails {
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
      // setValue,
      reset,
    } = useForm<EventDetails>({
      defaultValues: {
        eventName: "",
        eventType: "",
        sportType: "",
        maxParticipants: "",
        description: "",
      },
    });

  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [loading, setLoading] = useState(true);
  const { setValue, watch } = useForm();
  const [requiredSkillLevel, setRequiredSkillLevel] = useState<string[]>([]);

  useEffect(() => {
    if (eventDetails?.eventType) {
      setValue("eventType", eventDetails.eventType);
    }
  }, [eventDetails, setValue]);

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

  const toggleSkillLevel = (level: string) => {
    const updatedSkillLevels = requiredSkillLevel.includes(level)
      ? requiredSkillLevel.filter((item) => item !== level)
      : [...requiredSkillLevel, level];

    setRequiredSkillLevel(updatedSkillLevels);
    setValue("requiredSkillLevel", updatedSkillLevels);
  };

  // const watch = useWatch({ control });

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
                  <View style={styles.segmentedControl}>
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
                  </View>
                  {/* sport type */}
                  <Text style={styles.eventDetail}><Text style={styles.bold}>Sport:</Text> {eventDetails.sportType}</Text>
                  {/* max participants */}
                  <Text style={styles.eventDetail}><Text style={styles.bold}>Max Participants:</Text> {eventDetails.maxParticipants}</Text>
                  {/* skill level */}
                  <Text style={styles.eventDetail}><Text style={styles.bold}>Skill Level:</Text> {eventDetails.requiredSkillLevel.join(", ")}</Text>
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
                  {/* location */}
                  <Text style={styles.eventDetail}><Text style={styles.bold}>Location:</Text> {eventDetails.locationResponse.name}, {eventDetails.locationResponse.city}</Text>
                  {/* date and time */}
                  <Text style={styles.eventDetail}><Text style={styles.bold}>Date:</Text> {eventDetails.date}</Text>
                  <Text style={styles.eventDetail}><Text style={styles.bold}>From</Text> {eventDetails.startTime} <Text style={styles.bold}>to</Text> {eventDetails.endTime}</Text>
                  {/* cut off time */}
                  <Text style={styles.eventDetail}><Text style={styles.bold}>Register by</Text> {eventDetails.cutOffTime}</Text>
                  {/* description */}
                  <Text style={styles.eventDetail}><Text style={styles.bold}>Description:</Text> {eventDetails.description}</Text>
                </>
              ) : (
                <Text style={styles.errorText}>Failed to load event details.</Text>
              )}
            </ScrollView>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
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
});

export default EditEventModal;
