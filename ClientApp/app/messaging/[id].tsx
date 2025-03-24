import { useLocalSearchParams, useRouter } from 'expo-router';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import { StyleSheet } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import {useSelector} from "react-redux";
import {getMessages, getChatroom} from "@/services/chatService";
import { Client } from "@stomp/stompjs";
import { getAccessToken } from "@/services/tokenService"

interface message {
  messageId: string;
  chatroomId: string;
  senderId: string;
  receiverIds: string[];
  content: string;
  createdAt: string;
  attachments: string[];
}

interface chatroomProps {
  chatroomId: string;
  createdAt: string,
  createdBy: string,
  members: string[],
  messages: message[],
  isEvent: boolean,
  unread: boolean,
}

const ChatScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [finalToken, setFinalToken] = useState<string>("");
  const user = useSelector((state: {user: any}) => state.user);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const [chatroom, setChatroom] = useState<chatroomProps[]>([]);

  useEffect(() => {
    const response = async () => {
      try {
          const token = await getAccessToken();
          if (token) {
            setFinalToken(token);
          }
      } catch (error) {
        console.error('Failed to get access token:', error);
      }
    };

    response();
  }, []);


  useEffect(() => {
    if (!finalToken) return;

      const client = new Client({
        brokerURL: "ws://localhost:8080/api/messaging-service/ws",
        heartbeatIncoming: 0,
        heartbeatOutgoing: 0,
        connectHeaders: {
          Authorization: "Bearer " + finalToken,
        },
        //forceBinaryWSFrames: true,
        //appendMissingNULLonIncoming: true,

        onWebSocketError: (error: any) => console.error("Websocket error:", error),
        onConnect: () => {
          setConnected(true);

          client.subscribe(`/topic/chatroom/${id}`, (message: any) => {
            console.log(JSON.parse(message.body));
            setMessages((prev: any) => [...prev, message.body]);
          },
              {
                "Authorization": "Bearer " + finalToken,
              });
        },
        onDisconnect: () => setConnected(false),
        debug: (msg: any) => console.log(msg),
        onStompError: (frame: any) => console.error("Stomp error:", frame),

      });

      client.activate();
      clientRef.current = client;

      const fetchChatroom = async () => {
        try {
          const messagesData = await getMessages(id.toString())
          const chatroomData = await getChatroom(id.toString())
          setChatroom(chatroomData);
          setMessages(messagesData);
        } catch (error) {
          console.error("Failed to fetch messages", error);
          throw error;
        }
      }
      fetchChatroom();

    return () => {
        client.deactivate();
    }
  }, [finalToken]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {

    console.log(finalToken);
    if (!Array.isArray(newMessages)) return;
    try {
      const message = newMessages[0];



        // @ts-ignore
      clientRef.current.publish({
        destination: "/app/message",
          headers: {Authorization: "Bearer " + finalToken},
        body: JSON.stringify(message),
      })
    } catch (error) {
      console.error("Failed to publish messages", error);
    }

    //setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  }, [finalToken]);

  return (
    
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{ _id: 1 }}
        />
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
