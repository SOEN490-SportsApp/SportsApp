import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { useWebSocket } from "./webSocketProvider"; // Adjust the path as needed

const ChatComponent: React.FC = () => {
    const { sendMessage, messages } = useWebSocket();
    const [message, setMessage] = useState("");

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>WebSocket Chat</Text>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text>{item}</Text>}
            />
            <TextInput
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
                value={message}
                onChangeText={setMessage}
            />
            <Button title="Send" onPress={() => sendMessage("/app/message", message)} />
        </View>
    );
};

export default ChatComponent;