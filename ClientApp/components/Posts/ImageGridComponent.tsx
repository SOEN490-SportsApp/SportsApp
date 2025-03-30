import React, { useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, TouchableWithoutFeedback, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mhs, mvs } from '@/utils/helpers/uiScaler';
import themeColors from '@/utils/constants/colors';

type ImageGridProps = {
    imageUris: (string | null)[];
    loading: boolean;
    onImagePress: (index: number) => void;
};

const ImageGridComponent: React.FC<ImageGridProps> = ({ imageUris, loading, onImagePress }) => {
    if (loading) {
        return <ActivityIndicator size="small" color={themeColors.primary} />;
    }

    const renderImageWithFallback = (uri: string, index: number) => {

        if (uri === null) {
            return (
                <View style={styles.fallbackContainer}>
                    <Ionicons name="image-outline" size={mhs(24)} color="#ccc" />
                    <Text style={styles.fallbackText}>Failed to fetch Image.</Text>
                </View>
            );
        }

        return (
            <Image
                source={{ uri }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
            />
        );
    };

    const renderGrid = () => {
        const imageCount = imageUris.length;

        if (imageCount === 1) {
            return (
                <TouchableWithoutFeedback onPress={() => onImagePress(0)}>
                    <View style={styles.singleImage}>
                        {renderImageWithFallback(imageUris[0]!, 0)}
                    </View>
                </TouchableWithoutFeedback>
            );
        }

        if (imageCount === 2) {
            return (
                <View style={styles.twoImageContainer}>
                    <TouchableWithoutFeedback onPress={() => onImagePress(0)}>
                        <View style={styles.twoImage}>
                            {renderImageWithFallback(imageUris[0]!, 0)}
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => onImagePress(1)}>
                        <View style={styles.twoImage}>
                            {renderImageWithFallback(imageUris[1]!, 1)}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            );
        }

        if (imageCount === 3) {
            return (
                <View style={styles.threeImageContainer}>
                    <TouchableWithoutFeedback onPress={() => onImagePress(0)}>
                        <View style={styles.threeImageMain}>
                            {renderImageWithFallback(imageUris[0]!, 0)}
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.threeImageRight}>
                        <TouchableWithoutFeedback onPress={() => onImagePress(1)}>
                            <View style={styles.threeImageSub}>
                                {renderImageWithFallback(imageUris[1]!, 1)}
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => onImagePress(2)}>
                            <View style={styles.threeImageSub}>
                                {renderImageWithFallback(imageUris[2]!, 2)}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            );
        }

        if (imageCount >= 4) {
            const remainingCount = imageCount - 4;
            return (
                <View style={styles.fourImageContainer}>
                    <TouchableWithoutFeedback onPress={() => onImagePress(0)}>
                        <View style={styles.fourImageMain}>
                            {renderImageWithFallback(imageUris[0]!, 0)}
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.fourImageRight}>
                        <TouchableWithoutFeedback onPress={() => onImagePress(1)}>
                            <View style={styles.fourImageSub}>
                                {renderImageWithFallback(imageUris[1]!, 1)}
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => onImagePress(2)}>
                            <View style={styles.fourImageSub}>
                                {renderImageWithFallback(imageUris[2]!, 2)}
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => onImagePress(3)}>
                            <View style={[styles.fourImageSub, { marginTop: mvs(2) }]}>
                                {renderImageWithFallback(imageUris[3]!, 3)}
                                {remainingCount > 0 && (
                                    <View style={styles.remainingCountContainer}>
                                        <Text style={styles.remainingCountText}>+{remainingCount}</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            );
        }
    };

    return <View style={styles.container}>{renderGrid()}</View>;
};

const styles = StyleSheet.create({
    container: {
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
    fallbackContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: mhs(8),
    },
    fallbackText: {
        marginTop: mvs(8),
        color: '#888',
        fontSize: mhs(12),
    },
    largeImageText: {
        marginTop: mvs(8),
        color: '#ff4444', // Red color for warning
        fontSize: mhs(12),
        fontWeight: 'bold',
    },
});

export default ImageGridComponent;