import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const TopBar = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.logoText}>Sporta</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity testID="search-icon" style={styles.iconButton}>
          <View style={styles.iconCircle}>
            <Icon name="search" type="font-awesome" color="#000" size={20} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  header1: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logoText: {
    color: '#0C9E04',
    fontSize: 28,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
