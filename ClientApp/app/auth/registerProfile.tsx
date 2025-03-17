import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import { IconPlacement } from "@/utils/constants/enums";
import { View, Text, TextInput, Modal, ScrollView, Alert, TouchableOpacity,StyleSheet} from "react-native";
import { isOlderThanSixteen, isValidDate, formatBirthday, formatPhoneNumber} from "@/utils/helpers/registerProfileHelpers";
import { mvs,vs, hs} from "@/utils/helpers/uiScaler";
import { Profile, SportPreference } from "@/types";
import { useUpdateUserToStore } from '@/state/user/actions';
import { registerProfile } from "@/utils/api/profileApiClient";
import themeColors from "@/utils/constants/colors";
import ConfirmButton from "@/components/Helper Components/ConfirmButton";
import FormErrorMessage from "@/components/Errors/FormErrorMessage";
import RegisterProfileSports from "@/components/RegisterProfile/RegisterProfileSports";
import { useTranslation } from 'react-i18next';

interface RegisterProfilePageFormData {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  selectedSports: SportPreference[];
  ranking: string;
  postalCode: string;
}

const RegisterProfilePage: React.FC = () => {
  const router = useRouter();
  const updateUserToStore = useUpdateUserToStore();
  const { userID } = useLocalSearchParams();
  const {control, handleSubmit, formState: { errors }, trigger} = useForm<RegisterProfilePageFormData>();
  const [currentStep, setCurrentStep] = useState(1);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const { t } = useTranslation();
  const genders = [t('register_profile.male'), t('register_profile.female'), t('register_profile.other')];

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
            t('register_profile.error_occured'),
            t('register_profile.error_message_step_1')
          );
    } 
    if (currentStep === 2) {
      const isValid = await trigger(["selectedSports"]);
      isValid
        ? setCurrentStep(1)
        : Alert.alert(
            t('register_profile.error_occured'),
            t('register_profile.error_message_step_2')
          );
    }
  };

  const onSubmit = async (data: RegisterProfilePageFormData) => {
    try{
      const profile: Profile = {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dob,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        postalCode: data.postalCode,
        sportsOfPreference: data.selectedSports,
        ranking: "Test Ranking",
      };
      await registerProfile(profile, userID as string);
      await updateUserToStore(userID as string);
      router.replace("/(tabs)/home");
    } catch (error: any){
      Alert.alert(t('register_profile.error'), t('register_profile.error_create_profile'));
      throw new Error(`${t('register_profile.error_register_profile')} ${error}`);
    }
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
                  <Text style={styles.imageText}>{t('register_profile.image_upload')}</Text>
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
                      rules={{ required: t('register_profile.first_name_required') }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder={t('register_profile.first_name')}
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
                      rules={{ required: t('register_profile.last_name_required') }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder={t('register_profile.last_name')}
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
                          required: t('register_profile.dob_required'),
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
                              value={value ? value.toString() : ""}
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
                          rules={{ required: t('register_profile.gender_required') }}
                          render={({ field: { onChange, value } }) => (
                            <View>
                              <Text
                                className={`${
                                  value ? themeColors.text.dark : themeColors.text.lightGrey 
                                }`}
                              >
                                {value ? value : t('register_profile.gender')}
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
                                        {Object.values(genders).map((gender, index) => (
                                          <Picker.Item
                                            key={index}
                                            label={gender}
                                            value={gender}
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
                                            paddingHorizontal: vs(12),
                                            borderRadius: 24,
                                            width: "50%",
                                            paddingVertical: hs(8),
                                          }}
                                          onPress={() => {
                                            if (selectedGender === "") {
                                              onChange(t('register_profile.male'));
                                            }
                                            setShowGenderPicker(false);
                                          }}
                                        >
                                          <Text style={{ color: themeColors.background.light }}>
                                            {t('register_profile.select_gender')}
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
                        required: t('register_profile.phone_required'),
                        pattern: {
                          value: /^(\d{3}-\d{3}-\d{4}|\d{10})$/,
                          message: t('register_profile.phone_invalid'),
                        },
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder={t('register_profile.phone_number')}
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
                        required: t('register_profile.postal_code_required'),
                        pattern: {
                          value:
                            /^([A-Za-z]\d[A-Za-z] \d[A-Za-z]\d|[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d)$/,
                          message: t('register_profile.postal_code_invalid'),
                        },
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder={t('register_profile.postal_code')}
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
            <View style={{ bottom: 0, marginTop: vs(4) }}>
              <ConfirmButton
                text={t('register_profile.continue_button')}
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
                      {t('register_profile.select_sport')}
                    </Text>
                  </View>
                  <View style={styles.sportSelectionTitleWrapper}>
                    <Text style={styles.sportSelectionSubtitleWrapper}>
                      {t('register_profile.select_sport_subtitle')}
                    </Text>
                  </View>
                </View>
              </View>
              <Controller
                control={control}
                name="selectedSports"
                rules={{
                  required: t('register_profile.select_sport_error'),
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.multiSportContainer}>
                    <RegisterProfileSports onChange={onChange} selectedSports={[]} />
                  </View>
                )}
              />
            </View>

            <View>
              {errors.selectedSports && (
                <View style={styles.selectedSportsErrorContainer}>
                  <Text style={styles.selectedSportsError}>
                  {t('register_profile.select_sport_error')}{" "}
                  </Text>
                </View>
              )}
              <View>
                <ConfirmButton
                  text={t('register_profile.continue_button')}
                  onPress={handleSubmit(onSubmit)}
                  icon={
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={25}
                      color= {themeColors.background.light}
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

export default RegisterProfilePage;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    flexGrow: 1
  },
  imageContainer: {
    flexDirection: "row",
    minHeight: vs(128),
    justifyContent: "center",
  },
  imageHolder: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    marginTop: vs(16),
    marginBottom: vs(32),
    borderRadius: vs(9999),
    borderColor: themeColors.text.grey,
    padding: vs(32),
  },
  imageText: {
    marginLeft: vs(16),
    fontSize: vs(12),
  },
  inputParentContainer: {
    flex: 1,
    gap: vs(16),
  },
  birthDateContainer: {
    justifyContent: "space-around",
    gap: vs(16),
  },
  birthDateInput: {
    width: "60%",
  },
  flexRowDirection: {
    display: "flex",
    flexDirection: "row",
  },
  genderContainer: {
    width: "30%",
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
    backgroundColor: themeColors.background.light,
    padding: vs(24),
    borderRadius: vs(12),
    width: vs(320),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeColors.background.lightGrey,
    borderRadius: 24,
    paddingLeft: hs(8),
    minHeight: vs(56),
  },
  stepTwoContainer: {
    marginBottom: vs(16),
  },
  SportSelectionDialoguecontainer: {
    flexDirection: "column",
    marginLeft: hs(16),
  },
  sportSelectionTitleWrapper: {
    justifyContent: "center",
  },
  sportSelectionTitleText: {
    fontSize: vs(24),
    fontWeight: "bold",
  },
  sportSelectionSubtitleWrapper: {
    justifyContent: "center",
    color: themeColors.text.grey,
    marginBottom: vs(16),
  },
  multiSportContainer: {
    flex: 1,
    gap: vs(32),
  },
  selectedSportsErrorContainer: {
    flexDirection: "column",
  },
  selectedSportsError: {
    textAlign: "center",
    marginBottom: mvs(32),
    color: themeColors.error,
    fontSize: mvs(16),
    paddingLeft: hs(16),
  },
});