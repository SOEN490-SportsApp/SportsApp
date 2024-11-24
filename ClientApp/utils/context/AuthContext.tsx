import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { API_ENDPOINTS } from '../api/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";



interface AuthContextData {
  userID: string | null;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshAccessToken: () => Promise<string | null>;
  setRegistrationUserId: (userId: string) => Promise<void>
  getRegistrationUserId: () => Promise<string|null>
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const logoutRequested = useRef(false);
  let timeoutVariable: NodeJS.Timeout | null = null;
  const [userID, setUserID] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Retrieve refresh token from SecureStore
  const getRegistrationUserId = async (): Promise<string | null> => await AsyncStorage.getItem('registrationUserId')
  const setRegistrationUserId = async (userId: string): Promise<void> => await AsyncStorage.setItem('registrationUserId', userId);
  const getRefreshToken = async (): Promise<string | null> => await AsyncStorage.getItem('refreshToken');
  const getAccessToken = async (): Promise<string | null> => await AsyncStorage.getItem('accessToken');
  const setAccessToken = async (token: string): Promise<void> => await AsyncStorage.setItem('accessToken', token);
  const setRefreshToken = async (token: string): Promise<void> => await AsyncStorage.setItem('refreshToken', token);
  const removeAccessToken = async (): Promise<void> => await AsyncStorage.removeItem('accessToken');
  const removeRefreshToken = async (): Promise<void> => await AsyncStorage.removeItem('refreshToken');
  const refreshAccessToken = async (): Promise<string | null> => {
    console.log(`[${new Date().toLocaleTimeString()}] (refreshAccessToken): logoutRequested is: `,logoutRequested.current)
    if (logoutRequested.current) {
      console.log(`[${new Date().toLocaleTimeString()}] (refreshAccessToken): logout requested, returning null`);
      return null;
    }
    
    const refreshToken = await getRefreshToken();
    
    if (!refreshToken) {
        console.log(`[${new Date().toLocaleTimeString()}] (refreshAccessToken): No refresh token found will logout and push`);
        return null;
    }
    
    //TODO make the isTokenExpired function to check if the token is expired
    // Decode and check expiration of refresh token
    const payload = JSON.parse(atob(refreshToken.split('.')[1]));
    const now = Math.ceil(Date.now() / 1000);
    if (payload.exp <= now) { //TODO not sure if this works yet, never been tested yet.
        console.error('Refresh token has expired. User needs to log in again.');
        logout(); 
        return null;
    }
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
      if(newAccessToken && newRefreshToken){
        console.log(`[${new Date().toLocaleTimeString()}] (AuthContext refreshAccessToken) Recieved new tokens`);
      }

      setAccessToken(newAccessToken); // Update access token in storage
      setRefreshToken(newRefreshToken); // Update refresh token in storage      
      // console.log(`[${new Date().toLocaleTimeString()}] From refreshAccessToken: tokens refreshed:\nnewAccessToken:`, newAccessToken, "\nnewRefreshToken:", newRefreshToken);

      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      return null;
    }
  };

  // Schedule token refresh based on the access token's expiration
  const scheduleTokenRefresh = async () => {
    if (logoutRequested.current) {
      console.log(`[${new Date().toLocaleTimeString()}] (scheduleTokenRefresh): logout requested, returning`);
      return;
    }

    // Clear any existing timer to remove any duplicate timers
    if (timeoutVariable) {
      clearTimeout(timeoutVariable);
    }

    const accessToken = await getAccessToken();
    if (!accessToken) return;

    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const now = Date.now() / 1000;
    const refreshTime = (payload.exp - now - 60) * 1000;

    if (refreshTime > 0) {
      console.log(`[${new Date().toLocaleTimeString()}] (scheduleTokenRefresh): token will refresh in ${(refreshTime / 1000 / 60).toFixed(2)} minutes.\n\n`);
      timeoutVariable = setTimeout(async () => {
        if (logoutRequested.current) {
          console.log(`[${new Date().toLocaleTimeString()}] (refreshAccessToken): logout requested, returning null`);
          return;
        }
        const newToken = await refreshAccessToken();
        if (newToken) {
          await scheduleTokenRefresh();
        } else {
          logout();
        }
      }, refreshTime);
    }
  };

  // Login function to set access and refresh tokens
  const login = async (identifier: string, password: string): Promise<{ success: boolean; data:{identifier: string}, error?: string }> => {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    if( !accessToken && !refreshToken){
      console.log(`[${new Date().toLocaleTimeString()}] (AuthContext login) before login No tokens were stored , which is good!`);
      console.log(`[${new Date().toLocaleTimeString()}] (AuthContext login) before login userID is: `, userID, ` isAuthenticated is: `, isAuthenticated);
    }
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, { identifier, password });
      
      if (response.status === 200) {
        const { userID, tokenResponse: { accessToken, refreshToken } } = response.data;
        // Reset logoutRequested to false when logging in
        logoutRequested.current = false;
        setAccessToken(accessToken);  // Set access token in SecureStorage
        setUserID(userID);            // Set user ID in state
        setRefreshToken(refreshToken);  // Store refresh token in SecureStore
        setIsAuthenticated(true);
        
        console.log(`[${new Date().toLocaleTimeString()}] (AuthContext login) Login successful with userID: `, userID); //, "\naccessToken: ", accessToken, "\nrefreshToken: ", refreshToken
        // console.log("Content of AsyncStorage after login: \naccessToken: ", await AsyncStorage.getItem('accessToken'), "\nrefreshToken: ", await AsyncStorage.getItem('refreshToken'));
        scheduleTokenRefresh(); // Schedule refresh
        return { success: true, data:{identifier: identifier}}; // Return success for the calling component
      } else {
        return { success: false, data:{identifier: identifier}, error: "Unexpected response status" };
      }
    } catch (error) {
      console.error("Login error from AuthContext:", error);
      if (error instanceof Error) {
        return { success: false, data:{identifier: identifier}, error: error.message };
      } else {
        return { success: false, data:{identifier: identifier}, error: "Failed to Login." };
      }
    }
  };

  // Logout function: clears access token from state and refresh token from SecureStore
  // TODO to be udpated with a call to the logout endpoint
  const logout = async () => {
    logoutRequested.current = true;
    console.log(`[${new Date().toLocaleTimeString()}] (AuthContext logout) logoutRequested is: `, logoutRequested.current);
    clearTimeout(timeoutVariable!);
    removeAccessToken();
    removeRefreshToken();
    setUserID(null);
    setIsAuthenticated(false);
    router.dismissAll();
    router.replace('/auth/login');

    if (logoutRequested.current &&
      (await getAccessToken() === null) &&
      (await getRefreshToken() === null)
    ) {
      console.log(`[${new Date().toLocaleTimeString()}] (AuthContext logout) Logout successful`);
    }
  };

  return (
    <AuthContext.Provider value={{ userID, login, logout, isAuthenticated, refreshAccessToken, setRegistrationUserId, getRegistrationUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
