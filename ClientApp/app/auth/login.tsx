import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ConfirmButton from "@/components/ConfirmButton";
import AuthenticationDivider from "@/components/AuthenticationDivider";
import themeColors from "@/utils/constants/colors";
import { IconPlacement } from "@/utils/constants/enums";
import { hs, vs, mvs, mhs } from "@/utils/helpers/uiScaler";

interface LoginPageFormData {
  identifier: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPageFormData>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: LoginPageFormData) => {
    router.push("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/sporta_logo.png")}
            style={styles.logo}
          />
          <Text style={styles.slogan}>Connect, Compete, Conquer</Text>
          <Text style={styles.joinText}>
            Join <Text style={styles.sportaText}>Sporta</Text>
          </Text>
        </View>

        <View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email" size={mvs(20)} color="#aaa" />
            <Controller
              control={control}
              name="identifier"
              rules={{
                required: "Email or username is required",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
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
          {errors.identifier && (
            <Text style={styles.errorText}>{errors.identifier.message}</Text>
          )}

          <View style={styles.spacing} />

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock" size={mvs(20)} color="#aaa" />
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              }}
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
                    onPress={() => setShowPassword((prev) => !prev)}
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
          {errors.password && (<Text style={styles.errorText}>{errors.password.message}</Text>)}

          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>
              Forgot your password?
            </Text>
          </TouchableOpacity>

          <View style={{ height: vs(64) }} />

          <ConfirmButton
            icon={<MaterialCommunityIcons name="login" size={mvs(24)} color="#fff" />}
            text="Login"
            onPress={handleSubmit(onSubmit)}
            iconPlacement={IconPlacement.left}
          />

          <AuthenticationDivider text="Or" />

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require("@/assets/images/facebook_social.png")}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require("@/assets/images/google_social.png")}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require("@/assets/images/apple_social.png")}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.registerContainer}>
        <TouchableOpacity
          onPress={() => router.replace("/auth/registerAccount")}
        >
          <Text style={styles.registerText}>
            Is this your first time?{" "}
            <Text style={styles.registerNowText}>Register Now</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: themeColors.background.light,
    height: "100%",
    minHeight: vs(700)
  },
  mainContent: {
    flex: 1,
    paddingTop: vs(80),
    paddingHorizontal: hs(48),
    paddingBottom: vs(32),
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: vs(20),
  },
  logo: {
    width: mhs(124),
    height: mhs(124),
  },
  slogan: {
    fontSize: mhs(20, 1.2),
    textAlign: "center",
  },
  joinText: {
    fontSize: mhs(24),
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: vs(20),
  },
  sportaText: {
    color: themeColors.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeColors.inputContainer.backgroundColor,
    borderRadius: 25,
    padding: hs(8),
    paddingLeft: hs(16),
    height: vs(52),
    minHeight: vs(48),
  },
  passwordContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginLeft: hs(8),
    fontSize: mhs(15),
  },
  errorText: {
    color: themeColors.text.error,
    fontSize: mhs(12),
    marginBottom: vs(8),
  },
  spacing: {
    height: mvs(8),
  },
  eyeIcon: {
    position: "absolute",
    right: hs(12),
  },
  forgotPasswordText: {
    textAlign: "center",
    color: themeColors.text.link,
    textDecorationLine: "underline",
    marginTop: vs(6),
  },
  socialButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: vs(16),
  },
  socialButton: {
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#cccccc",
    borderRadius: mhs(8),
    padding: hs(6),
    width: hs(80),
    minWidth: hs(50),
    minHeight: vs(30),
  },
  socialIcon: {
    width: vs(24),
    height: vs(24),
  },
  registerContainer: {
    position: "absolute",
    bottom: vs(12),
    alignSelf: "center",
  },
  registerText: {
    fontSize: mhs(12),
    textAlign: "center",
    color: themeColors.text.grey,
  },
  registerNowText: {
    fontWeight: "bold",
    color: themeColors.primary,
  },
});
