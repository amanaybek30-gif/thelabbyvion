import { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Users, Send, X, UserPlus, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || 'oerntmppsvicukdaadrt'}.supabase.co`;

const sendEliteCircleEmail = async (participant: { name: string; email: string }, group: { businessName: string; tagline: string }) => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-certificate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: participant.name,
      email: participant.email,
      isGroup: true,
      businessName: group.businessName,
      tagline: group.tagline,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send');
  return data;
};

const GroupManager = () => {
  const { groups, participants, addGroup, removeGroup, updateGroup, addMemberToGroup, removeMemberFromGroup, markSent } = useAppStore();
  const [newBusiness, setNewBusiness] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [addingMember, setAddingMember] = useState<string | null>(null);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [sending, setSending] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState<Set<string>>(new Set());
  const addParticipants = useAppStore((s) => s.addParticipants);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusiness.trim() || !newTagline.trim()) {
      toast.error('Business name and tagline are required');
      return;
    }
    addGroup({
      id: `g-${Date.now()}`,
      businessName: newBusiness.trim(),
      tagline: newTagline.trim(),
      memberIds: [],
    });
    setNewBusiness('');
    setNewTagline('');
    toast.success('Group created');
  };

  const handleAddMember = (groupId: string) => {
    if (!memberName.trim() || !memberEmail.trim()) {
      toast.error('Name and email are required');
      return;
    }
    const group = groups.find((g) => g.id === groupId);
    if (group && group.memberIds.length >= 5) {
      toast.error('Maximum 5 members per group');
      return;
    }
    const newId = `p-${Date.now()}`;
    addParticipants([{
      id: newId,
      name: memberName.trim(),
      email: memberEmail.trim(),
      teamName: group?.businessName || '',
      isWinner: false,
      status: 'pending',
      groupId,
    }]);
    addMemberToGroup(groupId, newId);
    setMemberName('');
    setMemberEmail('');
    setAddingMember(null);
    toast.success('Member added to group');
  };

  const handlePhotoUpload = async (groupId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setUploading((s) => new Set(s).add(groupId));
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${groupId}/photo.${ext}`;

      const { error } = await supabase.storage
        .from('group-photos')
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('group-photos')
        .getPublicUrl(path);

      updateGroup(groupId, { photoUrl: urlData.publicUrl });
      toast.success('Group photo uploaded!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      toast.error(msg);
    } finally {
      setUploading((s) => { const n = new Set(s); n.delete(groupId); return n; });
    }
  };

  const handleSendToGroup = async (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;
    const members = participants.filter((p) => group.memberIds.includes(p.id) && p.status !== 'sent');
    if (members.length === 0) {
      toast.info('All members already received their cards');
      return;
    }

    for (const member of members) {
      const key = `${groupId}-${member.id}`;
      setSending((s) => new Set(s).add(key));
      try {
        await sendEliteCircleEmail(member, group);
        markSent(member.id);
        toast.success(`Elite Circle card sent to ${member.name}`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        toast.error(`Failed to send to ${member.name}: ${msg}`);
      } finally {
        setSending((s) => { const n = new Set(s); n.delete(key); return n; });
      }
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-display font-semibold text-foreground">Elite Circle Groups</h2>
      </div>

      {/* Create Group Form */}
      <form onSubmit={handleCreateGroup} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Label className="sr-only">Business Name</Label>
          <Input placeholder="Business Name" value={newBusiness} onChange={(e) => setNewBusiness(e.target.value)} className="bg-secondary border-border font-body text-sm" />
        </div>
        <div className="flex-1">
          <Label className="sr-only">Tagline</Label>
          <Input placeholder="Tagline" value={newTagline} onChange={(e) => setNewTagline(e.target.value)} className="bg-secondary border-border font-body text-sm" />
        </div>
        <Button type="submit" className="bg-gold-gradient font-body text-sm shrink-0">
          <Plus className="w-4 h-4 mr-1" />
          Create Group
        </Button>
      </form>

      {/* Groups List */}
      {groups.length > 0 && (
        <div className="space-y-3">
          {groups.map((group) => {
            const members = participants.filter((p) => group.memberIds.includes(p.id));
            const allSent = members.length > 0 && members.every((m) => m.status === 'sent');
            const pendingCount = members.filter((m) => m.status !== 'sent').length;
            const isUploading = uploading.has(group.id);

            return (
              <div key={group.id} className="bg-card rounded-lg border border-border p-4 space-y-3">
                {/* Group Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Group Photo */}
                    <div className="shrink-0">
                      {group.photoUrl ? (
                        <div className="relative group/photo">
                          <img
                            src={group.photoUrl}
                            alt={`${group.businessName} photo`}
                            className="w-14 h-14 rounded-lg object-cover border border-border"
                          />
                          <button
                            onClick={() => fileInputRefs.current[group.id]?.click()}
                            className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <ImagePlus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRefs.current[group.id]?.click()}
                          disabled={isUploading}
                          className="w-14 h-14 rounded-lg border border-dashed border-border bg-secondary/50 flex items-center justify-center hover:border-primary/50 transition-colors"
                        >
                          <ImagePlus className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={(el) => { fileInputRefs.current[group.id] = el; }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(group.id, file);
                          e.target.value = '';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-display font-bold text-foreground truncate">{group.businessName}</h3>
                      <p className="text-xs text-muted-foreground font-body italic mt-0.5">"{group.tagline}"</p>
                      {isUploading && <p className="text-[10px] text-primary font-body mt-1">Uploading photo...</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline" className="text-[10px] border-border font-body">
                      {members.length}/5
                    </Badge>
                    {pendingCount > 0 && (
                      <Button
                        size="sm"
                        onClick={() => handleSendToGroup(group.id)}
                        className="h-7 px-2 text-xs bg-success hover:bg-success/90"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Send All
                      </Button>
                    )}
                    {allSent && (
                      <Badge className="bg-success/20 text-success border-0 text-[10px]">All Sent</Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeGroup(group.id)}
                      className="h-7 px-2 text-xs border-border text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Members */}
                {members.length > 0 && (
                  <div className="space-y-1">
                    {members.map((m) => (
                      <div key={m.id} className="flex items-center gap-2 text-xs font-body py-1 px-2 rounded bg-secondary/50">
                        <span className="text-foreground font-medium flex-1 truncate">{m.name}</span>
                        <span className="text-muted-foreground truncate max-w-[160px]">{m.email}</span>
                        {m.status === 'sent' ? (
                          <Badge className="bg-success/20 text-success border-0 text-[10px] shrink-0">Sent</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] border-border text-muted-foreground shrink-0">Pending</Badge>
                        )}
                        <button
                          onClick={() => removeMemberFromGroup(group.id, m.id)}
                          className="text-muted-foreground hover:text-destructive shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Member */}
                {members.length < 5 && (
                  addingMember === group.id ? (
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Input placeholder="Name" value={memberName} onChange={(e) => setMemberName(e.target.value)} className="bg-secondary border-border font-body text-xs h-8" />
                      </div>
                      <div className="flex-1">
                        <Input placeholder="Email" type="email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} className="bg-secondary border-border font-body text-xs h-8" />
                      </div>
                      <Button size="sm" onClick={() => handleAddMember(group.id)} className="h-8 px-3 text-xs bg-gold-gradient">Add</Button>
                      <Button size="sm" variant="outline" onClick={() => { setAddingMember(null); setMemberName(''); setMemberEmail(''); }} className="h-8 px-2 text-xs border-border">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingMember(group.id)}
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-body transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Add member ({members.length < 3 ? `min ${3 - members.length} more` : 'optional'})
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GroupManager;
