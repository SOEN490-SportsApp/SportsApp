import { saveTokens, clearTokens, startTokenRefresh, stopTokenRefresh } from './tokenService';
import { API_ENDPOINTS } from '@/utils/api/endpoints';
import { clearUser } from '@/state/user/userSlice';
import { useDispatch } from 'react-redux';
import { getAxiosInstance } from './axiosInstance';
import { ALERT_MESSAGES } from '@/utils/api/errorHandlers';

export async function loginUser(identifier: string, password: string) {
  try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, { identifier, password });
      const { userID, tokenResponse: { accessToken, refreshToken } } = response.data;
      await saveTokens(accessToken, refreshToken);
      startTokenRefresh();
      return response.data;
  } catch (error: any) {
      const serverError = error.response?.data?.error;

      // Check for invalid credentials and throw a user-friendly error
      if (serverError?.includes("invalid_grant")) {
          throw new Error(ALERT_MESSAGES.invalidCredentials.message);
      }

      console.error('Login failed:', error);
      throw error.response?.data || error;
  }
}

export async function logoutUser(dispatch: any) {
  try {
    await clearTokens();
    dispatch(clearUser());
    stopTokenRefresh();
  } catch (error: any) {
    console.error('Error Loging out user:', error);
    throw error.response?.data || error;
  }
}

export async function registerUser(email: string, username: string, password: string) {
  const axiosInstance = getAxiosInstance();
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, {email, username, password});
    return response;
  } catch (error: any) {
    console.error("Registration failed:", error);    
    throw error.response?.data || error;
  }
}

export async function resetPassword(email: string){
  const axiosInstance = getAxiosInstance();
  try{
    const response = await axiosInstance.put(API_ENDPOINTS.RESET_PASSWORD, {email})
    return response;
  }catch(err: any){
    console.log("Reset password failed: ", err)
    throw err.response?.data || err;
  }
}