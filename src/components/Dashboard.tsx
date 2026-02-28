import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import CSVUpload from './CSVUpload';
import ParticipantTable from './ParticipantTable';
import AddParticipantForm from './AddParticipantForm';
import CertificatePreview from './CertificatePreview';
import GroupManager from './GroupManager';
import vionLogo from '@/assets/vion-logo.png';
import { Button } from '@/components/ui/button';
import { LogOut, Eye, Users, Trophy, Layers } from 'lucide-react';

const Dashboard = () => {
  const { participants, groups, setAuthenticated } = useAppStore();
  const [previewId, setPreviewId] = useState<string | null>(null);
  const winners = participants.filter((p) => p.isWinner);
  const previewParticipant = participants.find((p) => p.id === previewId) || winners[0];

  const stats = [
    { label: 'Participants', value: participants.length, icon: Users },
    { label: 'Winners', value: winners.length, icon: Trophy },
    { label: 'Groups', value: groups.length, icon: Layers },
    { label: 'Sent', value: participants.filter((p) => p.status === 'sent').length, icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between glass sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={vionLogo} alt="VION" className="w-8 h-8 rounded-md" />
          <div>
            <h1 className="text-sm font-display font-bold text-gold-gradient">The Lab by VION</h1>
            <p className="text-[10px] text-muted-foreground font-body">Reward System</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAuthenticated(false)}
          className="border-border text-muted-foreground text-xs font-body"
        >
          <LogOut className="w-3 h-3 mr-1" />
          Logout
        </Button>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-card rounded-lg border border-border p-4 text-center">
              <s.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground font-body">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Upload & Add */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h2 className="text-sm font-display font-semibold text-foreground">Upload Participants</h2>
            <CSVUpload />
          </div>
          <div className="space-y-3">
            <h2 className="text-sm font-display font-semibold text-foreground">Add Manually</h2>
            <AddParticipantForm />
          </div>
        </div>

        {/* Participant Table */}
        <ParticipantTable />

        {/* Elite Circle Groups */}
        <GroupManager />

        {/* Certificate Preview */}
        {winners.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-display font-semibold text-foreground">Certificate Preview</h2>
            {winners.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {winners.map((w) => (
                  <Button
                    key={w.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewId(w.id)}
                    className={`text-xs font-body border-border ${
                      previewId === w.id || (!previewId && w.id === winners[0]?.id) ? 'bg-primary/10 border-primary/30' : ''
                    }`}
                  >
                    {w.name}
                  </Button>
                ))}
              </div>
            )}
            {previewParticipant && <CertificatePreview participant={previewParticipant} />}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
