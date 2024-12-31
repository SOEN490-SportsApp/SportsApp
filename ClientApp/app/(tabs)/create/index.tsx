import React, { useState } from 'react';
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
} from 'react-native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import ConfirmButton from '@/components/ConfirmButton';
import { IconPlacement } from '@/utils/constants/enums';
import themeColors from '@/utils/constants/colors';
import { hs, vs, mhs } from '@/utils/helpers/uiScaler';
import { createEvent } from '@/services/eventService';
import { useSelector } from 'react-redux';
import supportedSports from '@/utils/constants/supportedSports';

const Create = () => {
  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<EventFormData>({
    defaultValues: {
      eventType: 'public',
    },
  });
  const router = useRouter();
  const [isSportTypeModalVisible, setSportTypeModalVisible] = useState(false);
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

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
  }

  const onSubmit = async (data: EventFormData) => {
    try {
      const eventRequest = {
        eventName: data.eventName,
        eventType: data.eventType,
        sportType: data.sportType,
        location: {
          name: data.locationName,
          streetNumber: '',
          streetName: '',
          city: data.city,
          province: data.province,
          country: data.country,
          postalCode: '',
          addressLine2: '',
          phoneNumber: '',
          latitude: '',
          longitude: '',
        },
        date: eventDate.toISOString().split('T')[0],
        duration: '',
        maxParticipants: data.maxParticipants,
        participants: [],
        createdBy: user.id,
        teams: [],
        cutOffTime: data.cutOffTime,
        description: data.description,
        isPrivate: data.eventType === 'private',
        whiteListedUsers: [],
        requiredSkillLevel: [],
      };

      await createEvent(eventRequest);

      reset({
        eventName: '',
        eventType: 'public',
        sportType: '',
        locationName: '',
        city: '',
        province: '',
        country: '',
        cutOffTime: '',
        description: '',
        maxParticipants: '',
      });
      setEventDate(new Date());
      setSuccessModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Error occurred while creating the event');
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
                  setValue('sportType', item.name);
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
            <TouchableOpacity onPress={() => setSportTypeModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const watch = useWatch({ control });

  return (
    <View style={[styles.container, { paddingTop: StatusBar.currentHeight || vs(24) }]}>
      <Text style={styles.header}>Create Event</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Event Name</Text>
        <Controller
          control={control}
          name="eventName"
          rules={{ required: 'Event Name is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Enter Event Name"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.eventName && <Text style={styles.errorText}>{errors.eventName.message}</Text>}

        <Text style={styles.label}>Event Type</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            onPress={() => setValue('eventType', 'public')}
            style={[
              styles.radioButton,
              watch.eventType === 'public' ? styles.radioButtonSelected : null,
            ]}
          >
            <Text
              style={[
                styles.radioText,
                watch.eventType === 'public' && styles.selectedText,
              ]}
            >
              Public
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setValue('eventType', 'private')}
            style={[
              styles.radioButton,
              watch.eventType === 'private' ? styles.radioButtonSelected : null,
            ]}
          >
            <Text
              style={[
                styles.radioText,
                watch.eventType === 'private' && styles.selectedText,
              ]}
            >
              Private
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Sport Type</Text>
        <TouchableOpacity style={styles.input} onPress={() => setSportTypeModalVisible(true)}>
          <Text>{watch.sportType || 'Select a Sport'}</Text>
        </TouchableOpacity>
        {renderSportTypeModal()}
        {errors.sportType && <Text style={styles.errorText}>{errors.sportType.message}</Text>}

        <Text style={styles.label}>Location</Text>
        <Controller
          control={control}
          name="locationName"
          rules={{ required: "Location Name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Location Name"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.locationName && typeof errors.locationName.message === 'string' && <Text style={styles.errorText}>{errors.locationName.message}</Text>}

        <Controller
          control={control}
          name="city"
          rules={{ required: "City is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="City"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.city && typeof errors.city.message === 'string' && <Text style={styles.errorText}>{errors.city.message}</Text>}

        <Controller
          control={control}
          name="province"
          rules={{ required: "Province is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Province"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.province && typeof errors.province.message === 'string' && <Text style={styles.errorText}>{errors.province.message}</Text>}

        <Controller
          control={control}
          name="country"
          rules={{ required: "Country is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Country"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.country && typeof errors.country.message === 'string' && <Text style={styles.errorText}>{errors.country.message}</Text>}

        <Text style={styles.label}>Event Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text>{eventDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={eventDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setEventDate(selectedDate);
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
              return !isNaN(number) && number > 0 || "Must be a positive number";
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Enter maximum participants"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
            />
          )}
        />

        <Text style={styles.label}>Cut Off Time</Text>
        <Controller
          control={control}
          name="cutOffTime"
          rules={{ required: "Cut Off Time is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Cut Off Time"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
            />
          )}
        />
        {errors.cutOffTime && typeof errors.cutOffTime.message === 'string' && (
          <Text style={styles.errorText}>{errors.cutOffTime.message}</Text>
        )}

        <Text style={styles.label}>Description</Text>
        <Controller
          control={control}
          name="description"
          rules={{ required: "Description is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Enter Description"
              style={[styles.input, styles.textArea]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={4}
            />
          )}
        />
        {errors.description && typeof errors.description.message === 'string' && (
          <Text style={styles.errorText}>{errors.description.message}</Text>
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
            <Text style={styles.successText}>🎉 Event Created Successfully! 🎉</Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={() => {
                setSuccessModalVisible(false);
                router.replace('/(tabs)/home');
              }}
            >
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background.light,
  },
  header: {
    fontSize: mhs(20),
    fontWeight: 'bold',
    color: themeColors.text.dark,
    textAlign: 'center',
    padding: hs(16),
    backgroundColor: themeColors.background.lightGrey,
  },
  scrollContent: {
    padding: hs(16),
  },
  label: {
    fontSize: mhs(16),
    fontWeight: '600',
    color: themeColors.text.dark,
    marginBottom: vs(8),
  },
  input: {
    backgroundColor: themeColors.background.lightGrey,
    borderRadius: mhs(8),
    padding: hs(12),
    fontSize: mhs(16),
    color: themeColors.text.dark,
    marginBottom: vs(12),
  },
  textArea: {
    height: vs(100),
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  selectedText: {
    color: themeColors.text.light,
    fontWeight: 'bold',
  },
  footer: {
    padding: hs(16),
    backgroundColor: themeColors.background.lightGrey,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: themeColors.background.light,
    padding: hs(16),
    borderRadius: mhs(8),
    alignItems: 'center',
  },
  flatListContainer: {
    alignItems: 'center',
  },
  scrollableList: {
    maxHeight: vs(200),
    width: '100%',
  },
  modalItem: {
    padding: hs(12),
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border.light,
    width: '90%',
    alignItems: 'center',
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: themeColors.text.error,
    fontSize: mhs(12),
    marginBottom: vs(8),
  },
  successModal: {
    backgroundColor: 'white',
    padding: hs(24),
    borderRadius: mhs(12),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successText: {
    fontSize: mhs(18),
    fontWeight: 'bold',
    color: themeColors.primary,
    textAlign: 'center',
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
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: mhs(16),
  },  
});

export default Create;
