import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import ConfirmButton from "@/components/ConfirmButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import { IconPlacement } from "@/utils/constants/enums";
import { UPDATE_PROFILE_ENDPOINT } from "@/utils/api/endpoints";
import { View, Text, TextInput, Modal, ScrollView, Alert, TouchableOpacity,StyleSheet, TouchableWithoutFeedback, Button} from "react-native";
import FormErrorMessage from "@/components/Errors/FormErrorMessage";
import RegisterProfileSports from "@/components/RegisterProfile/RegisterProfileSports";
import { useAuth } from "@/utils/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";
import { isOlderThanSixteen, isValidDate, formatBirthday, formatBirthdateToLocalDate} from "@/utils/helpers/ageHelpers";
import { mvs,hs } from "@/utils/helpers/uiScaler";
import themeColors from "@/utils/constants/colors";


type SelectedSport = { name: string; ranking: string };

interface RegisterProfilePageFormData {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  selectedSports: SelectedSport[];
  ranking: string;
  postalCode: string;
}

interface RegisteredUserResponse {
  success: boolean; 
  data?: {id: string, email: string, username: string} | null; 
  error?: string;
}


const formatPhoneNumber = (value: string) => {
  const cleanValue = value.replace(/\D/g, ''); 
  const match = cleanValue.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

  if (!match) return cleanValue;

  const formatted = [
    match[1],
    match[2] && match[2].length > 0 ? '-' + match[2] : '',
    match[3] && match[3].length > 0 ? '-' + match[3] : '',
  ].join('');
  return formatted;
};

