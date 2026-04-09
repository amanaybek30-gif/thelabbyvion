import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Participant, Group } from './types';

interface AppState {
  participants: Participant[];
  groups: Group[];
  isAuthenticated: boolean;
  searchQuery: string;
  certificateTemplateUrl: string | null;
  setCertificateTemplateUrl: (url: string | null) => void;
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

// Lazy import to avoid circular deps
const getDb = () => import('@/hooks/useRealtimeSync');

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      participants: [],
      groups: [],
      isAuthenticated: false,
      searchQuery: '',
      setParticipants: (participants) => set({ participants }),
      addParticipants: (newP) => {
        set((s) => ({ participants: [...s.participants, ...newP] }));
        getDb().then(({ dbInsertParticipants }) => dbInsertParticipants(newP));
      },
      updateParticipant: (id, data) => {
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        }));
        getDb().then(({ dbUpdateParticipant }) => dbUpdateParticipant(id, data));
      },
      removeParticipant: (id) => {
        const groupsBefore = get().groups;
        set((s) => ({
          participants: s.participants.filter((p) => p.id !== id),
          groups: s.groups.map((g) => ({
            ...g,
            memberIds: g.memberIds.filter((mid) => mid !== id),
          })),
        }));
        getDb().then(({ dbDeleteParticipant }) => dbDeleteParticipant(id));
        groupsBefore.forEach((g) => {
          if (g.memberIds.includes(id)) {
            getDb().then(({ dbUpdateGroup }) =>
              dbUpdateGroup(g.id, { memberIds: g.memberIds.filter((mid) => mid !== id) })
            );
          }
        });
      },
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      toggleWinner: (id) => {
        const p = get().participants.find((x) => x.id === id);
        if (!p) return;
        const newVal = !p.isWinner;
        set((s) => ({
          participants: s.participants.map((x) =>
            x.id === id ? { ...x, isWinner: newVal } : x
          ),
        }));
        getDb().then(({ dbUpdateParticipant }) => dbUpdateParticipant(id, { isWinner: newVal }));
      },
      setAwardTitle: (id, awardTitle) => {
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === id ? { ...p, awardTitle } : p
          ),
        }));
        getDb().then(({ dbUpdateParticipant }) => dbUpdateParticipant(id, { awardTitle }));
      },
      markSent: (id) => {
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === id ? { ...p, status: 'sent' as const } : p
          ),
        }));
        getDb().then(({ dbUpdateParticipant }) => dbUpdateParticipant(id, { status: 'sent' }));
      },
      addGroup: (group) => {
        set((s) => ({ groups: [...s.groups, group] }));
        getDb().then(({ dbInsertGroup }) => dbInsertGroup(group));
      },
      updateGroup: (id, data) => {
        set((s) => ({
          groups: s.groups.map((g) => (g.id === id ? { ...g, ...data } : g)),
        }));
        getDb().then(({ dbUpdateGroup }) => dbUpdateGroup(id, data));
      },
      removeGroup: (id) => {
        const participantsBefore = get().participants;
        set((s) => ({
          groups: s.groups.filter((g) => g.id !== id),
          participants: s.participants.map((p) =>
            p.groupId === id ? { ...p, groupId: undefined } : p
          ),
        }));
        getDb().then(({ dbDeleteGroup }) => dbDeleteGroup(id));
        participantsBefore.forEach((p) => {
          if (p.groupId === id) {
            getDb().then(({ dbUpdateParticipant }) =>
              dbUpdateParticipant(p.id, { groupId: undefined })
            );
          }
        });
      },
      addMemberToGroup: (groupId, participantId) => {
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId && g.memberIds.length < 5 && !g.memberIds.includes(participantId)
              ? { ...g, memberIds: [...g.memberIds, participantId] }
              : g
          ),
          participants: s.participants.map((p) =>
            p.id === participantId ? { ...p, groupId } : p
          ),
        }));
        const group = get().groups.find((g) => g.id === groupId);
        if (group) {
          getDb().then(({ dbUpdateGroup }) => dbUpdateGroup(groupId, { memberIds: group.memberIds }));
        }
        getDb().then(({ dbUpdateParticipant }) => dbUpdateParticipant(participantId, { groupId }));
      },
      removeMemberFromGroup: (groupId, participantId) => {
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId
              ? { ...g, memberIds: g.memberIds.filter((id) => id !== participantId) }
              : g
          ),
          participants: s.participants.map((p) =>
            p.id === participantId ? { ...p, groupId: undefined } : p
          ),
        }));
        const group = get().groups.find((g) => g.id === groupId);
        if (group) {
          getDb().then(({ dbUpdateGroup }) => dbUpdateGroup(groupId, { memberIds: group.memberIds }));
        }
        getDb().then(({ dbUpdateParticipant }) => dbUpdateParticipant(participantId, { groupId: undefined }));
      },
    }),
    {
      name: 'vion-lab-store',
      partialize: (state) => ({
        participants: state.participants,
        groups: state.groups,
      }),
    }
  )
);
