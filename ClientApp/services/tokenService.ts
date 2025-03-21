import { saveToSecureStore, getFromSecureStore, deleteFromSecureStore } from './secureStore';
import { API_ENDPOINTS } from '@/utils/api/endpoints';
import { getAxiosInstance } from './axiosInstance';

const ACCESS_TOKEN_PART1_KEY = 'accessTokenPart1';
const ACCESS_TOKEN_PART2_KEY = 'accessTokenPart2';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';

let tokenRefreshInterval: NodeJS.Timeout | null = null;

//#region Token Handlers
export async function saveTokens(accessToken: string, refreshToken: string) {
    const decoded = decodeJWT(accessToken);
    const expiryTime = decoded.exp * 1000;
    const { part1, part2 } = splitToken(accessToken);
    await saveToSecureStore(ACCESS_TOKEN_PART1_KEY, part1);
    await saveToSecureStore(ACCESS_TOKEN_PART2_KEY, part2);
    await saveToSecureStore(REFRESH_TOKEN_KEY, refreshToken);
    await saveToSecureStore(TOKEN_EXPIRY_KEY, expiryTime.toString());
}

export async function clearTokens() {
    await deleteFromSecureStore(ACCESS_TOKEN_PART1_KEY);
    await deleteFromSecureStore(ACCESS_TOKEN_PART2_KEY);
    await deleteFromSecureStore(REFRESH_TOKEN_KEY);
    await deleteFromSecureStore(TOKEN_EXPIRY_KEY);
}


export async function getAuthHeaders() {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) throw new Error('Access token not found');
        return { Authorization: `Bearer ${accessToken}` };
    } catch (error) {
        console.error('Error retrieving access token:', error);
        throw error;
    }
}

export async function refreshAccessToken() {
    const axiosInstance = getAxiosInstance();
    const refreshToken = await getFromSecureStore(REFRESH_TOKEN_KEY);
    if (!refreshToken) throw new Error('Refresh token not found');
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        await saveTokens(newAccessToken, newRefreshToken);
        return newAccessToken;
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        await clearTokens();
        throw error;
    }
}

export async function startTokenRefresh() {
    const expiryTime = await getFromSecureStore(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return;

    const expiresAt = parseInt(expiryTime, 10);
    const refreshTime = expiresAt - Date.now() - 1 * 60 * 1000; // Refresh 1 minute before expiration

    if (tokenRefreshInterval) clearTimeout(tokenRefreshInterval);
    tokenRefreshInterval = setTimeout(async () => {
        try {
            await refreshAccessToken();
            startTokenRefresh();
        } catch (error) {
            console.error('Failed to refresh token on scheduled refresh:', error);
        }
    }, Math.max(refreshTime, 0));
}

export function stopTokenRefresh() {
    if (tokenRefreshInterval) {
        clearTimeout(tokenRefreshInterval);
        tokenRefreshInterval = null;
    }
}
//#endregion

//#region Helpers
function decodeJWT(jwt: string): { exp: number } {
    try {
        const payload = JSON.parse(
            Buffer.from(
                jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'),
                'base64'
            ).toString('utf-8')
        );
        if (!payload.exp) {
            throw new Error('Token payload does not contain "exp" field.');
        }
        return payload;
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        throw new Error('Error decoding JWT');
    }
}

function splitToken(token: string): { part1: string, part2: string } {
    const middleIndex = Math.ceil(token.length / 2);
    return {
        part1: token.slice(0, middleIndex),
        part2: token.slice(middleIndex),
    };
}

function joinToken(part1: string, part2: string): string {
    return part1 + part2;
}

async function getAccessToken() {
    try {
    const part1 = await getFromSecureStore('accessTokenPart1');
    const part2 = await getFromSecureStore('accessTokenPart2');
    return joinToken(part1!, part2!);
    } catch (error){
        console.error("Error getting access token", error);
    }
}
//#endregion