const RegisterProfilePage: React.FC = () => {
  const router = useRouter();
  const { getRegistrationUserId } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<RegisterProfilePageFormData>();
  const [registrationUserId, setRegistrationUserId] = useState<string | null>("")
  const [currentStep, setCurrentStep] = useState(1);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getRegistrationUserId()
      setRegistrationUserId(userId);
    };
    fetchUserId();
  }, []);

  const genderObject = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const nextStep = async (currentStep: number) => {
    if (currentStep === 1) {
      const isValid = await trigger([
        "firstName",
        "lastName",
        "gender",
        "dob",
        "phoneNumber",
        "postalCode",
      ]);
      isValid
        ? setCurrentStep(2)
        : Alert.alert(
            "Error Occured",
            "Please complete form before proceeding."
          );
    } 
    if (currentStep === 2) {
      const isValid = await trigger(["selectedSports"]);
      isValid
        ? setCurrentStep(1)
        : Alert.alert(
            "Error Occured",
            "Please select a sport before proceeding."
          );
    }
  };


  const onSubmit = async (data: RegisterProfilePageFormData) => {
    if(data){
    const registrationResult = await registerProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dob,
      gender: data.gender,
      phoneNumber: data.phoneNumber,
      postalCode: data.postalCode,
      sportsOfPreference: data.selectedSports
    });

    if (registrationResult.success) {
      Alert.alert("Success", "Profile was created successfully");
      router.replace("/(tabs)/home");
    }else{
      Alert.alert('Error', 'Error occured creating profile')
      console.log(registrationResult.error);
    } 
  }
  };
  const registerProfile = async (data: any): Promise<RegisteredUserResponse> => {
    if (!registrationUserId) {
      console.error('Registration user ID is not defined');
      return {
        success: false,
        error: 'Registration user ID is missing',
      };
    }
    data.dateOfBirth = formatBirthdateToLocalDate(data.dateOfBirth)
    try {
      const response = await axiosInstance.patch(UPDATE_PROFILE_ENDPOINT(registrationUserId), data);
      if (response && (response.status === 201 || response.status === 200)) {
        return {
          success: true,
          data: {
            id: response.data.id,
            email: response.data.email,
            username: response.data.username,
          },
          error: "No Error!",
        };
      }
    } catch (e: any) {
      console.error('Error updating profile:', e);
      return {
        success: false,
        error: e.message || 'An unknown error occurred',
      };
    }
  
    return {
      success: false,
      error: 'Failed to update profile',
    };
  };

  return (
    <View style={{ flexGrow: 1 }}>
      <View className="flex-1 justify-between bg-white pr-12 pl-12 p-16">
        {currentStep === 1 && (
          <>
            <ScrollView
              style={styles.scrollViewContainer}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.imageContainer}>
                <View style={styles.imageHolder}>
                  <MaterialCommunityIcons
                    name="account-edit"
                    size={100}
                    color="#aaa"
                  />
                  <Text style={styles.imageText}>upload image</Text>
                </View>
              </View>
              <View style={styles.inputParentContainer}>
                <View>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons
                      name="account"
                      size={mvs(20)}
                      color="#aaa"
                    />
                    <Controller
                      control={control}
                      name="firstName"
                      rules={{ required: "First name is required" }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder="First name"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                    />
                  </View>
                  {errors.firstName && (
                    <FormErrorMessage error={errors.firstName} />
                  )}
                </View>
                <View>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons
                      name="account"
                      size={mvs(20)}
                      color="#aaa"
                    />
                    <Controller
                      control={control}
                      name="lastName"
                      rules={{ required: "Last name is required" }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder={"Last name"}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                    />
                  </View>
                  {errors.lastName && (
                    <FormErrorMessage error={errors.lastName} />
                  )}
                </View>
                <View
                  style={[styles.flexRowDirection, styles.birthDateContainer]}
                >
                  <View style={styles.birthDateInput}>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons
                        name="calendar-range"
                        testID="dateButton"
                        size={mvs(20)}
                        color="#aaa"
                      />
                      <Controller
                        control={control}
                        name="dob"
                        rules={{
                          required: "Date of birth is required",
                          validate: {
                            validDate: isValidDate,
                            isOverSixteen: isOlderThanSixteen,
                          },
                        }}
                        render={({ field: { onChange, value, onBlur } }) => (
                          <View style={styles.flexRowDirection}>
                            <TextInput
                              placeholder="yyyy/mm/dd"
                              style={{ marginLeft: 4 }}
                              onBlur={onBlur}
                              onChangeText={(text: string) => {
                                const formattedText = formatBirthday(text);
                                onChange(formattedText);
                              }}
                              value={value || ""}
                              maxLength={10}
                              keyboardType="number-pad"
                            />
                          </View>
                        )}
                      />
                    </View>
                    {errors.dob && <FormErrorMessage error={errors.dob} />}
                  </View>
                  <View style={styles.genderContainer}>
                    <View style={styles.inputContainer}>
                      <TouchableOpacity
                        style={styles.genderModalTouchable}
                        onPress={() => setShowGenderPicker(true)}
                      >
                        <MaterialCommunityIcons
                          testID="TestGenderButton"
                          name="human-non-binary"
                          size={mvs(20)}
                          color="#aaa"
                        />

                        <Controller
                          control={control}
                          name="gender"
                          rules={{ required: "Gender is required" }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <View>
                              <Text
                                className={`${
                                  value ? "text-black" : "text-customGray"
                                }`}
                              >
                                {value ? value : "Gender"}
                              </Text>
                              {showGenderPicker && (
                                <Modal
                                  transparent={true}
                                  animationType="slide"
                                  visible={showGenderPicker}
                                  onRequestClose={() =>
                                    setShowGenderPicker(false)
                                  }
                                >
                                  <View style={styles.genderModalContainer}>
                                    <View style={styles.genderModalPicker}>
                                      <Picker
                                        testID="genderPickerTest"
                                        selectedValue={selectedGender}
                                        onValueChange={(gender: string) => {
                                          onChange(gender);
                                          setSelectedGender(gender);
                                        }}
                                      >
                                        {genderObject.map((gender, index) => (
                                          <Picker.Item
                                            key={index}
                                            label={gender.label}
                                            value={gender.value}
                                          />
                                        ))}
                                      </Picker>
                                      <View
                                        style={{
                                          display: "flex",
                                          flexDirection: "row",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <TouchableOpacity
                                        testID="genderPickerSubmit"
                                          style={{
                                            alignItems: "center",
                                            backgroundColor:
                                              themeColors.button
                                                .primaryBackground,
                                            paddingHorizontal: 12,
                                            borderRadius: 24,
                                            width: "50%",
                                            paddingVertical: 8,
                                          }}
                                          onPress={() => {
                                            if (selectedGender === "") {
                                              onChange("Male");
                                            }
                                            setShowGenderPicker(false);
                                          }}
                                        >
                                          <Text style={{ color: "white" }}>
                                            Select
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  </View>
                                </Modal>
                              )}
                            </View>
                          )}
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.gender && (
                      <FormErrorMessage error={errors.gender} />
                    )}
                  </View>
                </View>
                <View>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons
                      name="pound"
                      size={mvs(20)}
                      color="#aaa"
                    />
                    <Controller
                      control={control}
                      name="phoneNumber"
                      rules={{
                        required: "Phone number is required",
                        pattern: {
                          value: /^(\d{3}-\d{3}-\d{4}|\d{10})$/,
                          message: "Enter valid format xxx-xxx-xxxx",
                        },
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder="Phone number (xxx-xxx-xxxx)"
                          onBlur={onBlur}
                          onChangeText={(number) =>
                            onChange(formatPhoneNumber(number))
                          }
                          value={value ? value : ""}
                          maxLength={12}
                        />
                      )}
                    />
                  </View>
                  {errors.phoneNumber && (
                    <FormErrorMessage error={errors.phoneNumber} />
                  )}
                </View>
                <View>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons
                      name="map"
                      size={mvs(20)}
                      color="#aaa"
                    />
                    <Controller
                      control={control}
                      name="postalCode"
                      rules={{
                        required: "Postal code is required",
                        pattern: {
                          value:
                            /^([A-Za-z]\d[A-Za-z] \d[A-Za-z]\d|[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d)$/,
                          message: "Enter valid format eg. A1A 1A1",
                        },
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder="Postal code"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value ? value : ""}
                        />
                      )}
                    />
                  </View>
                  {errors.postalCode && (
                    <FormErrorMessage error={errors.postalCode} />
                  )}
                </View>
              </View>
            </ScrollView>
            <View style={{ bottom: 0, marginTop: 4 }}>
              <ConfirmButton
                text="Continue"
                onPress={() => {
                  nextStep(1);
                }}
                icon={
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={25}
                    color="#fff"
                    style={{ marginLeft: 8, bottom: 0 }}
                  />
                }
                iconPlacement={IconPlacement.right}
              />
            </View>
          </>
        )}

        {currentStep === 2 && (
          <>
            <View style={{ flexGrow: 1 }}>
              <View style={styles.stepTwoContainer}>
                <View style={styles.stepTwoContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setCurrentStep(1);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="arrow-left-thin"
                      testID="backArrow"
                      size={40}
                      color="#aaa"
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.SportSelectionDialoguecontainer}>
                  <View style={styles.sportSelectionTitleWrapper}>
                    <Text style={styles.sportSelectionTitleText}>
                      Add your Favourite Sports
                    </Text>
                  </View>
                  <View style={styles.sportSelectionTitleWrapper}>
                    <Text style={styles.sportSelectionSubtitleWrapper}>
                      Choose your favourite sports in your home section
                    </Text>
                  </View>
                </View>
              </View>
              <Controller
                control={control}
                name="selectedSports"
                rules={{
                  required: "Please select at least one sport.",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.multiSportContainer}>
                    <RegisterProfileSports onChange={onChange} />
                  </View>
                )}
              />
            </View>

            <View>
              {errors.selectedSports && (
                <View style={styles.selectedSportsErrorContainer}>
                  <Text style={styles.selectedSportsError}>
                    Please select at least one sport.{" "}
                  </Text>
                </View>
              )}
              <View>
                <ConfirmButton
                  text="Continue"
                  onPress={handleSubmit(onSubmit)}
                  icon={
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={25}
                      color="#fff"
                      style={{ marginLeft: 8 }}
                    />
                  }
                  iconPlacement={IconPlacement.right}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    flexGrow: 1
  },
  imageContainer: {
    flexDirection: "row",
    minHeight: 128,
    justifyContent: "center",
  },
  imageHolder: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 9999,
    borderColor: "#D1D5DB",
    padding: 32,
  },
  imageText: {
    marginLeft: 16,
    fontSize: 12,
  },
  inputParentContainer: {
    flex: 1,
    gap: 16,
  },
  birthDateContainer: {
    justifyContent: "space-around",
    gap: 16,
  },
  birthDateInput: {
    width: "60%",
  },
  flexRowDirection: {
    display: "flex",
    flexDirection: "row",
  },
  genderContainer: {
    width: "40%",
  },
  genderModalTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  genderModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  genderModalPicker: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 12,
    width: 320,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 24,
    padding: 8,
    paddingLeft: 16,
    minHeight: 64,
  },
  stepTwoContainer: {
    marginBottom: 16,
  },
  SportSelectionDialoguecontainer: {
    flexDirection: "column",
    marginLeft: 16,
  },
  sportSelectionTitleWrapper: {
    justifyContent: "center",
  },
  sportSelectionTitleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sportSelectionSubtitleWrapper: {
    justifyContent: "center",
    color: "#A0A0A0",
    marginBottom: 16,
  },
  multiSportContainer: {
    flex: 1,
    gap: 32,
  },
  selectedSportsErrorContainer: {
    flexDirection: "column",
  },
  selectedSportsError: {
    textAlign: "center",
    marginBottom: 32,
    color: "#EF4444",
    fontSize: hs(16),
    paddingLeft: 16,
  },
});




export default RegisterProfilePage;
