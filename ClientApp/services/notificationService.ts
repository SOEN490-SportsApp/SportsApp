import { API_ENDPOINTS } from '@/utils/api/endpoints';
import { getAxiosInstance } from "@/services/axiosInstance";

export async function registerDevice(deviceToken: string) {
  try {
    const axiosInstance = getAxiosInstance();
    await axiosInstance.post(API_ENDPOINTS.REGISTER_DEVICE, {deviceToken: deviceToken});
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function unregisterDevice(deviceId: string) {
  try {
    const axiosInstance = getAxiosInstance();
    await axiosInstance.delete(API_ENDPOINTS.UNREGISTER_DEVICE.replace("{deviceId}", deviceId));
  } catch (error: any) {
    throw error.response?.data || error;
  }
}
