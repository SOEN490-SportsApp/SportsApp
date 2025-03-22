import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { IconPlacement } from '@/utils/constants/enums';
import themeColors from '@/utils/constants/colors';
import { hs, vs, mhs } from '@/utils/helpers/uiScaler';

interface CustomButtonProps {
  icon: React.ReactNode | null;
  text: string;
  iconPlacement: IconPlacement | null;
  onPress: () => void;
}

const ConfirmButton: React.FC<CustomButtonProps> = ({ icon, text, onPress, iconPlacement }) => {
  return (
    <TouchableOpacity
    testID="confirmButton"
      onPress={onPress}
      style={styles.button}
    >
      <View style={styles.content}>
        {iconPlacement === IconPlacement.left && icon}
        <Text style={styles.text}>{text}</Text>
        {iconPlacement === IconPlacement.right && icon}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: themeColors.button.primaryBackground,
    height: vs(15),
    borderRadius: mhs(25),
    alignItems: 'center',
    justifyContent: "center",
    marginBottom: vs(16),
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: vs(2) },
    shadowOpacity: 0.25,
    shadowRadius: hs(4),
    minHeight: 40,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: vs(12),
    color: themeColors.text.light,
  },
});

export default ConfirmButton;
