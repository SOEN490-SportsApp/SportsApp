import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const Create = () => {
  return (
    <View className="flex-1 justify-center items-center px-5">
      <Text className="text-center mb-4 text-lg font-semibold text-black">Add Page</Text>
      <TextInput
        placeholder="Search for a sport..."
        className="w-full p-4 border border-gray-300 rounded mb-4"
      />
      <Button title="Search" onPress={() => console.log('Search clicked')} />
    </View>
  );
};

export default Create;

