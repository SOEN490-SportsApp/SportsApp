import { getAxiosInstance } from "@/services/axiosInstance";
import { clearTokens, saveTokens, startTokenRefresh, stopTokenRefresh } from "@/services/tokenService";
import { loginUser, logoutUser } from "@/services/authService";
import { useDispatch } from 'react-redux';
import { clearUser } from "@/state/user/userSlice";


jest.mock('@/services/axiosInstance', () => {
    const mockAxiosInstance = {
        post: jest.fn(),
    };
    return {
        getAxiosInstance: jest.fn(() => mockAxiosInstance),
    };
});

jest.mock('@/services/tokenService', () => ({
    clearTokens: jest.fn(),
    stopTokenRefresh: jest.fn(),
    saveTokens: jest.fn(),
    startTokenRefresh: jest.fn(),
}));

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
  }));

describe('Auth Service Tests', () => {
    let axiosInstance: any;

    beforeAll(() => {
        axiosInstance = getAxiosInstance();
    });


    afterEach(() => {
        jest.clearAllMocks();
    });


    it('should save tokens and start refresh timer upon successful login', async () => {
        const mockData = {
            userID: 123,
            tokenResponse: {
                accessToken: 'fake-access-token',
                refreshToken: 'fake-refresh-token',
            },
        };

        (axiosInstance.post as jest.Mock).mockResolvedValueOnce({ data: mockData });

        await loginUser('username', 'password');

        expect(saveTokens).toHaveBeenCalledWith(mockData.tokenResponse.accessToken, mockData.tokenResponse.refreshToken);
        expect(startTokenRefresh).toHaveBeenCalledTimes(1);
    });

    it('should throw error on login failure', async () => {
        (getAxiosInstance().post as jest.Mock).mockRejectedValueOnce(new Error('Login failed'));

        await expect(loginUser('username', 'password')).rejects.toThrow('Login failed');
        expect(saveTokens).not.toHaveBeenCalled();
        expect(startTokenRefresh).not.toHaveBeenCalled();
    });

    it('should clear tokens and stop refresh timer on logout', async () => {
        const mockDispatch = jest.fn();
        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (clearTokens as jest.Mock).mockResolvedValueOnce(true); // Simulate successful clear
        (stopTokenRefresh as jest.Mock).mockResolvedValueOnce(null); // Simulate successful stop

        await logoutUser(mockDispatch);

        expect(clearTokens).toHaveBeenCalledTimes(1);
        expect(stopTokenRefresh).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(clearUser());
    });
});