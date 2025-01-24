import { saveTokens, clearTokens, startTokenRefresh, stopTokenRefresh } from './tokenService';
import { API_ENDPOINTS } from '@/utils/api/endpoints';
import { clearUser } from '@/state/user/userSlice';
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

      if (typeof serverError === "string" && serverError.includes("invalid_grant")) {
          throw new Error(ALERT_MESSAGES.invalidCredentials.message);
      }
      throw error.response?.data || error;
  }
}

export async function logoutUser(dispatch: any) {
  try {
    await clearTokens();
    dispatch(clearUser());
    stopTokenRefresh();
  } catch (error: any) {
    if (__DEV__) {
        console.error('Error Logging out user:', error.message || error);
    }
    throw error.response?.data || error;
  }
}

export async function registerUser(email: string, username: string, password: string) {
  const axiosInstance = getAxiosInstance();
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, { email, username, password });
    return response;
  } catch (error: any) {
    if (__DEV__) {
        console.error("Registration failed:", error.message || error);
    }
    throw error.response?.data || error;
  }
}

export async function resetPassword(email: string) {
  const axiosInstance = getAxiosInstance();
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.RESET_PASSWORD, { email });
    return response;
  } catch (err: any) {
    if (__DEV__) {
        console.error("Reset password failed:", err.message || err);
    }
    throw err.response?.data || err;
  }
}
