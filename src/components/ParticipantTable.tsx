import { useAppStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Trophy, Trash2, Send, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

const SUPABASE_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || 'oerntmppsvicukdaadrt'}.supabase.co`;

const sendCertificateEmail = async (participant: { name: string; email: string; awardTitle?: string; teamName: string }) => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-certificate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: participant.name,
      email: participant.email,
      awardTitle: participant.awardTitle,
      teamName: participant.teamName,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send');
  return data;
};

const AWARD_OPTIONS = [
  'Best Business Idea',
  'Most Innovative',
  'Best Presentation',
  'People\'s Choice',
  'Best Team Spirit',
  'Rising Star',
];

const ParticipantTable = () => {
  const { participants, searchQuery, setSearchQuery, toggleWinner, setAwardTitle, removeParticipant, markSent } =
    useAppStore();
  const [editingAward, setEditingAward] = useState<string | null>(null);
  const [sending, setSending] = useState<Set<string>>(new Set());

  const filtered = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const winners = participants.filter((p) => p.isWinner);

  const handleGenerateAndSend = async (id: string) => {
    const p = participants.find((x) => x.id === id);
    if (!p || !p.awardTitle) return;
    setSending((s) => new Set(s).add(id));
    try {
      await sendCertificateEmail(p);
      markSent(id);
      dbUpdateParticipant(id, { status: 'sent' });
      toast.success(`Certificate sent to ${p.name}!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to send: ${msg}`);
    } finally {
      setSending((s) => { const n = new Set(s); n.delete(id); return n; });
    }
  };

  const handleBulkSend = async () => {
    const unsent = winners.filter((w) => w.status === 'pending' && w.awardTitle);
    for (const w of unsent) {
      await handleGenerateAndSend(w.id);
    }
  };

  const handleExportExcel = () => {
    const data = participants.map((p) => ({
      Name: p.name,
      Email: p.email,
      Team: p.teamName || '',
      Winner: p.isWinner ? 'Yes' : 'No',
      Award: p.awardTitle || '',
      Status: p.status,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Participants');
    XLSX.writeFile(wb, 'participants.xlsx');
    toast.success('Exported to Excel!');
  };

  if (participants.length === 0) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Search & actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search participants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border font-body text-sm"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Badge variant="outline" className="text-xs font-body border-border">
            {participants.length} total
          </Badge>
          <Badge variant="outline" className="text-xs font-body border-primary/30 text-primary">
            <Trophy className="w-3 h-3 mr-1" />
            {winners.length} winners
          </Badge>
          <Button size="sm" variant="outline" onClick={handleExportExcel} className="border-border font-body text-xs">
            <FileSpreadsheet className="w-3 h-3 mr-1" />
            Export Excel
          </Button>
          {winners.filter((w) => w.status === 'pending' && w.awardTitle).length > 0 && (
            <Button size="sm" onClick={handleBulkSend} className="bg-gold-gradient font-body text-xs">
              <Send className="w-3 h-3 mr-1" />
              Send All
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Name</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground font-medium hidden sm:table-cell">Email</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground font-medium hidden md:table-cell">Team</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Award</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Status</th>
                <th className="text-right p-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className={`border-b border-border/50 transition-colors hover:bg-secondary/30 ${
                    p.isWinner ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="p-3 font-medium">
                    <div className="flex items-center gap-2">
                      {p.isWinner && <Trophy className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                      {p.name}
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">{p.email}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{p.teamName || '—'}</td>
                  <td className="p-3">
                    {p.isWinner ? (
                      editingAward === p.id ? (
                        <select
                          className="bg-secondary border border-border rounded px-2 py-1 text-xs text-foreground"
                          value={p.awardTitle || ''}
                          onChange={(e) => {
                            setAwardTitle(p.id, e.target.value);
                            setEditingAward(null);
                          }}
                          onBlur={() => setEditingAward(null)}
                          autoFocus
                        >
                          <option value="">Select award...</option>
                          {AWARD_OPTIONS.map((a) => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingAward(p.id)}
                          className="text-xs text-primary hover:underline"
                        >
                          {p.awardTitle || 'Set award →'}
                        </button>
                      )
                    ) : (
                      <span className="text-muted-foreground/40 text-xs">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    {p.status === 'sent' ? (
                      <Badge className="bg-success/20 text-success border-0 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Sent
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                        Pending
                      </Badge>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm"
                        variant={p.isWinner ? 'default' : 'outline'}
                        onClick={() => toggleWinner(p.id)}
                        className={`h-7 px-2 text-xs ${p.isWinner ? 'bg-gold-gradient' : 'border-border'}`}
                      >
                        <Trophy className="w-3 h-3" />
                      </Button>
                      {p.isWinner && p.awardTitle && p.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleGenerateAndSend(p.id)}
                          disabled={sending.has(p.id)}
                          className="h-7 px-2 text-xs bg-success hover:bg-success/90"
                        >
                          {sending.has(p.id) ? (
                            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeParticipant(p.id)}
                        className="h-7 px-2 text-xs border-border text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParticipantTable;
