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
  createdAt: Number | Date;
  attachments: string[];
}

interface chatroomProps {
  chatroomId: string;
  createdAt: Number | Date;
  createdBy: string;
  members: string[];
  messages: message[];
  isEvent: boolean;
  unread: boolean;
}

interface messageRequest {
  chatroomId: string;
  senderId: string;
  receiverIds: string[];
  content: string;
  attachments: string[];
}

const ChatScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [finalToken, setFinalToken] = useState<string>("");
  const user = useSelector((state: {user: any}) => state.user);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const [chatroom, setChatroom] = useState<chatroomProps>();

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

        onWebSocketError: (error: any) => console.error("Websocket error:", error),
        onConnect: () => {
          setConnected(true);

          client.subscribe(`/topic/chatroom/${id}`, (message: any) => {
            console.log(JSON.parse(message.body));
                setMessages((prev: IMessage[]) => [
                  ...prev,
                  {
                    _id: JSON.parse(message.body).messageId,
                    text: JSON.parse(message.body).content,
                    createdAt: new Date(JSON.parse(message.body).createdAt),
                    user: {
                      _id: JSON.parse(message.body).senderId,
                      name: 'Sender Name', // Replace with actual sender name if available
                      avatar: 'https://example.com/sender-avatar.png', // Replace with actual avatar URL if available
                    },
                  },
                ]);
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
        const messagesData = await getMessages(id.toString());
        console.log("messageData: ", messagesData);

        // Ensure messagesData is mapped to IMessage structure
        const formattedMessages = messagesData.map((message: any) => ({
          _id: message.messageId,
          text: message.content,
          createdAt: new Date(message.createdAt),
          user: {
            _id: message.senderId,
            name: message.senderName || "Unknown", // Replace with sender's name if available
            avatar: message.senderAvatar || "https://example.com/default-avatar.png", // Replace with avatar URL if available
          },
        }));

        const chatroomData = await getChatroom(id.toString());
        console.log("chatroomData: ", chatroomData);

        setChatroom(chatroomData);
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to fetch messages", error);
        throw error;
      }
    };
      fetchChatroom();

    return () => {
        client.deactivate();
    }
  }, [finalToken]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    let attachments: string[] = [];
    console.log("newMessages: ", newMessages);
    console.log("chatroom: ", chatroom);

    if (!Array.isArray(newMessages)) return;
    try {
      const newMessage = newMessages[0];
      if (newMessage.audio != undefined) {
        attachments.push(newMessage.audio)
      }
      if (newMessage.video != undefined) {
        attachments.push(newMessage.video)
      }
      if (chatroom != undefined) {
        const newMessageRequest: messageRequest = {
          chatroomId: chatroom.chatroomId,
          attachments: attachments,
          content: newMessage.text,
          receiverIds: chatroom.members,
          senderId: user.id,
        }
        console.log("newMessageRequest: ",newMessageRequest);
        // @ts-ignore
        clientRef.current.publish({
          destination: "/app/message",
          headers: {Authorization: "Bearer " + finalToken},
          body: JSON.stringify(newMessageRequest),
        })
      }
      } catch (error) {
      console.error("Failed to publish messages", error);
    }

  }, [finalToken, chatroom]);

  return (
    
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{ _id: user.id }}
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
