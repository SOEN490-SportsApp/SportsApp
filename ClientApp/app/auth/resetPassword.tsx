import React, { useState } from "react";
import { hs, vs, mhs, windowHeight } from "@/utils/helpers/uiScaler";
import themeColors from "@/utils/constants/colors";
import { View, Text, TextInput, StyleSheet, Image, Alert } from "react-native";
import ConfirmButton from "@/components/Helper Components/ConfirmButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IconPlacement } from "@/utils/constants/enums";
import { resetPassword } from "@/services/authService";
import { useTranslation } from 'react-i18next';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const { t } = useTranslation();
  let regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const onSubmit = async () => {
    if (regex.test(email)) {
      setStatus("loading");
      try {
        const response = await resetPassword(email);
        if (response?.status === 200 || response?.status === 201) {
          setStatus("success");
        }
      } catch (err: any) {
        if (err?.status === "404") {
          console.log("here");
        }
        setStatus("idle");
        Alert.alert("Email not found.", "User with email does not exist. Please enter a valid email.");
        console.log(err);
      }
    } else {
      Alert.alert("Invalid Email", "Please enter a valid email.");
    }
  };

  const SuccessfulReset = () => (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        minHeight: "50%",
      }}
    >
      <View style={{ gap: 32 }}>
        <Text testID="success-message" style={styles.joinText}>
          Email submitted successfully!{" "}
          <Text style={styles.successText}>
            Check your inbox for reset instructions.
          </Text>
        </Text>
        <Text style={[styles.sportaText, styles.joinText]}>{email}</Text>
      </View>
    </View>
  );
  return (
    <View style={{ flexGrow: 1 }} className="bg-white">
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: vs(16),
          height: "100%",
        }}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/sporta_logo.png")}
            style={styles.logo}
          />
          <Text style={styles.joinText}>
            {t('reset_password.join')} <Text style={styles.sportaText}>Sporta</Text>
          </Text>
        </View>
        <View style={styles.emailSection}>
          {status === "success" ? (
            <View>
              <SuccessfulReset />
            </View>
          ) : (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "80%",
                  gap: 32,
                }}
              >
                <View>
                  <Text style={styles.slogan}>
                    {t('reset_password.enter_email')}
                  </Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    testID="email-input"
                    style={styles.input}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder={t('reset_password.email_placeholder')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>
          )}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View style={styles.submitButton}>
            {status === "success" ? (
              <Text></Text>
            ) : (
              <ConfirmButton
                text={status === "loading" ? "Loading..." : t('reset_password.send_email_button')}
                onPress={onSubmit}
                icon={
                  <MaterialCommunityIcons name="login" size={25} color="#fff" />
                }
                iconPlacement={IconPlacement.left}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
export default ResetPassword;

const styles = StyleSheet.create({
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
  },
  successText: {
    fontSize: mhs(16),
    textAlign: "center",
    color: themeColors.sportIcons.lightGrey,
  },
  sportaText: {
    color: themeColors.primary,
  },
  emailSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeColors.background.lightGrey,
    borderRadius: 24,
    padding: vs(8),
    paddingLeft: hs(16),
    minHeight: vs(64),
    marginVertical: vs(16),
    width: "100%",
  },
  input: {
    flex: 1, // Ensure the input fills the available space
    height: "100%", // Ensure the input takes up the full height of the container
    fontSize: mhs(16),
  },
  submitButton: {
    marginBottom: vs(64),
    width: "80%",
  },
  successIcon: {
    marginBottom: 20,
    textAlign: "center",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  flexDirectionRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
});
