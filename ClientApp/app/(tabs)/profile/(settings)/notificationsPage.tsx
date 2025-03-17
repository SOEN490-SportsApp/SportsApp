import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import themeColors from "@/utils/constants/colors";
import { hs, vs, mvs, mhs } from "@/utils/helpers/uiScaler";
import { useTranslation } from 'react-i18next';

const notificationsPage: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const { t } = useTranslation();

  const toggleMute = () => {
    setIsMuted((prevState) => !prevState);
  };

  return (
    <View style={styles.container}>
      <View style={styles.option}>
        <Text style={styles.text}>{t('notifications_page.mute_all')}</Text>
        <Switch
          trackColor={{ false: themeColors.border.light, true: themeColors.primary }}
          thumbColor={isMuted ? themeColors.text.light : themeColors.text.light}
          ios_backgroundColor={themeColors.border.light}
          onValueChange={toggleMute}
          value={isMuted}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background.light,
    paddingHorizontal: hs(16),
    paddingTop: vs(16),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: themeColors.background.lightGrey,
    padding: hs(16),
    borderRadius: mhs(8),
  },
  text: {
    fontSize: mhs(16),
    color: themeColors.text.dark,
  },
});

export default notificationsPage;
