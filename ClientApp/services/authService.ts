import { saveTokens, clearTokens, startTokenRefresh, stopTokenRefresh } from './tokenService';
import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '@/utils/api/endpoints';

export async function loginUser(identifier: string, password: string) {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, { identifier, password });
    const { userID, tokenResponse: { accessToken, refreshToken } } = response.data;
    console.log("============= ACCESS TOKEN ==>" , accessToken)
    console.log("============= REFRESH TOKEN ==>" , refreshToken)
    await saveTokens(accessToken, refreshToken);
    startTokenRefresh();
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await clearTokens();
    stopTokenRefresh();
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
}
