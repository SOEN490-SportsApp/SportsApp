import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
    marginVertical: 2,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  text: {
    marginHorizontal: 10,
    color: 'black',
  },
});

export default AuthenticationDivider;
