import React, { useState } from 'react';
import {Modal,View,Text,FlatList,TouchableOpacity,StyleSheet,Pressable,} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const sampleFriends = [
    { id: '1', name: 'User1' },
    { id: '2', name: 'User2' },
    { id: '3', name: 'User3' },
    { id: '4', name: 'User4' },
  ];

interface NewChatModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateGroup: (selected: typeof sampleFriends) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({
  visible,
  onClose,
  onCreateGroup,
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    const selectedFriends = sampleFriends.filter((f) =>
      selected.includes(f.id)
    );
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
            data={sampleFriends}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSelected = selected.includes(item.id);
              return (
                <Pressable
                  style={[
                    styles.friendItem,
                    isSelected && styles.selectedFriend,
                  ]}
                  onPress={() => toggleSelect(item.id)}
                >
                  <Text style={styles.friendName}>{item.name}</Text>
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
  selectedFriend: {
    backgroundColor: '#e0f0ff',
    borderColor: '#007AFF',
  },
  friendName: {
    fontSize: 16,
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
});
