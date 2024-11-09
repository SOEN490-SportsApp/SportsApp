import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

export enum IconDirection {
  left = "LEFT",
  right = "RIGHT"
}

interface CustomButtonProps {
  icon: React.ReactNode | null; 
  text: string;          
  onPress: () => void;
  iconDirection: IconDirection | null;
}

const ConfirmButton: React.FC<CustomButtonProps> = ({ icon, text, onPress, iconDirection }) => {
  return (
    <TouchableOpacity 
      className="p-5 rounded-3xl items-center mb-4 shadow-slate-500" 
      onPress={onPress} 
      style={{ backgroundColor: '#0C9E04' }}
    >
      <View className="flex-row items-center">
        {iconDirection === IconDirection.left && icon}
        <Text className="font-bold ml-2" style={{fontSize: 20, color: '#fff'}}>{text}</Text>
        {iconDirection === IconDirection.right && icon}
        </View>
    </TouchableOpacity>
  );
};

export default ConfirmButton;
