import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { hs, vs, mhs } from '@/utils/helpers/uiScaler';
import themeColors from '@/utils/constants/colors';

interface AuthenticationDividerProps {
  text: string;
}

const AuthenticationDivider: React.FC<AuthenticationDividerProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: vs(2),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  text: {
    marginHorizontal: hs(10),
    color: themeColors.text.dark,
    fontSize: mhs(14),
  },
});

export default AuthenticationDivider;
