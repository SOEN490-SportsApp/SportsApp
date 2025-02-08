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

    if (typeof serverError === 'string' && serverError.includes('invalid_grant')) {
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
      // Ensure error is logged as an Error object for consistency in tests
      console.error('Error Logging out user:', error instanceof Error ? error : new Error(String(error)));
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
    if (error.response?.status === 409) {
      throw new Error("This email or username is already registered. Please use a different one.");
    }
    if (error.response?.status === 400) {
      throw new Error("Invalid registration details. Please check your input and try again.");
    }
    if (__DEV__) {
      console.error('Registration failed:', error instanceof Error ? error : new Error(String(error)));
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
      console.error('Reset password failed:', err instanceof Error ? err : new Error(String(err)));
    }
    throw err.response?.data || err;
  }
}
export async function deleteUser(userId: string) {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.delete(API_ENDPOINTS.DELETE_PROFILE.replace('{userId}', userId));
    return response;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("The user account does not exist or has already been deleted.");
    }
    if (error.response?.status === 400) {
      throw new Error("Invalid request. Please check your input.");
    }
    if (__DEV__) {
      console.error('Delete user failed:', error instanceof Error ? error : new Error(String(error)));
    }
    throw error.response?.data || error;
  }
}



