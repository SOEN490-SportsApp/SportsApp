import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ConfirmButton from "@/components/ConfirmButton";
import AuthenticationDivider from "@/components/AuthenticationDivider";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: LoginFormData) => {
    console.log("Login data:", data);
    router.push('/auth/profilePreferenceForm')
  };

  return (
    <View className="flex-1 justify-between p-5 bg-white pt-20 pr-12 pl-12 pb-8">
      <View className="items-center mb-5">
        {/* Logo Image */}
        <Image
          source={require("../../assets/images/sporta_logo.png")}
          className="w-24 h-24 rounded-full"
        />
        <Text className="text-2xl text-center mt-4">Connect, Compete, Conquer</Text>
        <Text className="text-2xl text-center font-bold mb-5">Join <Text className="color-[#0C9E04]">Sporta</Text></Text>
      </View>

      <View>
        {/* Email/Username Field */}
        <View className="flex-row items-center bg-gray-100 rounded-3xl p-2 pl-4 min-h-16">
          <MaterialCommunityIcons name="email" size={20} color="#aaa" />
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email or username is required"
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="flex-1 ml-2 text-lg h-full"
                placeholder="Email/username"
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
                <TouchableOpacity onPress={() => setShowPassword(prevState => !prevState)} className="absolute right-2">
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

        {/* Forgot Password Link */}
        <TouchableOpacity>
          <Text className="text-center text-blue-600 underline">Forgot your password?</Text>
        </TouchableOpacity>

        <View className="h-16" />

        {/* Login Button */}
        <ConfirmButton
          icon={<MaterialCommunityIcons name="login" size={25} color="#fff"  />}
          text="Login"
          onPress={handleSubmit(onSubmit)}
          iconDirection ={null}
        />

        <AuthenticationDivider text="Or" />

        {/* Social Login Buttons */}
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity className="flex-1 items-center border border-gray-400 rounded-lg p-2 mx-1">
            <Image
              source={require("../../assets/images/facebook_social.png")}
              className="w-6 h-6 rounded-full"
            />
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center border border-gray-400 rounded-lg p-2 mx-1">
            <Image
              source={require("../../assets/images/google_social.png")}
              className="w-6 h-6 rounded-full"
            />
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center border border-gray-400 rounded-lg p-2 mx-1">
            <Image
              source={require("../../assets/images/apple_social.png")}
              className="w-6 h-6 rounded-full"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Register Link */}
      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text className="text-center text-gray-600 mt-8">
          Is this your first time?{" "}
          <Text className="font-bold color-[#0C9E04]">Register Now</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
