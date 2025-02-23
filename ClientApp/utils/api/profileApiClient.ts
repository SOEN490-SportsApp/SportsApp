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

export async function getSentFriendRequests(userId: string) {
    const axiosInstance = getAxiosInstance();
    try {
        const response = await axiosInstance.get(
            `user-service/user/${userId}/friend-requests?type=SENT`
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching sent friend requests:", error);
        throw error.response?.data || error;
    }
}

export async function getReceivedFriendRequests(userId: string) {
    const axiosInstance = getAxiosInstance();
    try {
        const response = await axiosInstance.get(
            API_ENDPOINTS.RETRIEVE_USER_FRIEND_REQUESTS.replace("{userId}", userId) + "?type=RECEIVED"
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching received friend requests:", error);
        throw error.response?.data || error;
    }
}

export async function respondToFriendRequest(userId: string, senderId: string, requestId: string, action: "ACCEPT" | "DECLINE") {
    const axiosInstance = getAxiosInstance();
    try {
        const response = await axiosInstance.put(API_ENDPOINTS.RESPOND_TO_FRIEND_REQUEST.replace("{userId}", userId).replace("{requestId}", requestId), {
            friendRequestUserId: senderId,
            action,
        });
        return response.data;
    } catch (error: any) {
        console.error(`Error ${action.toLowerCase()}ing friend request:`, error);
        throw error.response?.data || error;
    }
}