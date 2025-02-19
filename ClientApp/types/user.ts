export interface SportPreference {
    name: string;
    ranking: string;
  }
  
  export interface Profile {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    postalCode?: string;
    phoneNumber?: string;
    sportsOfPreference: SportPreference[];
    ranking?: string;
  }
  
  export interface Preferences {
    notifications: boolean;
    language: string;
  }
  
  export interface UserState {
    id: string;
    keycloakId: string;
    email: string;
    username: string;
    profile: Profile;
    preferences: Preferences;
  }
  

  export interface Friend {
    FriendId: string;
    friendUserId: string;
    friendUsername: string;
  }