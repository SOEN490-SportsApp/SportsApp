import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const notificationsPage: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted((prevState) => !prevState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <View style={styles.option}>
        <Text style={styles.text}>mute all</Text>
        <Switch
          trackColor={{ false: '#E0E0E0', true: '#0C9E04' }}
          thumbColor={isMuted ? '#FFFFFF' : '#FFFFFF'}
          ios_backgroundColor="#E0E0E0"
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
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
});

export default notificationsPage;
