export interface Event {
    id: string;
    eventName: string;
    eventType: string; 
    sportType: string; 
    date: string;
    startTime: string;
    endTime: string;
    description: string;
    cutOffTime: string;
    requiredSkillLevel: string[];
    maxParticipants: number;
    participants: {
      userId: string; 
      attendStatus: "JOINED" | "CONFIRMED" | "PENDING" | "DECLINED" | null; 
      joinedOn?: string; 
    }[];
    locationResponse: {
      name: string; 
      streetNumber: string;
      streetName: string;
      city: string;
      province: string;
      country: string; 
      postalCode: string; 
      addressLine2?: string; 
      phoneNumber?: string; 
      latitude?: string; 
      longitude?: string; 
    };
    createdBy: string; 
    teams?: {
      teamId: string;
    }[]; 
    isPrivate: boolean; 
    whitelistedUsers?: string[];
  };