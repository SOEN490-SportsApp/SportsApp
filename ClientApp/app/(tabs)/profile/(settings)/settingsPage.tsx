import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import themeColors from "@/utils/constants/colors";
import { hs, vs, mvs, mhs } from "@/utils/helpers/uiScaler";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/services/authService";
import QR from "@/components/QR/QR";
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';

const settingsPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const user = useSelector((state: { user: any }) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const handleLogout = () => {
    logoutUser(dispatch);
    router.replace("/auth/login");
  };
  
  const router = useRouter();
  const handleForm = async () => {
    await WebBrowser.openBrowserAsync('https://forms.gle/PMPQGNNAh6AuEZUk6');
  }

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
          <Text style={styles.text}>{t('settings_page.share_profile')}</Text>
        </TouchableOpacity>

        <QR
          id={user.id}
          isVisible={modalVisible}
          setIsVisible={setModalVisible}
          isProfile={true}
        />

        {/* Notification Settings */}
        <TouchableOpacity style={styles.option} onPress={() => router.push('/(tabs)/profile/(settings)/notificationsPage')}>
          <Ionicons name="notifications-outline" size={mvs(24)} color="black" style={styles.icon} />
          <Text style={styles.text}>{t('settings_page.notification_settings')}</Text>
        </TouchableOpacity>

        {/* Language Option */}
        <TouchableOpacity style={styles.option} onPress={() => router.push('/(tabs)/profile/(settings)/languagePage')}>
          <Ionicons name="language-outline" size={mvs(24)} color="black" style={styles.icon} />
          <Text style={styles.text}>{t('settings_page.language')}</Text>
        </TouchableOpacity>
        {/* Submit feedback*/}
        <TouchableOpacity
          style={styles.option}
          onPress={handleForm}
        >
          <Ionicons
            name="chatbox-ellipses-outline"
            size={mvs(24)}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.text}>{t('settings_page.submit_feedback')}</Text>
        </TouchableOpacity>
        {/* Help */}
        <TouchableOpacity style={styles.option} onPress={() => router.push('/(tabs)/profile/(settings)/helpPage')}>
          <Ionicons name="help-circle-outline" size={mvs(24)} color="black" style={styles.icon} />
          <Text style={styles.text}>{t('settings_page.help')}</Text>
        </TouchableOpacity>
        {/* Log out */}
        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={mvs(24)} color="black" style={styles.icon} />
          <Text style={styles.text}>{t('settings_page.logout')}</Text>
        </TouchableOpacity>
         {/* Delete Account */}
        <TouchableOpacity style={[styles.option, styles.deleteOption]} onPress={() => router.push('/(tabs)/profile/(settings)/deleteAccountPage')}>
          <Ionicons name="trash-outline" size={mvs(24)} color="red" style={styles.icon} />
          <Text style={[styles.text, styles.deleteText]}>{t('settings_page.delete_account')}</Text>
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
    flexDirection: "row",
    alignItems: "center",
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
  deleteOption: {},
  deleteText: {
    color: "red",
  },
});

export default settingsPage;
