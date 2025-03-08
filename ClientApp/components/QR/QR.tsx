import themeColors from "@/utils/constants/colors";
import { hs, mhs } from "@/utils/helpers/uiScaler";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Linking from "expo-linking";
import { deepLinks } from "@/utils/Deeplinks/Deeplinks";
import BottomModal from "../Helper Components/BottomModal";

interface QRProps {
  id: string;
  isVisible: boolean;
  isProfile: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const QR: React.FC<QRProps> = ({ id, isVisible, setIsVisible, isProfile }) => {
  const [canOpenLink, setCanOpenLink] = useState(false);

  useEffect(() => {
    Linking.canOpenURL("myapp://").then((result) => setCanOpenLink(true));
  }, []);
  const logo = require("@/assets/images/sporta_logo.png");
  const userURL = isProfile && id ? deepLinks.Profile.replace("{id}", id): deepLinks.Event.replace("{id}", id);
 
  return (
    <BottomModal isVisible={isVisible} setIsVisible={setIsVisible} height={undefined}>
      <QRCode value={userURL} size={250} logo={logo} testID="QRCode" />
            <View style={styles.closeButton}>
              <Text style={styles.closeButtonText}>
                Share your {isProfile ? "profile" : "event"} with friends
              </Text>
            </View>
    </BottomModal>
  );
};

export default QR;

const styles = StyleSheet.create({
  icon: {
    marginRight: hs(16),
  },
  text: {
    fontSize: mhs(16),
    color: themeColors.text.dark,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: themeColors.sportIcons.lightGrey,
    fontSize: 18,
  },
});
