import { saveTokens, clearTokens, startTokenRefresh, stopTokenRefresh } from './tokenService';
import { API_ENDPOINTS } from '@/utils/api/endpoints';
import { clearUser } from '@/state/user/userSlice';
import { useDispatch } from 'react-redux';
import { getAxiosInstance } from './axiosInstance';

export async function loginUser(identifier: string, password: string) {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, { identifier, password });
    const { userID, tokenResponse: { accessToken, refreshToken } } = response.data;
    await saveTokens(accessToken, refreshToken);
    startTokenRefresh();
    return response.data;
  } catch (error: any) {
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