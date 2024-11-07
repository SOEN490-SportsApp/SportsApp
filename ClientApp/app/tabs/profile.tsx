// app/profile.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';

const ProfileScreen = () => {
  return (
    <View className="flex-1 justify-center items-center px-5">
      <Text className="text-center mb-4 text-lg font-semibold text-black">Profile Page</Text>
      <Text className="mb-4 text-black">Name: John Doe</Text>
      <Text className="mb-4 text-black">Email: johndoe@example.com</Text>
      <Button title="Edit Profile" onPress={() => console.log('Navigate to Edit Profile')} />
    </View>
  );
};

export default ProfileScreen;
