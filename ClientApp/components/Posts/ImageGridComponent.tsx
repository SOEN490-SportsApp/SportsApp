import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator, TouchableWithoutFeedback, Text } from 'react-native';
import { mhs, mvs } from '@/utils/helpers/uiScaler';

type ImageGridProps = {
    imageUris: string[];
    loading: boolean;
    handlePostPress: () => void;
};

const ImageGridComponent: React.FC<ImageGridProps> = ({ imageUris, loading, handlePostPress}) => {
    if (loading) {
        return <ActivityIndicator size="small" color="#0000ff" />;
    }

    const renderGrid = () => {
        const imageCount = imageUris.length;

        if (imageCount === 1) {
            return (
                <Image
                    source={{ uri: imageUris[0] }}
                    style={styles.singleImage}
                    resizeMode='cover'
                />
            );
        }
        if (imageCount === 2) {
            return (
                <View style={styles.twoImageContainer}>
                    <TouchableWithoutFeedback onPress={() => handlePostPress()}>
                        <Image
                            source={{ uri: imageUris[0] }}
                            style={styles.twoImage}
                            resizeMode="cover"
                        />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => handlePostPress()}>
                        <Image
                            source={{ uri: imageUris[1] }}
                            style={styles.twoImage}
                            resizeMode="cover"
                        />
                    </TouchableWithoutFeedback>
                </View>
            );
        }

        if (imageCount === 3) {
            return (
                <View style={styles.threeImageContainer}>
                    <TouchableWithoutFeedback onPress={() => handlePostPress()}>
                        <Image
                            source={{ uri: imageUris[0] }}
                            style={styles.threeImageMain}
                            resizeMode="cover"
                        />
                    </TouchableWithoutFeedback>
                    <View style={styles.threeImageRight}>
                        <TouchableWithoutFeedback onPress={() => handlePostPress()}>
                            <Image
                                source={{ uri: imageUris[1] }}
                                style={styles.threeImageSub}
                                resizeMode="cover"
                            />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => handlePostPress()}>
                            <Image
                                source={{ uri: imageUris[2] }}
                                style={styles.threeImageSub}
                                resizeMode="cover"
                            />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            );
        }

        if (imageCount >= 4) {
            const remainingCount = imageCount - 4;
            return (
                <View style={styles.fourImageContainer}>
                    <TouchableWithoutFeedback onPress={() => handlePostPress()}>
                        <Image
                            source={{ uri: imageUris[0] }}
                            style={styles.fourImageMain}
                            resizeMode="cover"
                        />
                    </TouchableWithoutFeedback>
                    <View style={styles.fourImageRight}>
                        <TouchableWithoutFeedback onPress={() => handlePostPress()}>
                            <Image
                                source={{ uri: imageUris[1] }}
                                style={styles.fourImageSub}
                                resizeMode="cover"
                            />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => handlePostPress()}>
                            <Image
                                source={{ uri: imageUris[2] }}
                                style={styles.fourImageSub}
                                resizeMode="cover"
                            />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => handlePostPress()}>
                            <View style={[styles.fourImageSub, { marginTop: mvs(2) }]}>
                                <Image
                                    source={{ uri: imageUris[3] }}
                                    style={[
                                        StyleSheet.absoluteFill,
                                        remainingCount > 0 && styles.overlayImage
                                    ]}
                                    resizeMode="cover"
                                />
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
});

export default ImageGridComponent;