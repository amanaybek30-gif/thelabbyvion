import { create } from 'zustand';
import { Participant, Group } from './types';

interface AppState {
  participants: Participant[];
  groups: Group[];
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
  addGroup: (group: Group) => void;
  updateGroup: (id: string, data: Partial<Group>) => void;
  removeGroup: (id: string) => void;
  addMemberToGroup: (groupId: string, participantId: string) => void;
  removeMemberFromGroup: (groupId: string, participantId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  participants: [],
  groups: [],
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
      groups: s.groups.map((g) => ({
        ...g,
        memberIds: g.memberIds.filter((mid) => mid !== id),
      })),
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
  addGroup: (group) =>
    set((s) => ({ groups: [...s.groups, group] })),
  updateGroup: (id, data) =>
    set((s) => ({
      groups: s.groups.map((g) => (g.id === id ? { ...g, ...data } : g)),
    })),
  removeGroup: (id) =>
    set((s) => ({
      groups: s.groups.filter((g) => g.id !== id),
      participants: s.participants.map((p) =>
        p.groupId === id ? { ...p, groupId: undefined } : p
      ),
    })),
  addMemberToGroup: (groupId, participantId) =>
    set((s) => ({
      groups: s.groups.map((g) =>
        g.id === groupId && g.memberIds.length < 5 && !g.memberIds.includes(participantId)
          ? { ...g, memberIds: [...g.memberIds, participantId] }
          : g
      ),
      participants: s.participants.map((p) =>
        p.id === participantId ? { ...p, groupId } : p
      ),
    })),
  removeMemberFromGroup: (groupId, participantId) =>
    set((s) => ({
      groups: s.groups.map((g) =>
        g.id === groupId
          ? { ...g, memberIds: g.memberIds.filter((id) => id !== participantId) }
          : g
      ),
      participants: s.participants.map((p) =>
        p.id === participantId ? { ...p, groupId: undefined } : p
      ),
    })),
}));
