import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { IconPlacement } from '@/utils/constants/enums';
import themeColors from '@/utils/constants/colors';

interface CustomButtonProps {
  icon: React.ReactNode | null;
  text: string;
  iconPlacement: IconPlacement | null;
  onPress: () => void;
}

const ConfirmButton: React.FC<CustomButtonProps> = ({ icon, text, onPress, iconPlacement }) => {
  return (
    <TouchableOpacity
      className="p-5 rounded-3xl items-center mb-4 shadow-slate-500"
      onPress={onPress}
      style={{ backgroundColor: themeColors.button.primaryBackground }}
    >
      <View className="flex-row items-center">
        {iconPlacement === IconPlacement.left && icon}
        <Text className="font-bold ml-2" style={{ fontSize: 20, color: '#fff' }}>{text}</Text>
        {iconPlacement === IconPlacement.right && icon}
      </View>
    </TouchableOpacity>
  );
};

export default ConfirmButton;
