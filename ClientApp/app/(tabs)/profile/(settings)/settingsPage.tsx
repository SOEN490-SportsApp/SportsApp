import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import themeColors from "@/utils/constants/colors";
import { hs, vs, mvs, mhs } from "@/utils/helpers/uiScaler";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/services/authService';
import QRCode from 'react-native-qrcode-svg'
import * as Linking from "expo-linking";

const settingsPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [canOpenProfile, setCanOpenProfile] = useState(false)
  const user = useSelector((state: { user: any }) => state.user);
  const logo = require("@/assets/images/sporta_logo.png");
  const dispatch = useDispatch();
  const handleLogout = () => {
    logoutUser(dispatch);
    router.replace('/auth/login');
  };

  const router = useRouter();
  useEffect(() => {
    Linking.canOpenURL("myapp://").then(result => setCanOpenProfile(true))
  },[])

  const userURL = `myapp://events/${user.id}`

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity
          style={styles.option}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons
            name="qr-code-outline"
            size={mvs(24)}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.text}>Show QR Code</Text>
        <TouchableOpacity onPress={() => Linking.openURL("myapp://events/67a2c78b6cb4b06b5018d1dd")}>
          <Text>Redirect me</Text>
        </TouchableOpacity>
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <QRCode
                  value={`myapp://events/${user.id}`}
                  size={250}
                  logo={logo}
                />
                <View style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Share your profile with friends</Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>


        {/* Notification Settings */}
        <TouchableOpacity style={styles.option} onPress={() => router.push('/(tabs)/profile/(settings)/notificationsPage')}>
          <Ionicons name="notifications-outline" size={mvs(24)} color="black" style={styles.icon} />
          <Text style={styles.text}>Notification Settings</Text>
        </TouchableOpacity>

        {/* Language Option */}
        <TouchableOpacity style={styles.option} onPress={() => router.push('/(tabs)/profile/(settings)/languagePage')}>
          <Ionicons name="language-outline" size={mvs(24)} color="black" style={styles.icon} />
          <Text style={styles.text}>Language</Text>
        </TouchableOpacity>

        {/* Help */}
        <TouchableOpacity style={styles.option} onPress={() => router.push('/(tabs)/profile/(settings)/helpPage')}>
          <Ionicons name="help-circle-outline" size={mvs(24)} color="black" style={styles.icon} />
          <Text style={styles.text}>Help</Text>
        </TouchableOpacity>
         {/* Delete Account */}
        <TouchableOpacity style={[styles.option, styles.deleteOption]} onPress={() => router.push('/(tabs)/profile/(settings)/deleteAccountPage')}>
          <Ionicons name="trash-outline" size={mvs(24)} color="red" style={styles.icon} />
          <Text style={[styles.text, styles.deleteText]}>Delete Account</Text>
        </TouchableOpacity>
        {/* Log out */}
        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={mvs(24)} color="black" style={styles.icon} />
          <Text style={styles.text}>Log out</Text>
        </TouchableOpacity>
          
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background.light,
  },
  content: {
    paddingHorizontal: hs(16),
    paddingBottom: vs(80), // Space for the fixed footer
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(16),
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border.light,
  },
  icon: {
    marginRight: hs(16),
  },
  text: {
    fontSize: mhs(16),
    color: themeColors.text.dark,
  },
  deleteOption: {
 
  },
  deleteText: {
    color: 'red', 
  },
});

export default settingsPage;
