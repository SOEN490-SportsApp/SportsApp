import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { Client } from "@stomp/stompjs";

const ChatComponent: React.FC<{ token: string }> = ({ token }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const client = new Client({
            brokerURL: "ws://localhost:8080/api/messaging-service/ws",
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onWebSocketError: (error) => console.error("WebSocket error:", error),
            onConnect: () => {
                setConnected(true);
                client.subscribe("/user/testReceiverId1/queue/messages", (message) => {
                    setMessages((prev) => [...prev, message.body]);
                });
            },
            onDisconnect: () => setConnected(false),
            debug: (msg) => console.log(msg),
            onStompError: (frame) => console.error("Broker error:", frame.body),
        });

        client.activate();


        return () => client.deactivate();
    }, [token]);

    return (
        <View style={{ padding: 20 }}>
            <Text>WebSocket Status: {connected ? "Connected" : "Disconnected"}</Text>
            {messages.map((msg, index) => (
                <Text key={index}>{msg}</Text>
            ))}
        </View>
    );
};

export default ChatComponent;