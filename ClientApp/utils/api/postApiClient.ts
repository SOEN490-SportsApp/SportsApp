import { API_ENDPOINTS } from '@/utils/api/endpoints';
import { getAxiosInstance } from '@/services/axiosInstance';
import mime from 'react-native-mime-types';
import * as FileSystem from 'expo-file-system';

export async function createPost(eventId: string, content: string, attachments: string[]): Promise<any> {
    const axiosInstance = getAxiosInstance();
    try {
        const response = await axiosInstance.post(
            API_ENDPOINTS.CREATE_POST.replace("{eventId}", eventId),
            {
                content,
                attachments,
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error creating post:", error);
        throw error.response?.data || error;
    }
}

export async function uploadImage(fileUri: string): Promise<string> {
    const axiosInstance = getAxiosInstance();

    try {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (!fileInfo.exists) {
            throw new Error('Image file not found');
        }

        const fileSizeMB = fileInfo.size / (1024 * 1024); // Convert bytes to MB

        if (fileSizeMB > 3) {
            throw new Error(`Image too large (${fileSizeMB.toFixed(1)}MB). Maximum allowed is 3MB.`);
        }

        const fileName = fileUri.split('/').pop() || `upload_${Date.now()}`;
        const formData = new FormData();

        formData.append('file', {
            uri: fileUri,
            name: fileName,
            type: mime.lookup(fileUri) as string || 'image/jpeg',
        } as any);

        const uploadResponse = await axiosInstance.post(API_ENDPOINTS.UPLOAD_FILE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 10000,
        });

        return uploadResponse.data.downloadPath;
    } catch (error: any) {
        console.error('Error uploading image:', error);
        throw error.response?.data || error.message || error;
    }
}

export async function fetchPosts(eventId: string, page: number, size: number): Promise<any> {
    const axiosInstance = getAxiosInstance();
    try {
        const response = await axiosInstance.get(
            API_ENDPOINTS.GET_ALL_POSTS.replace("{eventId}", eventId),
            {
                params: {
                    page,
                    size,
                },
                timeout: 10000,
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching posts:", error);
        throw error.response?.data || error;
    }
}

const imageCache: Record<string, string> = {};

export async function fetchImage(filePath: string, retries: number = 3): Promise<string | null> {
    if (imageCache[filePath]) {
        return imageCache[filePath];
    }

    const axiosInstance = getAxiosInstance();
    for (var i = 0; i < retries; i++) {
        try {
            const headResponse = await axiosInstance.head(
                API_ENDPOINTS.GET_FILE.replace("{objectPath}", filePath)
            );
            console.log(`HEAD response for ${filePath}:`);
            const contentLength = headResponse.headers['content-length'];
            if (contentLength && parseInt(contentLength) > 3 * 1024 * 1024) { // 3MB
                console.warn(`Image too large (${Math.round(parseInt(contentLength) / 1024 / 1024)}MB): ${filePath}`);
                return null;
            }
            console.log('Image size is acceptable. Proceeding to fetch the image.');
            const response = await axiosInstance.get(
                API_ENDPOINTS.GET_FILE.replace("{objectPath}", filePath),
                {
                    responseType: 'blob',
                    timeout: 100000
                }
            );
            console.log(`Image fetched successfully: ${filePath}`);
            const result = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(response.data);
            });
            console.log(`Image converted to base64: ${filePath}`);
            imageCache[filePath] = result;
            return result;

        } catch (error) {
            console.warn(`Attempt ${i + 1} failed for image ${filePath}`);        }
    }
    return null;
}