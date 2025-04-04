import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ConfirmButton from "@/components/Helper Components/ConfirmButton";
import themeColors from "@/utils/constants/colors";
import { IconPlacement } from "@/utils/constants/enums";
import { hs, vs, mvs, mhs } from "@/utils/helpers/uiScaler";
import { loginUser } from "@/services/authService";
import { useUpdateUserToStore } from '@/state/user/actions';
import { getUserById } from "@/state/user/api";
import { useTranslation } from 'react-i18next';

interface LoginPageFormData {
  identifier: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const updateUserToStore = useUpdateUserToStore();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginPageFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const onSubmit = async (data: LoginPageFormData) => {
    try {
        const res = await loginUser(data.identifier, data.password);
        await updateUserToStore(res.userID);
        const response = await getUserById(res.userID);
        const { firstName, lastName } = response.profile;
        if (firstName === '' && lastName === '') {
            router.push({ pathname: '/auth/registerProfile', params: { userID: res.userID } });
        } else {
            router.replace('/(tabs)/home');
        }
    } catch (error: any) {
        console.log(error);

        // Check for specific error message from the backend
        if (error.message === t('login.invalid_credentials')) {
            Alert.alert(t('login.login_failed'), error.message);
        } else {
            Alert.alert(t('login.error_1'), t('login.error_2'));
        }
    }
};
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/sporta_logo.png")}
              style={styles.logo}
            />
            <Text style={styles.slogan}>{t('login.slogan')}</Text>
            <Text style={styles.joinText}>
            {t('login.join')} <Text style={styles.sportaText}>Sporta</Text>
            </Text>
          </View>

        <View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email" size={mvs(20)} color="#aaa" />
            <Controller
              control={control}
              name="identifier"
              rules={{
                required: t('login.email_username_required'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder={t('login.email_placeholder')}
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
                required: t('login.password_required'),
                minLength: { value: 6, message: t('login.minimum_characters') },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder={t('login.password_placeholder')}
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

          <TouchableOpacity onPress={() => router.push('/auth/resetPassword')}>
            <Text style={styles.forgotPasswordText} testID="forgot-password">
              {t('login.forgot_password')}
            </Text>
          </TouchableOpacity>
          <View style={{ height: vs(64) }} />

            <ConfirmButton
              icon={<MaterialCommunityIcons name="login" size={mvs(24)} color="#fff" />}
              text={t('login.title')}
              onPress={handleSubmit(onSubmit)}
              iconPlacement={IconPlacement.left}
            />
          </View>
        </View>

        <View style={styles.registerContainer}>
          <TouchableOpacity
            onPress={() => router.replace("/auth/registerAccount")}
          >
            <Text style={styles.registerText}>
              {t('login.first_time_1')}{" "}
              <Text style={styles.registerNowText}>{t('login.first_time_2')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    bottom: vs(30),
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
