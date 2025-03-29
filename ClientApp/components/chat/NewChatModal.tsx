import React, { useState } from 'react';
import {Modal,View,Text,FlatList,TouchableOpacity,StyleSheet,Pressable,Image} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { hs, mhs, mvs, vs } from '@/utils/helpers/uiScaler';

const sampleFriends = [
    { id: '1', name: 'User1' },
    { id: '2', name: 'User2' },
    { id: '3', name: 'User3' },
    { id: '4', name: 'User4' },
  ];

interface NewChatModalProps {
  friends: any [];
  visible: boolean;
  onClose: () => void;
  onCreateGroup: (selected: typeof sampleFriends) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({
  friends,
  visible,
  onClose,
  onCreateGroup,
}) => {
    const [selected, setSelected] = useState<{ userId: string; username: string; userImage: string }[]>([]);
    console.log("Selected friends:", selected);
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

    const handleCreate = () => {
        const selectedFriends = friends.filter((f) =>
        selected.includes(f.id)
        );
        console.log("Selected friends:", selectedFriends);
        onCreateGroup(selectedFriends);
        onClose();
        setSelected([]);
    };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Friends</Text>
          <FlatList
            data={friends}
            keyExtractor={(item) => item.friendUserId} // fix: use actual unique friend ID
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
                  {isSelected && (
                    <FontAwesome name="check" size={18} color="#007AFF" />
                  )}
                </Pressable>
              );
            }}
          />
          <TouchableOpacity
            style={styles.createBtn}
            onPress={handleCreate}
            disabled={selected.length === 0}
          >
            <Text style={styles.createBtnText}>Start Group Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Cancel</Text>
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
    backgroundColor: '#e0f0ff',
    borderColor: '#007AFF',
  },
  friendName: {
    fontSize: 16,
    color: '#333',  
},
  createBtn: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
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
