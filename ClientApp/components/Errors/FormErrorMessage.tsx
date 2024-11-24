import React from "react";
import { FieldError } from "react-hook-form";
import { Text, View } from "react-native";

interface ErrorMessageProps {
  error?: FieldError;
}

const FormErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null; // If there's no error, render nothing

  return (
    <View className="flex-col">
      <Text className="pl-4 text-red-500 text-xs">{error.message}</Text>
    </View>
  );
};

export default FormErrorMessage;
