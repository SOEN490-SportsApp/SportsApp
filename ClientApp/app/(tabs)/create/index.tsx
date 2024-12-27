import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Modal,
  FlatList,
  StatusBar,
  Alert
} from 'react-native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import ConfirmButton from '@/components/ConfirmButton';
import { IconPlacement } from '@/utils/constants/enums';
import themeColors from '@/utils/constants/colors';
import { hs, vs, mhs, mvs } from '@/utils/helpers/uiScaler';
import { createEvent } from '@/services/eventService';

const sports = ['Soccer', 'Basketball', 'Tennis', 'Swimming', 'Running', 'Football', 'Rugby'];

const Create = () => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<EventFormData>();
  const router = useRouter();
  const [isSportTypeModalVisible, setSportTypeModalVisible] = useState(false);
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const createdBy = '67302d306f52646e079d1483';

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
    isPrivate: boolean;
  }

  interface EventRequest {
    eventName: string;
    eventType: string;
    sportType: string;
    location: {
      name: string;
      city: string;
      province: string;
      country: string;
    };
    date: string;
    createdBy: string;
    cutOffTime: string;
    description: string;
    isPrivate: boolean;
  }

  const onSubmit = async (data: EventFormData) => {
    const eventRequest: EventRequest = {
      ...data,
      location: {
        name: data.locationName,
        city: data.city,
        province: data.province,
        country: data.country,
      },
      date: eventDate.toISOString().split('T')[0],
      createdBy,
    };

    try {
      await createEvent(eventRequest);
      Alert.alert('Success', 'Event created successfully');
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
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
            data={sports}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setValue('sportType', item);
                  setSportTypeModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
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
          rules={{ required: "Event Name is required" }}
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
        {errors.eventName && typeof errors.eventName.message === 'string' && <Text style={styles.errorText}>{errors.eventName.message}</Text>}

        <Text style={styles.label}>Event Type</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            onPress={() => setValue('eventType', 'public')}
            style={[
              styles.radioButton,
              useWatch({ control, name: 'eventType' }) === 'public' ? styles.radioButtonSelected : null,
            ]}
          >
            <Text
              style={[
                styles.radioText,
                useWatch({ control, name: 'eventType' }) === 'public' && styles.selectedText,
              ]}
            >
              Public
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setValue('eventType', 'private')}
            style={[
              styles.radioButton,
              useWatch({ control, name: 'eventType' }) === 'private' && styles.radioButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.radioText,
                useWatch({ control, name: 'eventType' }) === 'private' && styles.selectedText,
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
        {errors.sportType && typeof errors.sportType.message === 'string' && <Text style={styles.errorText}>{errors.sportType.message}</Text>}

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

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Private Event</Text>
          <Controller
            control={control}
            name="isPrivate"
            render={({ field: { onChange, value } }) => (
              <Switch
                value={value}
                onValueChange={onChange}
              />
            )}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <ConfirmButton
          text="CREATE EVENT"
          onPress={handleSubmit(onSubmit)}
          icon={null}
          iconPlacement={IconPlacement.left}
        />
      </View>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(16),
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
});

export default Create;
