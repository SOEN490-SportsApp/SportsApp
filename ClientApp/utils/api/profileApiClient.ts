import { Profile } from "@/types";
import { getAxiosInstance } from "@/services/axiosInstance";
import { API_ENDPOINTS } from "./endpoints";
import { mapProfiletoApiRequest } from "../mappers/apiMappers";

export async function registerProfile(profile: Profile, userId: string) {
    const axiosInstance = getAxiosInstance();
    try {
        const data = mapProfiletoApiRequest(profile);
        const response = await axiosInstance.patch(API_ENDPOINTS.UPDATE_PROFILE.replace('{userId}', userId), data);
        return response;
    } catch (error: any) {
        console.error('Error updating profile:', error);
        throw error.response?.data || error;
    }
}

export async function getProfile(userId: string) {
    const axiosInstance = getAxiosInstance();
    try {
        const response = await axiosInstance.get<Profile>(API_ENDPOINTS.GET_USER_BY_ID.replace('{id}', userId));
        return response.data
    } catch (error: any) {
        console.error('Error fetching profile:', error);
        throw error.response?.data || error;
    }
}

export async function updateProfile(profile: Profile, userId: string) {
    const axiosInstance = getAxiosInstance();
    try {
        const data = mapProfiletoApiRequest(profile);
        const response = await axiosInstance.patch(
            API_ENDPOINTS.UPDATE_PROFILE.replace('{userId}', userId),
            data
        );
        return response;
    } catch (error: any) {
        console.error("Error updating profile:", error);
        throw error.response?.data || error;
    }
}

export async function getOtherUserProfile(userId: string) {
    const axiosInstance = getAxiosInstance();
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_USER_PROFILE.replace('{id}', userId));
        return response.data;
    } catch (error: any) {
        console.error('Error fetching other user profile:', error);
        throw error.response?.data || error;
    }
}

export async function getEventsByUserId(userId: string) {
    const axiosInstance = getAxiosInstance();
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_EVENTS_BY_USER_ID.replace("{userId}", userId));
        return response.data;
    } catch (error: any) {
        console.error("Error fetching events:", error);
        throw error.response?.data || error;
    }
}

export async function sendFriendRequest(senderUserId: string, receiverUserId: string) {
    const axiosInstance = getAxiosInstance();
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.SEND_FRIEND_REQUEST.replace("{userId}", senderUserId), { receiverUserId });
        return response.data;
    } catch (error: any) {
        console.error("Error sending friend request:", error);
        throw error.response?.data || error;
    }
}