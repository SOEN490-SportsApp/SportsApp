import { getAxiosInstance } from '@/services/axiosInstance';
import { API_ENDPOINTS } from '@/utils/api/endpoints';
import {store} from "@/state/store";
import { message } from '@/types/messaging';

// API_ENDPOINTS.GET_CHATROOM
export const getChatroom = async (chatroomId: string) => {
  try {
    const axiosLocalInstance = getAxiosInstance();
    const response = await axiosLocalInstance.get(API_ENDPOINTS.GET_CHATROOM.replace("{chatroomId}", chatroomId));
    return response.data;
  } catch (error) {
    console.error("Error fetching chatroom:", error);
    throw error;
  }
};

// API_ENDPOINTS.GET_CHATROOMS
export const getAllChatrooms = async (userId: string) => {

  try {
    const axiosLocalInstance = getAxiosInstance();
    const response = await axiosLocalInstance.get(API_ENDPOINTS.GET_All_CHATROOMS.replace("{userId}", userId));
    return response.data;
  } catch (error) {
    console.error('Error fetching chatrooms:', error);
    throw error;
  }
};

// API_ENDPOINTS.GET_MESSAGES
export const getMessages = async (chatroomId: string) => {

  try {
    const axiosLocalInstance = getAxiosInstance();
    const response = await axiosLocalInstance.get(
        API_ENDPOINTS.GET_MESSAGES.replace("{chatroomId}", chatroomId));
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// API_ENDPOINTS.CREATE_CHATROOM
export const createUserChatroom = async (createrId: string, chatWithUserId: string, nameOfChatRoom: string, messages: string[], isEvent: boolean, unread: boolean, creatorUsername: string, participantUsername: string) => {
  try {
    const axiosLocalInstance = getAxiosInstance();
    const response = await axiosLocalInstance.post(API_ENDPOINTS.CREATE_CHATROOM,
      {
        createdBy: createrId,
        chatroomName: nameOfChatRoom,
        members : [  
        {
          userId: createrId,
          username: creatorUsername,
          userImage: null
        },
        {
          userId: chatWithUserId,
          username: participantUsername,
          userImage: null
        }
        ],
        messages: messages,
        isEvent: isEvent,
        unread: unread
      }
    );
    console.log("createUserChatroom response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating chatroom:', error);
    throw error;
  }
}



// API_ENDPOINTS.DELETE_CHATROOM
export const deleteChatroom = async (chatroomId: string) => {
  try {
    const axiosLocalInstance = getAxiosInstance();
    const response = await axiosLocalInstance.delete(API_ENDPOINTS.DELETE_CHATROOM.replace("{chatroomId}", chatroomId));
    return response.data;
  } catch (error) {
    console.error('Error deleting chatroom:', error);
    throw error;
  }
};
