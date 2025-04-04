export interface Participant {
  userId: string;
  attendStatus: "JOINED" | "CONFIRMED" | "PENDING" | "DECLINED" | null;
  joinedOn?: string;
}

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
  participants: Participant[]; 
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
    coordinates?: {
      coordinates: number[];
      type: string;
    };
  };
  createdBy: string;
  teams?: {
    teamId: string;
  }[];
  isPrivate: boolean;
  whitelistedUsers?: string[];
  far: number;
  cancellation?: {
    cancelledAt: string;
    cancelledBy: string;
    reason: string;
  };
}
