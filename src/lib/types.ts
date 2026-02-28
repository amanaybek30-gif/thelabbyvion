export interface Participant {
  id: string;
  name: string;
  email: string;
  teamName: string;
  isWinner: boolean;
  awardTitle?: string;
  status: 'pending' | 'sent';
  groupId?: string;
}

export interface Group {
  id: string;
  businessName: string;
  tagline: string;
  memberIds: string[];
}

export interface EventConfig {
  eventName: string;
  eventDate: string;
  edition: string;
}
