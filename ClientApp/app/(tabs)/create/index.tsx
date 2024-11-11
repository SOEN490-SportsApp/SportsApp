import axiosInstance from '@/api/axiosInstance';
import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
const handleSubmit = async () => {{
  const response = await axiosInstance.get("user-service/user/673114e06f52646e079d1486");
  console.log('============================================');
  console.log(response);
}

}
const Create = () => {
  return (
    <View className="flex-1 justify-center items-center px-5">
      <Text className="text-center mb-4 text-lg font-semibold text-black">Add Page</Text>
      <TextInput
        placeholder="Search for a sport..."
        className="w-full p-4 border border-gray-300 rounded mb-4"
      />
      <Button title="Search" onPress={handleSubmit} />
    </View>
  );
};

export default Create;

