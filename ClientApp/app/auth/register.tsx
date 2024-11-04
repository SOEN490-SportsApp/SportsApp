import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { useRouter } from "expo-router";
import ConfirmButton from "@/components/ConfirmButton";
import AuthenticationDivider from "@/components/AuthenticationDivider";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
}

const Register: React.FC = () => {
  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<RegisterFormData>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);



  const onSubmit = (data: RegisterFormData) => {
    if (!data.agreeToTerms) {
      Alert.alert("", "You must agree to the terms to continue.");
      return;
    }
    // TODO: Logic when user registers
    router.back();
  };

  return (
    <View className="flex-1 justify-between p-5 bg-white pt-32 pr-12 pl-12 pb-8">
      <View>
        <Text className="text-lg text-center mb-2">Hey there,</Text>
        <Text className="text-2xl font-bold text-center mb-5">Create an Account</Text>

        <View className="h-24" />

        {/* First Name Field */}
        <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
          <MaterialCommunityIcons name="account" size={20} color="#aaa" />
          <Controller
            control={control}
            name="firstName"
            rules={{ required: "First name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="flex-1 ml-2 text-lg h-full"
                placeholder="First Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>
        {errors.firstName && <Text className="text-red-500 text-xs mb-2">{errors.firstName.message}</Text>}

        <View className="h-4" />

        {/* Last Name Field */}
        <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
          <MaterialCommunityIcons name="account" size={20} color="#aaa" />
          <Controller
            control={control}
            name="lastName"
            rules={{ required: "Last name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="flex-1 ml-2 text-lg h-full"
                placeholder="Last Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>
        {errors.lastName && <Text className="text-red-500 text-xs mb-2">{errors.lastName.message}</Text>}

        <View className="h-4" />

        {/* Username Field */}
        <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
          <MaterialCommunityIcons name="account" size={20} color="#aaa" />
          <Controller
            control={control}
            name="username"
            rules={{ required: "Username is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="flex-1 ml-2 text-lg h-full"
                placeholder="Username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>
        {errors.username && <Text className="text-red-500 text-xs mb-2">{errors.username.message}</Text>}

        <View className="h-4" />

        {/* Email Field */}
        <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
          <MaterialCommunityIcons name="email" size={20} color="#aaa" />
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: "Invalid email" }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="flex-1 ml-2 text-lg h-full"
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
        </View>
        {errors.email && <Text className="text-red-500 text-xs mb-2">{errors.email.message}</Text>}

        <View className="h-4" />

        {/* Password Field */}
        <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
          <MaterialCommunityIcons name="lock" size={20} color="#aaa" />
          <Controller
            control={control}
            name="password"
            rules={{ required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="flex-1">
                <TextInput
                  className="text-lg ml-2"
                  placeholder="Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => { setShowPassword(prevState => !prevState) }} className="absolute right-2">
                  <MaterialCommunityIcons
                    name={showPassword ? "eye" : "eye-off"}
                    size={24}
                    color="#aaa"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        {errors.password && <Text className="text-red-500 text-xs mb-2">{errors.password.message}</Text>}

        <View className="h-2" />

        {/* Terms and Conditions Checkbox */}
        <View className="flex-row items-center mb-4">
          <Checkbox
            value={watch("agreeToTerms")}
            onValueChange={(value) => setValue("agreeToTerms", value)}
          />
          {/* TODO: Are we going to have terms? If so we need to write them up. */}
          <Text className="ml-2 text-gray-600 text-xs">
            By continuing you accept our{" "}
            <Text className="text-blue-600 underline">Privacy Policy</Text> and <Text className="text-blue-600 underline">Terms of Use</Text>
          </Text>
        </View>

        <View className="h-12" />

        {/* Register Button */}
        <ConfirmButton
          icon={<MaterialCommunityIcons name="login" size={25} color="#fff" />}
          text="Sign Up"
          onPress={handleSubmit(onSubmit)}
        />

        <AuthenticationDivider text="Or"/>
      </View>

      {/* Back to Login */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text className="text-center text-gray-600">
          Already have an account?{" "}
          <Text className="font-bold" style={{ color: '#0C9E04' }}>Login</Text>
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default Register;
