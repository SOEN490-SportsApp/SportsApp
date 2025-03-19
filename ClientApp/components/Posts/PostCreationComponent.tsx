import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import themeColors from '@/utils/constants/colors';
import { createPost, uploadImage } from '@/utils/api/postApiClient';
import { useSelector } from 'react-redux';
import { UserState } from '@/types';
import { mhs, mvs } from '@/utils/helpers/uiScaler';
import { Camera } from "expo-camera";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface PostCreationProps {
  eventId: string;
  onNewPost: () => void;
}

const PostCreationComponent: React.FC<PostCreationProps> = ({ eventId, onNewPost }) => {
  const user = useSelector((state: { user: UserState }) => state.user);
  const [comment, setComment] = useState<string>('');
  const [images, setImages] = useState<{ uri: string; width: number; height: number }[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const pickImage = async (source: 'gallery' | 'camera') => {
    let result;
  
    if (source === 'gallery') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow photo library access in settings.');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });
      
    } else if (source === 'camera') {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow camera access in settings.');
        return;
      }
  
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });
    }
  
    if (result && !result.canceled && result.assets.length > 0) {
      const { uri, width, height } = result.assets[0];
      setImages((prev) => [...prev, { uri, width, height }]);
      setCurrentImageIndex(images.length);
    }
  };
  const handlePost = async () => {
    try {
      // const uploadPromises = images.map((image) => uploadImage(image.uri));
      // const downloadPaths = await Promise.all(uploadPromises); // Upload all images before creating the post
      const downloadPaths = [''];
      await createPost(eventId, comment, downloadPaths);
      onNewPost();
      console.log('Post created successfully');
      resetModal();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
    resetModal();
  };

  const removeImage = () => {
    setImages((prev) => prev.filter((_, i) => i !== currentImageIndex));
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const resetModal = () => {
    setComment('');
    setImages([]);
    setCurrentImageIndex(0);
    setIsModalVisible(false);
  };

  const getImageHeight = (width: number, height: number) => {
    const aspectRatio = height / width;
    return Math.min(SCREEN_WIDTH * 0.9 * aspectRatio, SCREEN_HEIGHT * 0.4);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Main Input Section */}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <Image
          source={require("@/assets/images/avatar-placeholder.png")}
          style={styles.avatar}
        />
        <Text style={styles.placeholderText}>Post about this event!</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.attachmentButton}>
          <Ionicons name="attach" size={24} color="#555" />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Modal for Post Creation */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onDismiss={resetModal}
        onRequestClose={resetModal}
        statusBarTranslucent={true}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalOverlay}
          >
            <View style={[styles.modalContent, { height: keyboardHeight == 0 ? SCREEN_HEIGHT * 0.90 : SCREEN_HEIGHT - keyboardHeight }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Post</Text>
                <TouchableOpacity onPress={resetModal}>
                  <Ionicons name="close" size={24} color="#555" />
                </TouchableOpacity>
              </View>

              {/* Scrollable Content */}
              <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* User Info Section */}
                <View style={styles.userInfoContainer}>
                  <Image
                    source={require("@/assets/images/avatar-placeholder.png")}
                    style={styles.modalAvatar}
                  />
                  <Text style={styles.userName}>{user.username}</Text>
                </View>

                {/* Text Input with Fixed Height */}
                <TextInput
                  style={styles.modalInput}
                  placeholder="What's on your mind?"
                  placeholderTextColor="#888"
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  autoFocus
                />

                {/* Image Section with Navigation Arrows */}
                {images.length > 0 && (
                  <View style={styles.imageSection}>
                    {images.length > 1 && <TouchableOpacity onPress={goToPreviousImage} style={styles.arrowButton}>
                      <Ionicons name="chevron-back" size={32} color="#555" />
                    </TouchableOpacity>}

                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: images[currentImageIndex].uri }}
                        style={[
                          styles.image,
                          {
                            height: getImageHeight(
                              images[currentImageIndex].width,
                              images[currentImageIndex].height
                            ),
                          },
                        ]}
                        resizeMode="contain"
                      />
                      <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
                        <Ionicons name="close" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>

                    {images.length > 1 && <TouchableOpacity onPress={goToNextImage} style={styles.arrowButton}>
                      <Ionicons name="chevron-forward" size={32} color="#555" />
                    </TouchableOpacity>}
                  </View>
                )}

                {/* Image Buttons Section */}
                <View style={styles.imageButtonsContainer}>
                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={() => pickImage('gallery')}
                  >
                    <Ionicons name="image" size={24} color="#555" />
                    <Text style={styles.imageButtonText}>Attach Image</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={() => pickImage('camera')}
                  >
                    <Ionicons name="camera" size={24} color="#555" />
                    <Text style={styles.imageButtonText}>Take Photo</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              {/* Post Button */}
              <TouchableOpacity onPress={handlePost} style={styles.modalPostButton}>
                <Text style={styles.modalPostButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: mhs(8),
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: mvs(2) },
    shadowOpacity: 0.1,
    shadowRadius: mhs(4),
    elevation: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: mhs(12),
    paddingVertical: mvs(8),
  },
  avatar: {
    width: mhs(36),
    height: mhs(36),
    borderRadius: 25,
    marginRight: mhs(12),
  },
  placeholderText: {
    flex: 1,
    fontSize: mhs(12),
    color: '#888',
  },
  attachmentButton: {
    padding: mhs(8),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: mhs(16),
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: mvs(16),
  },
  modalTitle: {
    fontSize: mvs(18),
    fontWeight: 'bold',
    color: '#333',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mvs(16),
  },
  modalAvatar: {
    width: mhs(36),
    height: mhs(36),
    borderRadius: 25,
    marginRight: mhs(12),
  },
  userName: {
    fontSize: mhs(15),
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    padding: mvs(12),
    minHeight: mvs(100),
    maxHeight: mvs(120),
    marginBottom: mvs(16),
    fontSize: mhs(13),
    color: '#333',
  },
  imageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: mvs(16),
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.8,
  },
  image: {
    width: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: mvs(8),
    right: mvs(8),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    padding: mhs(4),
  },
  arrowButton: {
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: mvs(16),
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: mvs(12),
    borderRadius: 8,
    flex: 1,
    marginHorizontal: mhs(4),
    justifyContent: 'center',
  },
  imageButtonText: {
    marginLeft: mhs(8),
    fontSize: mhs(13),
    color: '#555',
  },
  modalPostButton: {
    backgroundColor: themeColors.primary,
    padding: mhs(12),
    borderRadius: 25,
    alignItems: 'center',
  },
  modalPostButtonText: {
    color: themeColors.text.light,
    fontWeight: 'bold',
    fontSize: mvs(16),
  },
});

export default PostCreationComponent;