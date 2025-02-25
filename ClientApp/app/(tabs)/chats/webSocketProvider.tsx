import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

// WebSocket Context
interface WebSocketContextType {
    client: Client | null;
    sendMessage: (destination: string, message: any) => void;
    messages: string[];
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ url: string; children: React.ReactNode }> = ({ url, children }) => {
    const [client, setClient] = useState<Client | null>(null);
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: url,
            onConnect: () => {
                console.log("Connected to WebSocket");
                stompClient.subscribe("/user/testReceiverId1/queue/messages", (message) => {
                    setMessages((prev) => [...prev, message.body]);
                });
            },
            onDisconnect: () => console.log("Disconnected from WebSocket"),
            onStompError: (frame) => console.error("STOMP Error", frame),
        });
        setClient(stompClient);
        stompClient.activate();


        return () => {
            stompClient.deactivate();
        };
    }, [url]);

    const sendMessage = (destination: string, message: any) => {
        if (client?.connected) {
            client.publish({ destination, body: JSON.stringify(message) });
        }
    };

    return (
        <WebSocketContext.Provider value={{ client, sendMessage, messages }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) throw new Error("useWebSocket must be used within a WebSocketProvider");
    return context;
};

export default WebSocketProvider;