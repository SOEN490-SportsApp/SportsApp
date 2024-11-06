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
      className="p-5 rounded-3xl items-center mb-4 shadow-slate-500" 
      onPress={onPress} 
      style={{ backgroundColor: '#0C9E04' }}
    >
      <View className="flex-row items-center">
        {icon}
        <Text className="font-bold ml-2" style={{fontSize: 20, color: '#fff'}}>{text}</Text>
        </View>
    </TouchableOpacity>
  );
};

export default ConfirmButton;
