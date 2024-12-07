import { UserState } from '@/types';

export const mapApiResponseToUserState = (apiResponse: any): UserState => {
  return {
    id: apiResponse.id || "",
    keycloakId: apiResponse.keycloakId || "",
    email: apiResponse.email || "",
    username: apiResponse.username || "",
    profile: {
      firstName: apiResponse.profile?.firstName || "",
      lastName: apiResponse.profile?.lastName || "",
      dateOfBirth: apiResponse.profile?.dateOfBirth || "",
      gender: apiResponse.profile?.gender || "",
      postalCode: apiResponse.profile?.postalCode || "",
      phoneNumber: apiResponse.profile?.phoneNumber || "",
      sportsOfPreference: apiResponse.profile?.sportsOfPreference?.map((sport: any) => ({
        name: sport.name || "",
        ranking: sport.ranking || "",
      })) || [],
      ranking: apiResponse.profile?.ranking || "",
    },
    preferences: {
      notifications: apiResponse.preferences?.notifications || false,
      language: apiResponse.preferences?.language || "en",
    },
  };
};
