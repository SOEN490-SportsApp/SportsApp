import { Profile } from "@/types";
import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "./endpoints";
import { mapProfiletoApiRequest } from "../mappers/apiMappers";

export async function registerProfile(profile: Profile, userId: string) {
    try{
        const data = mapProfiletoApiRequest(profile);
        const response = await axiosInstance.patch(API_ENDPOINTS.UPDATE_PROFILE.replace('{userId}', userId), data);
        return response;
    } catch (error: any){
        console.error('Error updating profile:', error);
        throw error.response?.data || error;
    }
}

export async function getProfile(userId: string) {
    try{
        const response = await axiosInstance.get<Profile>(API_ENDPOINTS.GET_USER_BY_ID.replace('{id}', userId));
        return response.data;
    } catch (error: any){
        console.error('Error fetching profile:', error);
        throw error.response?.data || error;
    }
}