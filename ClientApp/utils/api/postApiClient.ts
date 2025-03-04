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