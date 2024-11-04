import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface CustomButtonProps {
  icon: React.ReactNode; 
  text: string;          
  onPress: () => void; 
}

const ConfirmButton: React.FC<CustomButtonProps> = ({ icon, text, onPress, }) => {
  return (
    <TouchableOpacity 
      className="p-6 rounded-full items-center mb-4 shadow-slate-500" 
      onPress={onPress} 
      style={{ backgroundColor: '#0C9E04' }}
    >
      <View className="flex-row items-center">
        {icon}
        <Text className="font-bold text-white text-2xl ml-2">{text}</Text>
        </View>
    </TouchableOpacity>
  );
};

export default ConfirmButton;
