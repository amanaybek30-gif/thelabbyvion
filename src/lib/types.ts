export interface Participant {
  id: string;
  name: string;
  email: string;
  teamName: string;
  isWinner: boolean;
  awardTitle?: string;
  status: 'pending' | 'sent';
}

export interface EventConfig {
  eventName: string;
  eventDate: string;
  edition: string;
}
