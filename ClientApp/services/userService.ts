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