import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import axiosInstance from '@/api/axiosInstance';
import { useRouter } from 'expo-router';
import { AxiosError } from 'axios';

const EditProfile = () => {
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
  });

  const [loading, setLoading] = useState(false);

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get(`/user/2`); // Fetch profile data from the API
      setProfile(response.data); // Set the fetched data into state
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(`/user/2/profile`, { 
        name: profile.name,
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        gender: profile.gender,
        dob: profile.dob,
      });

      if (response.status === 200) {
        alert('Profile updated successfully');
        router.push('/(tabs)/profile'); 
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errorMessage = (error.response?.data as { message: string }).message || 'Unknown error';
        alert('Failed to update profile: ' + errorMessage);
      } else {
        alert('Failed to update profile: Unknown error');
      }
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false); 
    }
  };

  const isAxiosError = (error: unknown): error is AxiosError => {
    return (error as AxiosError).isAxiosError !== undefined;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header  */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSaveProfile} disabled={loading}>
            <Text style={styles.doneButton}>{loading ? 'Saving...' : 'Done'}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity>
            <Image
              style={styles.profileImage}
              source={{ uri: 'https://via.placeholder.com/150' }} 
            />
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={profile.username}
              onChangeText={(text) => setProfile({ ...profile, username: text })}
            />
          </View>

          <TouchableOpacity style={styles.skillButton}>
            <Text style={styles.skillButtonText}>Sports and Skills</Text>
          </TouchableOpacity>
        </View>

        {/* Private Information Section */}
        <View style={styles.privateInfoSection}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Gender</Text>
            <TextInput
              style={styles.input}
              placeholder="Gender"
              value={profile.gender}
              onChangeText={(text) => setProfile({ ...profile, gender: text })}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              placeholder="Date of Birth"
              value={profile.dob}
              onChangeText={(text) => setProfile({ ...profile, dob: text })}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  cancelButton: {
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  doneButton: {
    color: '#007AFF',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  changePhotoText: {
    color: '#007AFF',
    marginTop: 8,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    color: '#4A4A4A',
    marginRight: 8,
    flex: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1',
    paddingBottom: 8,
    marginBottom: 16,
    flex: 2,
  },
  skillButton: {
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1',
    paddingBottom: 8,
    marginBottom: 16,
  },
  skillButtonText: {
    color: '#007AFF',
  },
  privateInfoSection: {
    marginTop: 24,
  },
});

export default EditProfile;


import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import axiosInstance from '@/api/axiosInstance';
import { useRouter } from 'expo-router';
import { AxiosError } from 'axios';

interface Profile {
  name: string; 
  username: string;
  email: string;
  phone: string;
  gender: string;
  dob: string; 
}

const EditProfile : React.FC = () => {
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
  });

  const [loading, setLoading] = useState(false);

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get(`/user/2`); // Fetch profile data from the API
      setProfile(response.data); // Set the fetched data into state
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(`/user/2/profile`, { 
        name: profile.name,
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        gender: profile.gender,
        dob: profile.dob,
      });

      if (response.status === 200) {
        alert('Profile updated successfully');
        router.push('/(tabs)/profile'); 
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errorMessage = (error.response?.data as { message: string }).message || 'Unknown error';
        alert('Failed to update profile: ' + errorMessage);
      } else {
        alert('Failed to update profile: Unknown error');
      }
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false); 
    }
  };

  const isAxiosError = (error: unknown): error is AxiosError => {
    return (error as AxiosError).isAxiosError !== undefined;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header  */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSaveProfile} disabled={loading}>
            <Text style={styles.doneButton}>{loading ? 'Saving...' : 'Done'}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity>
            <Image
              style={styles.profileImage}
              source={{ uri: 'https://via.placeholder.com/150' }} 
            />
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={profile.username}
              onChangeText={(text) => setProfile({ ...profile, username: text })}
            />
          </View>

          <TouchableOpacity style={styles.skillButton}>
            <Text style={styles.skillButtonText}>Sports and Skills</Text>
          </TouchableOpacity>
        </View>

        {/* Private Information Section */}
        <View style={styles.privateInfoSection}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Gender</Text>
            <TextInput
              style={styles.input}
              placeholder="Gender"
              value={profile.gender}
              onChangeText={(text) => setProfile({ ...profile, gender: text })}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              placeholder="Date of Birth"
              value={profile.dob}
              onChangeText={(text) => setProfile({ ...profile, dob: text })}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  cancelButton: {
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  doneButton: {
    color: '#007AFF',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  changePhotoText: {
    color: '#007AFF',
    marginTop: 8,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    color: '#4A4A4A',
    marginRight: 8,
    flex: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1',
    paddingBottom: 8,
    marginBottom: 16,
    flex: 2,
  },
  skillButton: {
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1',
    paddingBottom: 8,
    marginBottom: 16,
  },
  skillButtonText: {
    color: '#007AFF',
  },
  privateInfoSection: {
    marginTop: 24,
  },
});

export default EditProfile;

