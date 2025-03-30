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
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import themeColors from '@/utils/constants/colors';
import { createPost, uploadImage } from '@/utils/api/postApiClient';
import { useSelector } from 'react-redux';
import { UserState } from '@/types';
import { mhs, mvs } from '@/utils/helpers/uiScaler';
import { Camera } from "expo-camera";
import { useTranslation } from 'react-i18next';
import { Post } from '@/types/post';
import * as FileSystem from 'expo-file-system';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface PostCreationProps {
  eventId: string;
  onNewPost: (post: Post) => void;
}

const PostCreationComponent: React.FC<PostCreationProps> = ({ eventId, onNewPost }) => {
  const user = useSelector((state: { user: UserState }) => state.user);
  const [comment, setComment] = useState<string>('');
  const [images, setImages] = useState<{ uri: string; width: number; height: number }[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const { t } = useTranslation();

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
    if (isPosting) return;

    try {
      setIsPosting(true);

      for (const image of images) {
        const fileInfo = await FileSystem.getInfoAsync(image.uri);

        if (!fileInfo.exists) {
          throw new Error('Image file not found');
        }

        const fileSizeMB = fileInfo.size / (1024 * 1024); // Convert bytes to MB

        if (fileSizeMB > 3) {
          Alert.alert(
            'Image too large',
            `One of your images is ${fileSizeMB.toFixed(1)}MB. Maximum allowed is 3MB.`,
            [{ text: 'OK' }]
          );
          return; 
        }
      }

      const uploadPromises = images.map((image) => uploadImage(image.uri));
      const downloadPaths = await Promise.all(uploadPromises);
      const post = await createPost(eventId, comment, downloadPaths);
      onNewPost(post);
      resetModal();

    } catch (error: any) {
      console.error('Failed to create post:', error);
      Alert.alert(
        'Error',
        error.message.includes('too large')
          ? 'One of your images is too large (max 3MB)'
          : 'Failed to create post'
      );
    } finally {
      setIsPosting(false);
    }
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
        <Text style={styles.placeholderText}>{t('post_creation_component.post_about_this_event')}</Text>
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
            <View style={[styles.modalContent, { height: keyboardHeight == 0 ? SCREEN_HEIGHT * 0.90 : SCREEN_HEIGHT * 0.90 - keyboardHeight }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('post_creation_component.create_post')}</Text>
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
                  placeholder={t('post_creation_component.whats_on_your_mind')}
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
                    <Text style={styles.imageButtonText}>{t('post_creation_component.attach_image')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={() => pickImage('camera')}
                  >
                    <Ionicons name="camera" size={24} color="#555" />
                    <Text style={styles.imageButtonText}>{t('post_creation_component.take_photo')}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              {/* Post Button */}
              <TouchableOpacity
                onPress={handlePost}
                style={styles.modalPostButton}
                disabled={isPosting}
              >
                {isPosting ? (
                  <ActivityIndicator color={themeColors.text.light} />
                ) : (
                  <Text style={styles.modalPostButtonText}>
                    {t('post_creation_component.post')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        {isPosting && (
          <View style={styles.postingOverlay}>
            <View style={styles.postingIndicator}>
              <ActivityIndicator size="large" color={themeColors.primary} />
              <Text style={styles.postingText}>
                {t('post_creation_component.creating_your_post')}
              </Text>
            </View>
          </View>
        )}
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
  postingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postingIndicator: {
    backgroundColor: '#fff',
    padding: mhs(20),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postingText: {
    marginTop: mvs(10),
    fontSize: mhs(14),
    color: '#333',
  },
});

export default PostCreationComponent;