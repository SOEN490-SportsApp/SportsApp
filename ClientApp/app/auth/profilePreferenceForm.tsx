import React, { useState } from "react";
import { useRouter } from "expo-router";
import ConfirmButton from "@/components/ConfirmButton";
import sportsArray from "@/util/sports/sportList";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { View, Text, TextInput, Button, Modal, Alert } from "react-native";
import dateCheckGreaterThanSixteen from "@/util/profile/dateCheck";

interface profilePreferenceFormData {
  firstName: string;
  lastName: string;
  dob: Date;
  phoneNumber: string;
  sportPreferences: string[];
  location: string;
  profilePicture: string;
}

const ProfilePreferenceForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<profilePreferenceFormData>();
  const router = useRouter();
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleConfirmDate = (selectedDate: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setValue("dob", selectedDate);
    }
  };
  const onSubmit = async (data: profilePreferenceFormData) => {
    if (data.dob) {
      Alert.alert("Successful creation", "moving forward");
      // Add logic here for setting attributes
      // set to home router.push('/home')
    }
  };

  return (
    <View className="flex-1 justify-between p-5 bg-white pr-12 pl-12 pb-4">
      <View className="flex flex-row  min-h-32 justify-center ">
        <View className="flex flex-col jusitfy-center border my-16 rounded-full border-customGray p-8">
          <MaterialCommunityIcons name="account-edit" size={100} color="#aaa" />
          <Text className="ml-4 text-xs">upload image</Text>
        </View>
      </View>
      <View className="flex-1 gap-4">
        <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
          <MaterialCommunityIcons name="account" size={30} color="#aaa" />
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
          <Text className="pl-4 text-red-500 text-xs">
            {errors.firstName.message}
          </Text>
        )}
        <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
          <MaterialCommunityIcons name="account" size={30} color="#aaa" />
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
          <Text className="pl-4 text-red-500 text-xs mb-2">
            {errors.lastName.message}
          </Text>
        )}
        <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
          <MaterialCommunityIcons
            name="calendar-range"
            size={30}
            color="#aaa"
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
                <Button
                  testID="dateButton"
                  title={value ? value.toDateString() : "Select Date of Birth"}
                  onPress={() => setShowPicker(true)}
                />
                {showPicker && (
                  <Modal
                    transparent={true}
                    animationType="slide"
                    visible={showPicker}
                    onRequestClose={() => setShowPicker(false)}
                  >
                    <View className="flex-1 justify-center pt-16 items-center ">
                      <View className="bg-white px-16 py-8  rounded-lg ">
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
                        <Button
                          title="Done"
                          onPress={() => setShowPicker(false)}
                        />
                      </View>
                    </View>
                  </Modal>
                )}
              </View>
            )}
          />
        </View>
        {errors.dob && (
          <View className="flex-col">
            <Text className="pl-4 text-red-500 text-xs ">
              {errors.dob.message}
            </Text>
          </View>
        )}
        <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
          <MaterialCommunityIcons name="phone" size={30} color="#aaa" />
          <Controller
            control={control}
            name="phoneNumber"
            rules={{ required: "false" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Phone number (Optional)"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ? value : ""}
              />
            )}
          />
        </View>
        <View className="mt-4">
          <ConfirmButton text="Confirm" onPress={handleSubmit(onSubmit)} icon />
        </View>
      </View>
    </View>
  );
};

export default ProfilePreferenceForm;
