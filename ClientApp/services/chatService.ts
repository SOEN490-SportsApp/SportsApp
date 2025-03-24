import { getAxiosInstance } from '@/services/axiosInstance';
import { getAxiosLocalInstance } from '@/services/axiosLocalInstance';
import { API_ENDPOINTS } from '@/utils/api/endpoints';
import {store} from "@/state/store";

// API_ENDPOINTS.GET_CHATROOM
export const getChatroom = async (chatroomId: string) => {
  try {
    const axiosLocalInstance = getAxiosLocalInstance();
    const response = await axiosLocalInstance.get(API_ENDPOINTS.GET_CHATROOM.replace("{chatroomId}", chatroomId));
    return response.data;
  } catch (error) {
    console.error("Error fetching chatroom:", error);
    throw error;
  }
};

// API_ENDPOINTS.GET_CHATROOMS
export const getChatrooms = async (userId: string) => {

  try {
    const axiosLocalInstance = getAxiosLocalInstance();
    const response = await axiosLocalInstance.get(
        API_ENDPOINTS.GET_CHATROOMS.replace("{userId}", userId));
    return response.data;
  } catch (error) {
    console.error('Error fetching chatrooms:', error);
    throw error;
  }
};

// API_ENDPOINTS.GET_MESSAGES
export const getMessages = async (chatroomId: string) => {

  try {
    const axiosLocalInstance = getAxiosLocalInstance();
    const response = await axiosLocalInstance.get(
        API_ENDPOINTS.GET_MESSAGES.replace("{chatroomId}", chatroomId));
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

