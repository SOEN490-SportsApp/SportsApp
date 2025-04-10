import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Button, Modal, StyleSheet, View, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Bubble, Composer, GiftedChat, IMessage, InputToolbar, InputToolbarProps, Send, SendProps, Time } from 'react-native-gifted-chat';
import {useSelector} from "react-redux";
import {getMessages, getChatroom, deleteChatroom, leaveChatroom} from "@/services/chatService";
import { Client } from "@stomp/stompjs";
import { getAccessToken, refreshAccessToken, startTokenRefresh } from "@/services/tokenService"
import {message, chatroomProps, messageRequest} from "@/types/messaging";
import { mvs } from '@/utils/helpers/uiScaler';
import { set } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'react-native-paper';
import themeColors from '@/utils/constants/colors';

const ChatScreen = () => {
  const { id, title } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [finalToken, setFinalToken] = useState<string>("");
  const user = useSelector((state: {user: any}) => state.user);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const avatarPlaceholder = require('@/assets/images/avatar-placeholder.png');


  const [chatroom, setChatroom] = useState<chatroomProps>();
  // TODO This will be a duplicate of the chatroom state
  const [chatroomInformation, setChatroomInformation] = useState<any>();

  const navigation = useNavigation();
  const [infoVisible, setInfoVisible] = useState(false);

  const { t } = useTranslation();

  // use effect to control the bottom tab bar visibility of the part "chat"
  useEffect(() => {
    // Hide tab bar when this screen is focused
    const parent = navigation.getParent();
    parent?.setOptions({
      tabBarStyle: {
        display: 'none'
      }
    });

    // Restore it when unmounted
    return () => {
      parent?.setOptions({
          tabBarStyle: {
          paddingHorizontal: 10,
          height: mvs(65),
        },
      });
    };
  }, []);

  useEffect(() => {
    if (title && typeof title === 'string') {
      navigation.setOptions({
        headerTitle: title,
        headerRight: () => (
          <Button onPress={() => setInfoVisible(true)} title="Info" />
        ),
      });
    }
  }, [title]);

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
    const interval = setInterval(() => {
      refreshAccessToken()
      response();
    }, 180000);

    refreshAccessToken();
    response();
  }, []);

  //TODO to be removed once client issue is fixed
  useEffect(() => {
    const fetchChatroom = async () => {
      if (!finalToken) return;
      try {
        const response = await getChatroom(id.toString());
        setChatroomInformation(response);
        console.log("response of the chat: ", response);
      } catch (e) {
        console.error("Error in useEffect: ", e);
      }
    };

    fetchChatroom();
  }, [finalToken]);

  const handleDeleteChat = async () => {
    console.log("Delete chatroom");
    try {
      deleteChatroom(id.toString());
      setInfoVisible(false);
      router.back();
    }catch (error) {
      console.error("Error deleting chatroom: ", error);
    }
  }

  const handleLeaveChat = async () => {
    console.log("Leave chatroom");
    try {
      leaveChatroom(id.toString(), user.id);
      setInfoVisible(false);
      router.back();
    }catch (error) {
      console.error("Error deleting chatroom: ", error);
    }
  }
  
  useEffect(() => {
    if (!finalToken) return;

      const client = new Client({
        brokerURL: "ws://api.sportahub.app/api/messaging-service/ws",
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
                  {
                    _id: JSON.parse(message.body).messageId,
                    text: JSON.parse(message.body).content,
                    createdAt: new Date(JSON.parse(message.body).createdAt),
                    user: {
                      _id: JSON.parse(message.body).senderId,
                      name: JSON.parse(message.body).sendName, // Replace with actual sender name if available
                      avatar: JSON.parse(message.body).senderAvatar, // Replace with actual avatar URL if available
                    },
                  },
                  ...prev,
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

        // Ensure messagesData is mapped to IMessage structure
        const formattedMessages = messagesData.map((message: any) => ({
          _id: message.messageId,
          text: message.content,
          createdAt: new Date(message.createdAt),
          user: {
            _id: message.senderId,
            name: message.senderName || "Unknown", // Replace with sender's name if available
            avatar: message.senderAvatar || avatarPlaceholder, // Replace with avatar URL if available
          },
        }));

        const chatroomData = await getChatroom(id.toString());

        // console.log("chatroomData: ", chatroomData);

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
          receivers: chatroom.members,
          senderId: user.id,
          // TODO joud use when supported
          senderName: user.username,
          // senderImage: user.avatar,
        }
        // TODO remove log
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


  const renderInputToolbar = ( props: InputToolbarProps<IMessage> ) => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: themeColors.background.lightGrey,
        borderTopWidth: 2,
        paddingBottom: 15,
        paddingLeft: 0,
      }}
      primaryStyle={{ alignItems: 'center' }}
    />
  );

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: '#d4f5dd',
        },
        right: {
          backgroundColor: '#34c759',
        },
      }}
      textStyle={{
        left: {
          color: '#1a1a1a',
        },
        right: {
          color: '#ffffff',
        },
      }}
    />
  );
  
  const renderTime = (props: any) => (
    <Time
      {...props}
      timeTextStyle={{
        left: { color: "#4b5563" },
        right: { color: '4b5563' },
      }}
    />
  );
  
  const renderComposer = (props: any) => (
  <Composer
    {...props}
    textInputStyle={{
      backgroundColor: themeColors.background.light,
      color: themeColors.text.dark,
      borderWidth: 0,
      borderRadius: 15,
      paddingTop: 8.5,
      paddingHorizontal: 10,
      marginLeft: 20,
      marginRight: 5,
      minHeight: 40,
    }}
  />
  );

  const renderSend = (props:any) => (
    <Send
      {...props}
      disabled={!props.text}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
      }}
    >
      <IconButton icon='send' size={35} iconColor={themeColors.primary} />
    </Send>
  );

  return (
    <>
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{ _id: user.id }}
      alwaysShowSend
      renderInputToolbar={renderInputToolbar}
      renderComposer={renderComposer}
      renderSend={renderSend}
      isScrollToBottomEnabled={true}
      scrollToBottomComponent={() => (
        <FontAwesomeIcon icon={faChevronDown} size={16} color="#007AFF" />
      )}
      renderBubble={renderBubble}
      renderTime={renderTime}
      renderUsernameOnMessage={true}
      />

    <Modal visible={infoVisible} transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>

          {/* list of participants if it's a group chat*/}
          {chatroomInformation?.members?.length > 2 && (
            <View style={styles.participantTextRow}>
              <Text style={styles.modalTitle}>Group Members</Text>
              <Text style={styles.inlineName}>
                {chatroomInformation.members
                  .map((member: any) =>
                    member.username === user.username ? 'You' : member.username
                  )
                  .join(', ')}
              </Text>
            </View>
          )}

          {/*delete or leave group*/}
          {chatroomInformation?.createdBy === user.id ? (
            <Button
              title={t('chat.delete_chat')}
              color="#e74c3c"
              onPress={handleDeleteChat}
            />
          ) : (
            <Button
              title={t('chat.leave_chat')}
              color="#f39c12"
              onPress={() => handleLeaveChat()}
            />
          )}

          <Button title={t('chat.close')} onPress={() => setInfoVisible(false)} />
        </View>
      </View>
    </Modal>
  </>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  participantText: {
    fontSize: 14,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginLeft: 4,
  },
  participantTextRow: {
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  inlineName: {
    fontSize: 15,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 4,
  },
});
