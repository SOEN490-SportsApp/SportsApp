import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const router = useRouter();

  return (
    <View>
      <Text>Login Page</Text>
      <Text>Click the following button to start the registration process</Text>
      <Button title="Register" onPress={() => router.push('/auth/register')} />
    </View>
  );
};

export default LoginScreen;
