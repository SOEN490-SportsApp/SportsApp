import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { deleteUser } from '@/services/authService';
import { useSelector } from 'react-redux';
import { selectUser } from '@/state/user/userSlice';
import { useTranslation } from 'react-i18next';

export default function DeleteAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const user = useSelector(selectUser);
  const userId = user.id;

  const handleDeleteAccount = async () => {
    Alert.alert(
      t('delete_account_page.are_you_sure'),
      t('delete_account_page.delete_warning_1'),
      [
        { text: t('delete_account_page.cancel_button'), style: "cancel" },
        {
          text: t('delete_account_page.delete_button'),
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteUser(userId);
              Alert.alert(t('delete_account_page.deleted'), t('delete_account_page.account_deleted'));
              router.replace("/auth/login");
            } catch (error: any) {
              if (error.message.includes("already registered")) {
                Alert.alert(t('delete_account_page.error'), t('delete_account_page.delete_failed'));
              } else {
                Alert.alert(t('delete_account_page.error'), t('delete_account_page.unexpected_error'));
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
      <Text style={styles.header}>{t('delete_account_page.delete_your_account')}</Text>
      <Text style={styles.description}>
        {t('delete_account_page.delete_warning_2')}
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
            <Text style={styles.deleteButtonText}>{t('delete_account_page.delete_my_account')}</Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>{t('delete_account_page.cancel_button')}</Text>
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


