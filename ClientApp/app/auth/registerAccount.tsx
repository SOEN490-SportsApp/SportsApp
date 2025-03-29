import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Linking, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { IconPlacement } from '@/utils/constants/enums';
import { hs, mhs, mvs, vs } from "@/utils/helpers/uiScaler";
import { registerUser } from "@/services/authService";
import ConfirmButton from "@/components/Helper Components/ConfirmButton";
import Checkbox from 'expo-checkbox';
import themeColors from "@/utils/constants/colors";
import { useUpdateUserToStore } from "@/state/user/actions";
import { useTranslation } from 'react-i18next';

interface RegisterAccountPageFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const RegisterAccountPage: React.FC = () => {
  const [userID, setUserID] = useState("");
  const router = useRouter();
  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<RegisterAccountPageFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [hasViewedTerms, setHasViewedTerms] = useState(false);

  const onSubmit = async (data: RegisterAccountPageFormData) => {
    if (data.password !== data.confirmPassword) return Alert.alert(t('register.password_mismatch_1'), t('register.password_mismatch_2'));
    if (!data.agreeToTerms) return Alert.alert("", t('register.must_agree_terms'));
    try{
      const response = await registerUser(data.email, data.username, data.password);
      setUserID(response.data.id);
      Alert.alert(t('register.account_created'), `${t('register.check_email_1')} ${data.email} ${t('register.check_email_2')}`)
      router.push('/auth/login');
    } catch (error: any){
      Alert.alert(t('register.error'), t('register.fail_create_account'));
      console.error(`${t('register.fail_create_account')}: ${error}. ${error.message}`);
    }
  };  

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>{t('register.title')}</Text>

        <View style={{height: mvs(80)}} />

        {/* Username Field */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="account" size={mvs(20)} color="#aaa" />
          <Controller
            control={control}
            name="username"
            rules={{ required: t('register.username_required') }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder={t('register.username_placeholder')}
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
              required: t('register.email_required'),
              pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: "Invalid email" }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder={t('register.email_placeholder')}
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
            rules={{ required: t('register.password_required'), minLength: { value: 6, message: t('register.minimum_characters') } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={t('register.password_placeholder')}
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
            rules={{ required: t('register.confirm_email_required') }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={t('register.confirm_password_placeholder')}
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
            style={[
              { height: mvs(15), width: mvs(15) },
              !hasViewedTerms && { opacity: 0.5 },
            ]}

            testID="agreeToTermsCheckbox"
            value={watch("agreeToTerms")}
            onValueChange={(value) => setValue("agreeToTerms", value)}
            disabled={!hasViewedTerms}
          />
          <Text style={styles.termsText}>
            {t('register.by_continuing_1')}{" "}
            <Text style={styles.linkText} onPress={() => Linking.openURL('https://www.termsfeed.com/live/d818d293-3b1e-4b74-9ebd-d40a6852aa93')}>
              {t('register.by_continuing_2')}
            </Text>{" "}
            {t('register.by_continuing_3')}{" "}
            <Text style={styles.linkText} onPress={() => setIsTermsModalVisible(true)}>
              {t('register.by_continuing_4')}
            </Text>
          </Text>
        </View>
        
        <View style={{height: vs(60)}} />

        {/* Confirm Button */}
        <ConfirmButton
          icon={<MaterialCommunityIcons name="login" size={25} color="#fff" />}
          text={t('register.register_button')}
          onPress={handleSubmit(onSubmit)}
          iconPlacement={IconPlacement.left}
        />
     
      </View>

      {/* Back to Login */}
      <View style={styles.loginContainer}>
        <TouchableOpacity onPress={() => router.replace("/auth/login")} testID="account-already-created">
          <Text style={styles.loginText}>
            {t('register.already_have_account')}{" "}
            <Text style={styles.loginNowText}>{t('register.login')}</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {isTermsModalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('register.terms_of_use_title')}</Text>
            <View
              style={styles.modalScrollContainer}
              onLayout={(e) => {
              }}
            >
              <ScrollView
                style={styles.modalScroll}
                onScroll={({ nativeEvent }) => {
                  const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                  const isAtBottom =
                    layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
                  if (isAtBottom) setHasScrolledToBottom(true);
                }}
                scrollEventThrottle={16}
              >
                <Text style={styles.modalText}>{t('register.terms_text')}</Text>
              </ScrollView>
            </View>
            <TouchableOpacity
              onPress={() => {
                setIsTermsModalVisible(false);
                setHasViewedTerms(true);
              }}
              disabled={!hasScrolledToBottom}
              style={[
                styles.modalCloseButton,
                !hasScrolledToBottom && styles.modalCloseButtonDisabled,
              ]}
            >
              <Text style={styles.modalCloseButtonText}>
                {t('register.close_terms')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    marginTop: vs(15),
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
    bottom: vs(30),
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
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    padding: hs(20),
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: hs(20),
    maxHeight: vs(500),
    width: '100%',
  },
  modalTitle: {
    fontSize: mhs(18),
    fontWeight: 'bold',
    marginBottom: vs(10),
  },
  modalScrollContainer: {
    maxHeight: vs(350),
  },
  modalScroll: {
    paddingBottom: vs(10),
  },
  modalText: {
    fontSize: mhs(13),
    color: themeColors.text.dark,
  },
  modalCloseButton: {
    marginTop: vs(12),
    backgroundColor: themeColors.primary,
    paddingVertical: vs(10),
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonDisabled: {
    backgroundColor: themeColors.text.grey,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: mhs(14),
  },  
});