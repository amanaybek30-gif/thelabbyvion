import { create } from 'zustand';
import { Participant } from './types';

interface AppState {
  participants: Participant[];
  isAuthenticated: boolean;
  searchQuery: string;
  setParticipants: (p: Participant[]) => void;
  addParticipants: (p: Participant[]) => void;
  updateParticipant: (id: string, data: Partial<Participant>) => void;
  removeParticipant: (id: string) => void;
  setAuthenticated: (v: boolean) => void;
  setSearchQuery: (q: string) => void;
  toggleWinner: (id: string) => void;
  setAwardTitle: (id: string, title: string) => void;
  markSent: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  participants: [],
  isAuthenticated: false,
  searchQuery: '',
  setParticipants: (participants) => set({ participants }),
  addParticipants: (newP) =>
    set((s) => ({ participants: [...s.participants, ...newP] })),
  updateParticipant: (id, data) =>
    set((s) => ({
      participants: s.participants.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
    })),
  removeParticipant: (id) =>
    set((s) => ({
      participants: s.participants.filter((p) => p.id !== id),
    })),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  toggleWinner: (id) =>
    set((s) => ({
      participants: s.participants.map((p) =>
        p.id === id ? { ...p, isWinner: !p.isWinner } : p
      ),
    })),
  setAwardTitle: (id, awardTitle) =>
    set((s) => ({
      participants: s.participants.map((p) =>
        p.id === id ? { ...p, awardTitle } : p
      ),
    })),
  markSent: (id) =>
    set((s) => ({
      participants: s.participants.map((p) =>
        p.id === id ? { ...p, status: 'sent' as const } : p
      ),
    })),
}));
