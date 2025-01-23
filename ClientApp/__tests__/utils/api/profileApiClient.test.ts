import { registerProfile, getProfile, updateProfile } from '@/utils/api/profileApiClient';
import { getAxiosInstance } from '@/services/axiosInstance';
import { API_ENDPOINTS } from '@/utils/api/endpoints';
import { mapProfiletoApiRequest } from '@/utils/mappers/apiMappers';
import { Profile } from '@/types';

jest.mock('@/services/axiosInstance', () => ({
    getAxiosInstance: jest.fn(),
}));

jest.mock('@/utils/mappers/apiMappers', () => ({
    mapProfiletoApiRequest: jest.fn(),
}));

describe('Profile Service Tests', () => {
    const mockUserId = '123';
    const mockProfile: Profile = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        postalCode: '12345',
        phoneNumber: '123-456-7890',
        sportsOfPreference: [{ name: 'Soccer', ranking: 'Advanced' }],
        ranking: 'A',
    };

    const mockMappedProfileData = { ...mockProfile, role: 'User' };
    const mockApiResponse = { data: { ...mockProfile } };

    describe('registerProfile', () => {
        it('should successfully register a profile', async () => {
            // Arrange
            const mockAxiosInstance = {
                patch: jest.fn().mockResolvedValue(mockApiResponse),
            };
            (getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance);
            (mapProfiletoApiRequest as jest.Mock).mockReturnValue(mockMappedProfileData);

            // Act
            const result = await registerProfile(mockProfile, mockUserId);

            // Assert
            expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
                API_ENDPOINTS.UPDATE_PROFILE.replace('{userId}', mockUserId),
                mockMappedProfileData
            );
            expect(result).toEqual(mockApiResponse);
        });

        it('should throw an error when profile registration fails', async () => {
            // Arrange
            const mockAxiosInstance = {
                patch: jest.fn().mockRejectedValue({ response: { data: 'Error updating profile' } }),
            };
            (getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance);

            // Act & Assert
            await expect(registerProfile(mockProfile, mockUserId)).rejects.toEqual('Error updating profile');
            expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
                API_ENDPOINTS.UPDATE_PROFILE.replace('{userId}', mockUserId),
                mockMappedProfileData
            );
        });
    });

    describe('getProfile', () => {
        it('should return profile data when fetching successfully', async () => {
            // Arrange
            const mockAxiosInstance = {
                get: jest.fn().mockResolvedValue(mockApiResponse),
            };
            (getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance);

            // Act
            const result = await getProfile(mockUserId);

            // Assert
            expect(mockAxiosInstance.get).toHaveBeenCalledWith(
                API_ENDPOINTS.GET_USER_BY_ID.replace('{id}', mockUserId)
            );
            expect(result).toEqual(mockApiResponse.data);
        });

        it('should throw an error when fetching the profile fails', async () => {
            // Arrange
            const mockAxiosInstance = {
                get: jest.fn().mockRejectedValue({ response: { data: 'Error fetching profile' } }),
            };
            (getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance);

            // Act & Assert
            await expect(getProfile(mockUserId)).rejects.toEqual('Error fetching profile');
            expect(mockAxiosInstance.get).toHaveBeenCalledWith(
                API_ENDPOINTS.GET_USER_BY_ID.replace('{id}', mockUserId)
            );
        });

        it('should handle network errors when fetching profile', async () => {
            // Arrange
            const mockAxiosInstance = {
                get: jest.fn().mockRejectedValue(new Error('Network Error')),
            };
            (getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance);

            // Act & Assert
            await expect(getProfile(mockUserId)).rejects.toThrow('Network Error');
            expect(mockAxiosInstance.get).toHaveBeenCalledWith(
                API_ENDPOINTS.GET_USER_BY_ID.replace('{id}', mockUserId)
            );
        });

    });

    describe('updateProfile', () => {
        it('should successfully update the profile', async () => {
            // Arrange
            const mockAxiosInstance = {
                patch: jest.fn().mockResolvedValue(mockApiResponse),
            };
            (getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance);
            (mapProfiletoApiRequest as jest.Mock).mockReturnValue(mockMappedProfileData);

            // Act
            const result = await updateProfile(mockProfile, mockUserId);

            // Assert
            expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
                API_ENDPOINTS.UPDATE_PROFILE.replace('{userId}', mockUserId),
                mockMappedProfileData
            );
            expect(result).toEqual(mockApiResponse);
        });

        it('should throw an error when updating the profile fails', async () => {
            // Arrange
            const mockAxiosInstance = {
                patch: jest.fn().mockRejectedValue({ response: { data: 'Error updating profile' } }),
            };
            (getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance);

            // Act & Assert
            await expect(updateProfile(mockProfile, mockUserId)).rejects.toEqual('Error updating profile');
            expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
                API_ENDPOINTS.UPDATE_PROFILE.replace('{userId}', mockUserId),
                mockMappedProfileData
            );
        });
    });
});