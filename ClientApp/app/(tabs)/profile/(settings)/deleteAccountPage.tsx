import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { deleteUser } from '@/services/authService';
import { useSelector } from 'react-redux';
import { selectUser } from '@/state/user/userSlice';

export default function DeleteAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const user = useSelector(selectUser);
  const userId = user.id;

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Are you sure?",
      "This action will permanently delete your account and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteUser(userId);
              Alert.alert("Deleted", "Your account has been successfully deleted.");
              router.replace("/auth/login");
            } catch (error: any) {
              if (error.message.includes("already registered")) {
                Alert.alert("Error", "Account deletion was incomplete. Please contact support.");
              } else {
                Alert.alert("Error", "Something went wrong. Please try again.");
              }
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Delete Your Account</Text>
      <Text style={styles.description}>
        Deleting your account will remove all your data permanently. This action cannot be undone.
      </Text>
      
      <View style={styles.buttonContainer}>
        {/* Delete Button */}
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDeleteAccount}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.deleteButtonText}>Delete My Account</Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
  },
  deleteButton: {
    backgroundColor: "red",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});


