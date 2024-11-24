import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { useRouter } from "expo-router";
import ConfirmButton from "@/components/ConfirmButton";
import AuthenticationDivider from "@/components/AuthenticationDivider";
import { IconPlacement } from '@/utils/constants/enums';
import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/utils/api/endpoints";
import { hs, mhs, mvs, vs } from "@/utils/helpers/uiScaler";
import themeColors from "@/utils/constants/colors";

interface RegisterAccountPageFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// const [userINFO, setUserINFO] = useState({id: 0, email: "", username: ""});

const RegisterAccountPage: React.FC = () => {
  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<RegisterAccountPageFormData>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  interface RegisteredUserResponse {
    success: boolean; 
    data?: {id: string, email: string, username: string}; // this might be an issue
    error?: string;
  }

  const onSubmit = async (data: RegisterAccountPageFormData) => {
    if (!data.agreeToTerms) {Alert.alert("", "You must agree to the terms to continue."); return;}
    if (data.password !== data.confirmPassword) {Alert.alert("Oh oh!", "Passwords do not match.");return;}


    // make the registration api call
    const registrationResult = await registerUser({
      email: data.email,
      username: data.username,
      password: data.password,
    });

    if (registrationResult.success) {
      Alert.alert("Success", "Account created successfully!");
      console.log("User info: ", registrationResult.data);
      router.push('/auth/registerProfile');
    } else {
      Alert.alert("Error", "Failed to create account.");
    }
  };

  const registerUser = async (data: any): Promise<RegisteredUserResponse> => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, data);
      if (response.status === 201 || response.status === 200) {

        console.log("User created successfully:", response.data);
        return {
          success: true,
          data: {
            id: response.data.id,
            email: response.data.email,
            username: response.data.username,
          },
          error: "No Error!",
        };
      } else {
        return { success: false, error: response.data.error || "Failed to create account." };
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error instanceof Error) {
        return { success: false, error: error.message }
      } 
      
      return { success: false, error: "Failed to create account." }; //this should not be needed
      
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>Create an Account</Text>

        <View style={{height: mvs(80)}} />

        {/* Username Field */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="account" size={mvs(20)} color="#aaa" />
          <Controller
            control={control}
            name="username"
            rules={{ required: "Username is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>
        {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

        <View style={styles.spacing} />

        {/* Email Field */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email" size={mvs(20)} color="#aaa" />
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: "Invalid email" }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
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
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <View style={styles.spacing} />

        {/* Password Field */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock" size={20} color="#aaa" />
          <Controller
            control={control}
            name="password"
            rules={{ required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(prevState => !prevState)}
                  style={styles.eyeIcon}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye" : "eye-off"}
                    size={mvs(20)}
                    color="#aaa"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <View style={styles.spacing} />

        {/* Confirm Password Field */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock" size={mvs(20)} color="#aaa" />
          <Controller
            control={control}
            name="confirmPassword"
            rules={{ required: "Please confirm your password" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                  style={styles.eyeIcon}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye" : "eye-off"}
                    size={mvs(20)}
                    color="#aaa"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

        <View style={{ height: vs(4) }} />

        {/* Terms and Conditions Checkbox */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            style={{height: mvs(15), width: mvs(15)}}

            testID="agreeToTermsCheckbox"
            value={watch("agreeToTerms")}
            onValueChange={(value) => setValue("agreeToTerms", value)}
          />
          {/* TODO: Are we going to have terms? If so we need to write them up. */}
          <Text style={styles.termsText}>
            By continuing you accept our{" "}
            <Text style={styles.linkText}>Privacy Policy</Text> and <Text style={styles.linkText}>Terms of Use</Text>
          </Text>
        </View>

        <View style={{height: vs(60)}} />

        {/* Confirm Button */}
        <ConfirmButton
          icon={<MaterialCommunityIcons name="login" size={25} color="#fff" />}
          text="Sign Up"
          onPress={handleSubmit(onSubmit)}
          iconPlacement={IconPlacement.left}
        />

        <AuthenticationDivider text="Or" />
      </View>

      {/* Back to Login */}
      <View style={styles.loginContainer}>
        <TouchableOpacity onPress={() => router.replace("/auth/login")}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginNowText}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterAccountPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 0,
    justifyContent: 'space-between',
    backgroundColor: themeColors.background.light,
    height: "100%",
    minHeight: vs(700)
  },
  mainContent: {
    flex: 1,
    paddingTop: vs(120),
    paddingHorizontal: hs(48),
    paddingBottom: vs(32),
  },
  title: {
    fontSize: mvs(28),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.inputContainer.backgroundColor,
    borderRadius: 25,
    padding: hs(8),
    paddingLeft: hs(16),
    height: vs(52),
    minHeight: vs(48),
  },
  input: {
    flex: 1,
    marginLeft: hs(8),
    fontSize: mhs(15),
  },
  passwordContainer: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: hs(12),
  },
  errorText: {
    color: themeColors.text.error,
    fontSize: mhs(12),
    marginBottom: vs(8),
  },
  spacing: {
    height: mvs(8),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mvs(16),
  },
  termsText: {
    marginLeft: hs(8),
    color: themeColors.text.grey,
    fontSize: mvs(10),
  },
  linkText: {
    color: themeColors.text.link,
    textDecorationLine: 'underline',
  },
  loginContainer: {
    position: "absolute",
    bottom: vs(12),
    alignSelf: "center",
  },
  loginText: {
    fontSize: mhs(12),
    textAlign: "center",
    color: themeColors.text.grey,
  },
  loginNowText: {
    fontWeight: "bold",
    color: themeColors.primary,
  },

});
