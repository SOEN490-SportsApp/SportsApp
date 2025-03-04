import React, { useState } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import themeColors from '@/utils/constants/colors';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const PostCreationComponent: React.FC = () => {
  const [comment, setComment] = useState<string>('');
  const [images, setImages] = useState<{ uri: string; width: number; height: number }[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const pickImage = async (source: 'gallery' | 'camera') => {
    let result;
    if (source === 'gallery') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false, // Disable editing to retain original size
        aspect: [4, 3],
        quality: 1,
      });
    } else if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false, // Disable editing to retain original size
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (result && !result.canceled) {
      const { uri, width, height } = result.assets[0];
      setImages((prev) => [...prev, { uri, width, height }]); // Add the new image to the list
      setCurrentImageIndex(images.length); // Set the current index to the newly added image
    }
  };

  const handlePost = () => {
    // Handle post submission here
    console.log('Comment:', comment);
    console.log('Images:', images);
    resetModal();
  };

  const removeImage = () => {
    setImages((prev) => prev.filter((_, i) => i !== currentImageIndex)); // Remove the current image
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : 0)); // Adjust the current index
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1)); // Loop to the last image if at the start
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)); // Loop to the first image if at the end
  };

  const resetModal = () => {
    setComment('');
    setImages([]);
    setCurrentImageIndex(0);
    setIsModalVisible(false); // Close the modal
  };

  // Calculate the displayed height of the image based on its aspect ratio
  const getImageHeight = (width: number, height: number) => {
    const aspectRatio = height / width;
    return Math.min(SCREEN_WIDTH * 0.9 * aspectRatio, SCREEN_HEIGHT * 0.4); // Limit height to 40% of screen height
  };

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
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { height: SCREEN_HEIGHT * 0.85 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Post</Text>
                <TouchableOpacity onPress={resetModal}>
                  <Ionicons name="close" size={24} color="#555" />
                </TouchableOpacity>
              </View>

              {/* Scrollable Content */}
              <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* User Info Section */}
                <View style={styles.userInfoContainer}>
                  <Image
                    source={require("@/assets/images/avatar-placeholder.png")}
                    style={styles.modalAvatar}
                  />
                  <Text style={styles.userName}>John Dffoe</Text>
                </View>


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
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  placeholderText: {
    flex: 1,
    fontSize: 14,
    color: '#888',
  },
  attachmentButton: {
    padding: 8,
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
    padding: 16,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
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
    padding: 12,
    minHeight: 100,
    marginBottom: 16,
    fontSize: 14,
    color: '#333',
  },
  imageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  arrowButton: {
    // padding: 8,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  imageButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  modalPostButton: {
    backgroundColor: themeColors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalPostButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default PostCreationComponent;