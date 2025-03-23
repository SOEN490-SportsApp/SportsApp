import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import themeColors from '@/utils/constants/colors';
import { hs, vs, mhs } from '@/utils/helpers/uiScaler';

interface ClosedButtonProps {
  text: string;
}

const ClosedButton: React.FC<ClosedButtonProps> = ({ text }) => {
  return (
    <TouchableOpacity
    testID="closedButton"
      style={styles.button}
    >
      <View style={styles.content}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: themeColors.sportIcons.advanced,
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
    fontSize: vs(16),
    color: themeColors.text.light,
  },
});

export default ClosedButton;
