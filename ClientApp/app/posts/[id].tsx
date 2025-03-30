import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { mhs, mvs } from '@/utils/helpers/uiScaler';
import { t } from 'i18next';
import ImageGridComponent from '@/components/Posts/ImageGridComponent';
import { fetchImage } from '@/utils/api/postApiClient';
import ImageView from 'react-native-image-viewing';


const PostPage: React.FC = () => {
  const { id, post: postString, timeAgo, userProfile: profileString } = useLocalSearchParams();
  const [post, userProfile] = React.useMemo(() => {
    try {
      return [
        postString ? JSON.parse(postString as string) : null,
        profileString ? JSON.parse(profileString as string) : null
      ];
    } catch (e) {
      return [null, null];
    }
  }, [postString, profileString]);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


useEffect(() => {
    const loadImages = async () => {
      if (post.attachments.length > 0) {
        setLoadingImages(true);
        try {
          const results = await Promise.all(
            post.attachments.map(async (attachment: string) => {
              try {
                return await fetchImage(attachment);
              } catch (error) {
                console.error("Error loading image:", error);
                return null;
              }
            })
          );
          setImageUris(results);
        } finally {
          setLoadingImages(false);
        }
      }
    };

    loadImages();
  }, []);

  const handleImagePress = (index: number) => {
    setCurrentImageIndex(index);
    setVisible(true);
  };

  if (!post) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Post not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* User Info Section */}
      <View style={styles.userInfoContainer}>
        <Image
          source={require("@/assets/images/avatar-placeholder.png")}
          style={styles.profilePicture}
        />
        <View style={styles.userInfoText}>
          <Text style={styles.userName}>{userProfile?.username}</Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Image Grid */}
      <View style={styles.postImagesContainer}>
        <ImageGridComponent
          imageUris={Array.isArray(imageUris) ? imageUris : [imageUris]}
          loading={loadingImages}
          onImagePress={handleImagePress}
        />
      </View>

      {/* Like and Comment Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => { }} style={styles.actionButton}>
          <Ionicons name={false ? 'heart' : 'heart-outline'} size={24} color={false ? 'red' : '#555'} />
          <Text style={styles.actionText}>{0} {t('post_component.likes')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#555" />
          <Text style={styles.actionText}>{post.comments.length} {t('post_component.comments')}</Text>
        </TouchableOpacity>
      </View>
      {/* Image Viewer */}
      <ImageView
        images={imageUris.map(uri => ({ uri }))}
        imageIndex={currentImageIndex}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        presentationStyle="overFullScreen"
        backgroundColor="rgba(0, 0, 0, 0.9)"
        swipeToCloseEnabled
        doubleTapToZoomEnabled
      />
    </View>
  );
}

export default PostPage;

const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: mhs(20),
  },
  notFoundText: {
    fontSize: mhs(18),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: mvs(10),
    textAlign: 'center',
  },
  notFoundSubtext: {
    fontSize: mhs(14),
    color: '#888',
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 14,
    margin: mhs(12),
    padding: mhs(12),
    marginBottom: mvs(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: mvs(2) },
    shadowOpacity: 0.1,
    shadowRadius: mhs(4),
    elevation: 4,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mvs(12),
  },
  profilePicture: {
    width: mhs(36),
    height: mhs(36),
    borderRadius: 25,
    marginRight: mhs(12),
  },
  userInfoText: {
    flex: 1,
  },
  userName: {
    fontSize: mhs(15),
    fontWeight: 'bold',
    color: '#333',
  },
  timeAgo: {
    fontSize: mhs(12),
    color: '#888',
  },
  postContent: {
    fontSize: mhs(14),
    color: '#333',
    marginBottom: mvs(8),
  },
  postImagesContainer: {
    marginBottom: mvs(8),
  },
  singleImage: {
    width: '100%',
    height: mvs(400),
    borderRadius: mhs(8),
  },
  twoImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  twoImage: {
    width: '49%',
    height: mvs(200),
    borderRadius: mhs(8),
  },
  threeImageContainer: {
    flexDirection: 'row',
    height: mvs(300),
  },
  threeImageMain: {
    width: '65%',
    height: '100%',
    borderRadius: mhs(8),
    marginRight: mhs(4),
  },
  threeImageRight: {
    flex: 1,
    justifyContent: 'space-between',
  },
  threeImageSub: {
    width: '100%',
    height: '49%',
    borderRadius: mhs(8),
  },
  fourImageContainer: {
    flexDirection: 'row',
    height: mvs(300),
  },
  fourImageMain: {
    width: '65%',
    height: '100%',
    borderRadius: mhs(8),
    marginRight: mhs(4),
  },
  fourImageRight: {
    flex: 1,
    justifyContent: 'space-between',
  },
  fourImageSub: {
    width: '100%',
    height: '32%',
    borderRadius: mhs(8),
    overflow: 'hidden',
  },
  overlayImage: {
    opacity: 0.7,
  },
  remainingCountContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: mhs(8),
  },
  remainingCountText: {
    color: 'white',
    fontSize: mhs(24),
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: mvs(12),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: mhs(16),
  },
  actionText: {
    marginLeft: mhs(6),
    fontSize: mhs(13),
    color: '#555',
  },
});

