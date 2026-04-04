import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/lib/store';
import { Participant, Group } from '@/lib/types';
import { toast } from 'sonner';

// Maps DB row to app Participant
const toParticipant = (row: any): Participant => ({
  id: row.id,
  name: row.name,
  email: row.email,
  teamName: row.team_name || '',
  isWinner: row.is_winner || false,
  awardTitle: row.award_title || undefined,
  status: row.status || 'pending',
  groupId: row.group_id || undefined,
});

// Maps DB row to app Group
const toGroup = (row: any): Group => ({
  id: row.id,
  businessName: row.business_name,
  tagline: row.tagline,
  memberIds: row.member_ids || [],
  photoUrl: row.photo_url || undefined,
});

// Maps app Participant to DB row
const toParticipantRow = (p: Participant) => ({
  id: p.id,
  name: p.name,
  email: p.email,
  team_name: p.teamName,
  is_winner: p.isWinner,
  award_title: p.awardTitle || null,
  status: p.status,
  group_id: p.groupId || null,
});

// Maps app Group to DB row
const toGroupRow = (g: Group) => ({
  id: g.id,
  business_name: g.businessName,
  tagline: g.tagline,
  member_ids: g.memberIds,
  photo_url: g.photoUrl || null,
});

export const useRealtimeSync = () => {
  const syncDone = useRef(false);

  useEffect(() => {
    if (syncDone.current) return;
    syncDone.current = true;

    const loadAndSync = async () => {
      // Fetch DB data
      const [{ data: pData }, { data: gData }] = await Promise.all([
        supabase.from('participants').select('*').order('created_at'),
        supabase.from('groups').select('*').order('created_at'),
      ]);

      const dbParticipants = (pData || []).map(toParticipant);
      const dbGroups = (gData || []).map(toGroup);

      // Get local data (persisted via localStorage)
      const localParticipants = useAppStore.getState().participants;
      const localGroups = useAppStore.getState().groups;

      if (dbParticipants.length > 0 || dbGroups.length > 0) {
        // DB has data — use it as source of truth, merge any local-only items
        const dbPIds = new Set(dbParticipants.map((p) => p.id));
        const dbGIds = new Set(dbGroups.map((g) => g.id));

        const localOnlyP = localParticipants.filter((p) => !dbPIds.has(p.id));
        const localOnlyG = localGroups.filter((g) => !dbGIds.has(g.id));

        // Push local-only data to DB
        if (localOnlyP.length > 0) {
          await supabase.from('participants').upsert(localOnlyP.map(toParticipantRow) as any);
        }
        if (localOnlyG.length > 0) {
          await supabase.from('groups').upsert(localOnlyG.map(toGroupRow) as any);
        }

        // Set merged state
        useAppStore.getState().setParticipants([...dbParticipants, ...localOnlyP]);
        useAppStore.setState({ groups: [...dbGroups, ...localOnlyG] });
      } else if (localParticipants.length > 0 || localGroups.length > 0) {
        // DB is empty but local has data — push everything to DB
        console.log(`Syncing ${localParticipants.length} participants and ${localGroups.length} groups to cloud...`);

        if (localParticipants.length > 0) {
          const { error: pErr } = await supabase
            .from('participants')
            .upsert(localParticipants.map(toParticipantRow) as any);
          if (pErr) console.error('Failed to sync participants:', pErr);
        }
        if (localGroups.length > 0) {
          const { error: gErr } = await supabase
            .from('groups')
            .upsert(localGroups.map(toGroupRow) as any);
          if (gErr) console.error('Failed to sync groups:', gErr);
        }

        toast.success(`Synced ${localParticipants.length} participants and ${localGroups.length} groups to cloud`);
      }
    };

    loadAndSync();

    // Realtime subscription
    const channel = supabase
      .channel('sync-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, (payload) => {
        const store = useAppStore.getState();
        if (payload.eventType === 'INSERT') {
          const newP = toParticipant(payload.new);
          if (!store.participants.find((p) => p.id === newP.id)) {
            useAppStore.setState({ participants: [...store.participants, newP] });
          }
        } else if (payload.eventType === 'UPDATE') {
          const updated = toParticipant(payload.new);
          useAppStore.setState({
            participants: store.participants.map((p) => (p.id === updated.id ? updated : p)),
          });
        } else if (payload.eventType === 'DELETE') {
          useAppStore.setState({
            participants: store.participants.filter((p) => p.id !== (payload.old as any).id),
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'groups' }, (payload) => {
        const store = useAppStore.getState();
        if (payload.eventType === 'INSERT') {
          const newG = toGroup(payload.new);
          if (!store.groups.find((g) => g.id === newG.id)) {
            useAppStore.setState({ groups: [...store.groups, newG] });
          }
        } else if (payload.eventType === 'UPDATE') {
          const updated = toGroup(payload.new);
          useAppStore.setState({
            groups: store.groups.map((g) => (g.id === updated.id ? updated : g)),
          });
        } else if (payload.eventType === 'DELETE') {
          useAppStore.setState({
            groups: store.groups.filter((g) => g.id !== (payload.old as any).id),
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
};

// DB write helpers
export const dbInsertParticipants = async (participants: Participant[]) => {
  const rows = participants.map(toParticipantRow);
  const { error } = await supabase.from('participants').upsert(rows as any);
  if (error) console.error('Failed to insert participants:', error);
};

export const dbUpdateParticipant = async (id: string, data: Partial<Participant>) => {
  const update: any = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.email !== undefined) update.email = data.email;
  if (data.teamName !== undefined) update.team_name = data.teamName;
  if (data.isWinner !== undefined) update.is_winner = data.isWinner;
  if (data.awardTitle !== undefined) update.award_title = data.awardTitle;
  if (data.status !== undefined) update.status = data.status;
  if (data.groupId !== undefined) update.group_id = data.groupId;
  if ('groupId' in data && data.groupId === undefined) update.group_id = null;

  const { error } = await supabase.from('participants').update(update).eq('id', id);
  if (error) console.error('Failed to update participant:', error);
};

export const dbDeleteParticipant = async (id: string) => {
  const { error } = await supabase.from('participants').delete().eq('id', id);
  if (error) console.error('Failed to delete participant:', error);
};

export const dbInsertGroup = async (group: Group) => {
  const { error } = await supabase.from('groups').upsert([toGroupRow(group)] as any);
  if (error) console.error('Failed to insert group:', error);
};

export const dbUpdateGroup = async (id: string, data: Partial<Group>) => {
  const update: any = {};
  if (data.businessName !== undefined) update.business_name = data.businessName;
  if (data.tagline !== undefined) update.tagline = data.tagline;
  if (data.memberIds !== undefined) update.member_ids = data.memberIds;
  if (data.photoUrl !== undefined) update.photo_url = data.photoUrl;

  const { error } = await supabase.from('groups').update(update).eq('id', id);
  if (error) console.error('Failed to update group:', error);
};

export const dbDeleteGroup = async (id: string) => {
  const { error } = await supabase.from('groups').delete().eq('id', id);
  if (error) console.error('Failed to delete group:', error);
};
