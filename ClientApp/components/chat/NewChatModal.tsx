import React, { useState } from 'react';
import {Modal,View,Text,FlatList,TouchableOpacity,StyleSheet,Pressable,Image, TextInput} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { hs, mhs, mvs, vs } from '@/utils/helpers/uiScaler';
import { createUserChatroom } from '@/services/chatService';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import themeColors from '@/utils/constants/colors';
import { useTranslation } from 'react-i18next';
import { enUS, fr, ar } from 'date-fns/locale';

interface NewChatModalProps {
  friends: any [];
  visible: boolean;
  onClose: () => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({
  friends,
  visible,
  onClose,
}) => {
    const [selected, setSelected] = useState<{ userId: string; username: string; userImage: string }[]>([]);
    const LoggedUser = useSelector((state: { user: any }) => state.user);
    const [chatTitle, setChatTitle] = useState('');
    const user = useSelector((state: { user: any }) => state.user);
    const { t } = useTranslation();
    
    const toggleSelect = (item: any) => {
        const exists = selected.find((u) => u.userId === item.friendUserId);
      
        if (exists) {
          setSelected((prev) => prev.filter((u) => u.userId !== item.friendUserId));
        } else {
          const newUser = {
            userId: item.friendUserId,
            username: item.friendUsername,
            userImage: item.profile.profileImage || '', // use fallback if needed
          };
          setSelected((prev) => [...prev, newUser]);
        }
    };

    const onCreateGroup = async (selectedFriends: any[], title: string) => {
        let chatroomId = '';
        console.log("Creating group with friends from onCreateGroup:", selectedFriends);
        try {
            const response = await createUserChatroom(LoggedUser.id, LoggedUser.username, '', title, selectedFriends, [], false, false)
            chatroomId = response.chatroomId;
            
            if (!chatroomId) {
              console.error("No chatroomId returned from server.");
              return;
            }
            
            router.push({
              pathname: '/(tabs)/chats/[id]',
              params: { 
                id: chatroomId, 
                title: title || user.username },
              });
            }catch (error) {
              console.error("Error creating group:", error);
          }
    };

    const handleCreate = () => {
      if (selected.length > 1 && chatTitle.trim() === '') {
        alert('Please enter a group name.');
        return;
      }
    
      const titleToUse = selected.length > 1 ? chatTitle.trim() : 'Direct Chat';
      
      //TODO when creating this, it's taking the "Direct Chat" name only on the first routing
      onCreateGroup(selected, titleToUse);
      setChatTitle('');
      setSelected([]);
      onClose();
    };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t('chat.select_Friends')}</Text>
          <FlatList
            data={friends}
            keyExtractor={(item) => item.friendUserId}
            renderItem={({ item }) => {
                const isSelected = selected.some((u) => u.userId === item.friendUserId);
                return (
                <Pressable
                  style={[
                    styles.friendItem,
                    isSelected && styles.selectedFriend,
                  ]}
                  onPress={() => toggleSelect(item)}                  >
                    <View style={styles.friendInfo}>
                        <Image
                            source={require("@/assets/images/avatar-placeholder.png")}
                            style={[styles.participantAvatar]}
                            testID="participant-avatar"
                        />
                        <Text style={styles.userInfo}>
                            {item.friendUsername }
                        </Text>
                    </View>
                </Pressable>
              );
            }}
          />
          {selected.length > 1 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 16, marginBottom: 6 }}>{t('chat.Group_name')}</Text>
              <View style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 6,
              }}>
                <TextInput
                  placeholder={t('chat.enter_group_name_placeholder')}
                  value={chatTitle}
                  onChangeText={setChatTitle}
                  style={{ fontSize: 14 }}
                />
              </View>
            </View>
          )}
          <TouchableOpacity
            style={styles.createBtn}
            onPress={handleCreate}
            disabled={selected.length === 0}
          >
            {/*TODO JOUD udpate the langague and check for name if the selected ones are more than 2 */}
            <Text style={styles.createBtnText}>{t('chat.start_chat')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>{t('chat.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NewChatModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  pictureSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  selectedFriend: {
    backgroundColor: '#dff2de',
    borderColor: '#00b803',
  },
  friendName: {
    fontSize: 16,
    color: '#333',  
},
  createBtn: {
    backgroundColor: themeColors.button.primaryBackground,
    height: vs(50),
    borderRadius: mhs(25),
    alignItems: 'center',
    justifyContent: "center",
    marginBottom: vs(16),
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: vs(2) },
    shadowOpacity: 0.25,
    shadowRadius: hs(4),
    minHeight: 40
  },
  createBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeBtn: {
    alignItems: 'center',
    marginTop: 10,
  },
  closeBtnText: {
    color: '#666',
  },
  participantAvatar: {
      width: mhs(45),
      height: mvs(45),
      borderRadius: mhs(30),
},
infoSection: {
    display: "flex",
    flex: 3,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: vs(16),
  },
  userInfo: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: hs(5),
    color: "#333",
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  }
});
