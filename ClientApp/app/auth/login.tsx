import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const router = useRouter();
  const handleLogin = () => {
    // Implement your login logic here
    // If login is successful, navigate to the Home screen
    router.push('/tabs');
  };
  return (
    <View className="flex-1 justify-center items-center px-5">
      <Text className="text-center mb-2 text-lg font-semibold">Login Page</Text>
      <Text className="text-center mb-4">Click the following button to start the registration process</Text>
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => router.push('/auth/register')} />
    </View>
  );
};

export default LoginScreen;
