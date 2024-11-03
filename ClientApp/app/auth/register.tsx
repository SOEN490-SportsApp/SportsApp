import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

const RegisterScreen = () => {
  const router = useRouter();

  return (
    <View>
      <Text>Register</Text>
      {/* Add login form here */}
      <Button title="Register" onPress={() => router.back()} />
    </View>
  );
};

export default RegisterScreen
;