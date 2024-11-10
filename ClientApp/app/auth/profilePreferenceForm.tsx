import React, { useState } from "react";
import { useRouter } from "expo-router";
import ConfirmButton from "@/components/ConfirmButton";
import sportsArray from "@/util/sports/sportList";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { IconDirection } from "@/components/ConfirmButton";

import {
  View,
  Text,
  TextInput,
  Modal,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import dateCheckGreaterThanSixteen from "@/util/profile/dateCheck";

interface profilePreferenceFormData {
  firstName: string;
  lastName: string;
  dob: Date;
  gender: string;
  phoneNumber: string;
  sportPreference: string;
  ranking: string;
  postalCode: string;
}

const ProfilePreferenceForm: React.FC = () => {
  const genderObject = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];
  const playerLevel = ["Excellent", "Average", "Beginner"];

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<profilePreferenceFormData>();

  const router = useRouter();

  const [showSportPicker, setShowSportPicker] = useState(false);
  const [sportPicked, setSportPicked] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [date, setDate] = useState(new Date());
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handleConfirmDate = (selectedDate: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setValue("dob", selectedDate);
    }
  };
  const onSubmit = async (data: profilePreferenceFormData) => {
    // Logic for api calls and routing
    router.replace("/tabs/home")
  };
  const currentPlatform = Platform.OS;
  return (
    <ScrollView className="flex-grow">
      <View className="flex-1 justify-between p-5 bg-white pr-12 pl-12 pb-4">
        <View className="flex flex-row  min-h-32 justify-center ">
          <View className="flex flex-col jusitfy-center border my-16 rounded-full border-customGray p-8">
            <MaterialCommunityIcons
              name="account-edit"
              size={100}
              color="#aaa"
            />
            <Text className="ml-4 text-xs">upload image</Text>
          </View>
        </View>
        <View className="flex-1 gap-4 ">
          <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
            <MaterialCommunityIcons name="account" size={20} color="#aaa" />
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
            <Text className="pl-4 text-red-500 text-xs">{errors.firstName.message}</Text>
          )}
          <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
            <MaterialCommunityIcons name="account" size={20} color="#aaa" />
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
            <Text className="pl-4 text-red-500 text-xs mb-2">{errors.lastName.message}</Text>
          )}

          <View className="flex flex-row justify-around gap-4">
            <View className="w-3/5">
              <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
                <MaterialCommunityIcons
                  name="calendar-range"
                  testID="dateButton"
                  size={20}
                  color="#aaa"
                  onPress={() => setShowPicker(true)}
                />
                <Controller
                  control={control}
                  name="dob"
                  rules={{
                    required: "Date of birth is required",
                    validate: { dateCheckGreaterThanSixteen },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <View className="flex flex-row">
                      <Text
                        className={`${
                          value ? "text-black" : "text-customGray"
                        }`}
                      >
                        {value ? value.toDateString() : "Select Date of Birth"}
                      </Text>
                      {showPicker &&
                        (currentPlatform === "ios" ? (
                          <Modal
                            transparent={true}
                            animationType="slide"
                            visible={showPicker}
                            onRequestClose={() => setShowPicker(false)}
                          >
                            <View className="flex-1 justify-center pt-16 items-center ">
                              <View className="bg-white px-16 py-8 rounded-lg ">
                                <Text className="text-lg text-center mb-4">
                                  Select Date of Birth
                                </Text>
                                <DateTimePicker
                                  testID="datePicker"
                                  value={date}
                                  mode="date"
                                  display="default"
                                  onChange={(event, selectedDate) => {
                                    const currentDate = selectedDate || date;
                                    setShowPicker(false); // Close modal
                                    handleConfirmDate(currentDate);
                                    onChange(currentDate); // Update the form field
                                  }}
                                />
                              </View>
                            </View>
                          </Modal>
                        ) : (
                          <DateTimePicker
                            testID="datePicker"
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                              const currentDate = selectedDate || date;
                              setShowPicker(false); // Close modal
                              handleConfirmDate(currentDate);
                              onChange(currentDate); // Update the form field
                            }}
                          />
                        ))}
                    </View>
                  )}
                />
              </View>
              {errors.dob && (
                <View className="flex-col">
                  <Text className="pl-4 text-red-500 text-xs ">{errors.dob.message} </Text>
                </View>
              )}
            </View>
            <View className="w-2/5">
              <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
                <MaterialCommunityIcons
                  name="human-non-binary"
                  size={20}
                  color="#aaa"
                  onPress={() => setShowGenderPicker(true)}
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
                          onRequestClose={() => setShowGenderPicker(false)}
                        >
                          <View className="flex-1 justify-center items-center ">
                            <View className="bg-white p-6 rounded-lg w-80">
                              {/* Adjust width and padding */}
                              <Picker
                                selectedValue={selectedGender}
                                onValueChange={(gender: string) => {
                                  onChange(gender);
                                  setShowGenderPicker(false);
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
                            </View>
                          </View>
                        </Modal>
                      )}
                    </View>
                  )}
                />
              </View>
              {errors.gender && (
                <View className="flex-col">
                  <Text className="pl-4 text-red-500 text-xs ">{errors.gender.message}</Text>
                </View>
              )}
            </View>
          </View>
          <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
            <MaterialCommunityIcons name="pound" size={20} color="#aaa" />
            <Controller
              control={control}
              name="phoneNumber"
              rules={{
                required: "Phone number is required",
                pattern: {
                  value: /^\d{3}-\d{3}-\d{4}$/,
                  message: "Enter valid format xxx-xxx-xxxx",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Phone number (xxx-xxx-xxxx)"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ? value : ""}
                />
              )}
            />
          </View>
          {errors.phoneNumber && (
            <View className="flex-col">
              <Text className="pl-4 text-red-500 text-xs ">{errors.phoneNumber.message} </Text>
            </View>
          )}

          <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
            <MaterialCommunityIcons name="map" size={20} color="#aaa" />
            <Controller
              control={control}
              name="postalCode"
              rules={{
                required: "Postal code is required",
                pattern: {
                  value: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
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
            <View className="flex-col">
              <Text className="pl-4 text-red-500 text-xs ">{errors.postalCode.message}</Text>
            </View>
          )}

          <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
            <MaterialCommunityIcons
              name="menu-down"
              size={20}
              color="#aaa"
              onPress={() => setShowSportPicker(true)}
            />

            <Controller
              control={control}
              name="sportPreference"
              rules={{ required: "Sport choice is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text className={`${value ? "text-black" : "text-customGray"}`}>
                    {value ? value : "Select Favourite sport"}
                  </Text>
                  {showSportPicker && (
                    <Modal
                      transparent={true}
                      animationType="slide"
                      visible={showSportPicker}
                      onRequestClose={() => setShowSportPicker(false)}
                    >
                      <View className="flex-1 justify-center items-center ">
                        <View className="bg-white p-6 rounded-lg w-80">
                          <Picker
                            selectedValue={selectedGender}
                            onValueChange={(sport: string) => {
                              onChange(sport);
                              setSportPicked(sport);
                              setShowSportPicker(false);
                              if (sport === "Other") {
                                setSelectedLevel("");
                              }
                            }}
                          >
                            {sportsArray.map((gender, index) => (
                              <Picker.Item
                                key={index}
                                label={gender.label}
                                value={gender.value}
                              />
                            ))}
                          </Picker>
                        </View>
                      </View>
                    </Modal>
                  )}
                </View>
              )}
            />
          </View>
          <View className="flex-row items-center">
            <Controller
              control={control}
              name="ranking"
              rules={{ required: "false" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View className="flex flex-row ">
                    <View className="mt-2">
                      <Text>Level of play: </Text>
                    </View>
                    {playerLevel.map((select, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          if (sportPicked !== "Other") {
                            setSelectedLevel(select);
                            onChange(select);
                          } else {
                            setSelectedLevel("");
                          }
                        }}
                        className={`rounded-3xl p-2 ${selectedLevel === select ? "border border-customGreen" : ""}`}>
                        <Text> {select} </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            />
          </View>

          <View className="mt-4">
            <ConfirmButton
              text="Confirm"
              onPress={handleSubmit(onSubmit)}
              icon={
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={25}
                  color="#fff"
                  style={{ marginLeft: 8 }}
                />
              }
              iconDirection={IconDirection.right}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePreferenceForm;
