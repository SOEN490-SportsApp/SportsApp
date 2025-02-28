import React from "react";
import { View, Text } from "react-native";

interface MessageProps {
    message: string;
    username: string;
}

const Message: React.FC<MessageProps> = ({ message, username} ) => {
    return (
        <View>
            <Text>
                {username}: {message}
            </Text>
        </View>
    );
};

export default Message;