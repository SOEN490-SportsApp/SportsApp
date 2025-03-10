import { API_ENDPOINTS } from '@/utils/api/endpoints';
import { getAxiosInstance } from '@/services/axiosInstance';

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
        const response = await fetch(fileUri);
        const blob = await response.blob();
        const fileName = fileUri.split('/').pop() || `upload_${Date.now()}`;
        const formData = new FormData();
        formData.append('file', blob, fileName);
        const uploadResponse = await axiosInstance.post(API_ENDPOINTS.UPLOAD_FILE, formData);
        return uploadResponse.data.downloadPath;
    } catch (error: any) {
        console.error('Error uploading image:', error);
        throw error.response?.data || error;
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
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching posts:", error);
        throw error.response?.data || error;
    }
}