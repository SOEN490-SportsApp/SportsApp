import { API_ENDPOINTS } from "@/utils/api/endpoints";
import { getAxiosInstance } from "./axiosInstance";


export async function searchUser(searchText: string){
    try{
        const axiosInstance = getAxiosInstance();
        const response = await axiosInstance.get(API_ENDPOINTS.SEARCH_USERS, {
            params:{
                firstName: searchText,
                lastName: ''
            }
        })
        return response.data.content
    }catch(error: any){
        console.log('here')
        console.log(error)
    }
} 
// Function to fetch user profile by ID
export const getUserProfile = async (userId: string) => {
    try {
      const axiosInstance = getAxiosInstance();
      console.log(API_ENDPOINTS.GET_PROFILE_BY_ID.replace("{userId}", userId))
      const response = await axiosInstance.get(API_ENDPOINTS.GET_PROFILE_BY_ID.replace("{userId}", userId));   
      return response.data.profile;
    } catch (error) {
      console.error(`Error fetching user ${userId} profile:`, error);
      return null;
    }
  };
 // Function to fetch friends of a user
export const getFriendsOfUser = async (userId: string) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_FRIENDS.replace("{userId}", userId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching friends of user ${userId}:`, error);
      return [];
    }
  };