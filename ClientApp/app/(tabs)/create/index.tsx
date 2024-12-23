import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  StatusBar,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import themeColors from '@/utils/constants/colors';
import { hs, vs, mhs, mvs } from '@/utils/helpers/uiScaler';
import { useRouter } from 'expo-router';

const sports = ['Soccer', 'Basketball', 'Tennis', 'Swimming', 'Running', 'Football', 'Rugby'];

const Create = () => {
  const [eventType, setEventType] = useState('public');
  const [sportType, setSportType] = useState('');
  const [isSportTypeModalVisible, setSportTypeModalVisible] = useState(false);
  const [minParticipants, setMinParticipants] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [eventFee, setEventFee] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const router = useRouter();

  const handleCreateEvent = async () => {
    const eventDetails = {
      eventType,
      sportType,
      participants: { min: minParticipants, max: maxParticipants },
      eventAddress,
      eventDate,
      startTime,
      endTime,
      eventFee,
      eventDescription,
    };

    console.log('Event Details:', eventDetails);

    // Placeholder for API request
    // Replace this with your actual API endpoint
    // const response = await axiosInstance.post('/events/create', eventDetails);
    // console.log('API Response:', response);

    router.replace('/(tabs)/home');
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
                  setSportType(item);
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
            <Button title="Close" onPress={() => setSportTypeModalVisible(false)} />
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { paddingTop: StatusBar.currentHeight || vs(24) }]}>
      <Text style={styles.header}>Create Event</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Event Type</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity onPress={() => setEventType('public')} style={styles.radioButton}>
            <Text style={[styles.radioText, eventType === 'public' && styles.selectedText]}>
              Public
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEventType('private')} style={styles.radioButton}>
            <Text style={[styles.radioText, eventType === 'private' && styles.selectedText]}>
              Private
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Sport Type</Text>
        <TouchableOpacity style={styles.input} onPress={() => setSportTypeModalVisible(true)}>
          <Text>{sportType || 'Select a Sport'}</Text>
        </TouchableOpacity>
        {renderSportTypeModal()}

        <Text style={styles.label}>Number of Participants</Text>
        <View style={styles.row}>
          <TextInput
            placeholder="Min"
            value={minParticipants}
            onChangeText={setMinParticipants}
            keyboardType="numeric"
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            placeholder="Max"
            value={maxParticipants}
            onChangeText={setMaxParticipants}
            keyboardType="numeric"
            style={[styles.input, styles.halfInput]}
          />
        </View>

        <Text style={styles.label}>Event Address</Text>
        <TextInput
          placeholder="Enter Address"
          value={eventAddress}
          onChangeText={setEventAddress}
          style={styles.input}
        />

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

        <Text style={styles.label}>Event Start Time</Text>
        <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.input}>
          <Text>{startTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowStartTimePicker(false);
              if (selectedTime) setStartTime(selectedTime);
            }}
          />
        )}

        <Text style={styles.label}>Event End Time</Text>
        <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.input}>
          <Text>{endTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowEndTimePicker(false);
              if (selectedTime) setEndTime(selectedTime);
            }}
          />
        )}

        <Text style={styles.label}>Event Fee</Text>
        <TextInput
          placeholder="Enter Fee"
          value={eventFee}
          onChangeText={setEventFee}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Event Description</Text>
        <TextInput
          placeholder="Enter Description"
          value={eventDescription}
          onChangeText={setEventDescription}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textArea]}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Create Event" onPress={handleCreateEvent} color={themeColors.primary} />
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
    paddingBottom: vs(20),
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(16),
  },
  radioButton: {
    padding: hs(8),
    borderWidth: 1,
    borderRadius: mhs(8),
    borderColor: themeColors.border.light,
  },
  radioText: {
    fontSize: mhs(14),
    color: themeColors.text.dark,
  },
  selectedText: {
    fontWeight: 'bold',
    color: themeColors.primary,
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
});

export default Create;
