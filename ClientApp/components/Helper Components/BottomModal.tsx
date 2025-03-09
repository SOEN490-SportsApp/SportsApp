import themeColors from "@/utils/constants/colors";
import { hs, mhs, vs, mvs } from "@/utils/helpers/uiScaler";
import { useRouter } from "expo-router";
import React, { ReactNode, useEffect, useState } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from "react-native";

interface BottomModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode,
  height: number | undefined
}

const BottomModal: React.FC<BottomModalProps> = ({ isVisible, setIsVisible, children, height=vs(375)}) => {
 
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsVisible(false)} testID="modalOverlay">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {height: mvs(height)}]}>
            <TouchableWithoutFeedback>
            {children}
            </TouchableWithoutFeedback>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BottomModal;

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
    padding: 30,
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
