import { useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { Participant } from '@/lib/types';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

const CSVUpload = () => {
  const addParticipants = useAppStore((s) => s.addParticipants);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim());
        const header = lines[0].toLowerCase();
        
        if (!header.includes('name') || !header.includes('email')) {
          toast.error('CSV must contain Name and Email columns');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const nameIdx = headers.indexOf('name');
        const emailIdx = headers.indexOf('email');
        const teamIdx = headers.indexOf('team') !== -1 ? headers.indexOf('team') : headers.indexOf('team name');

        const newParticipants: Participant[] = lines.slice(1).map((line, i) => {
          const cols = line.split(',').map((c) => c.trim());
          return {
            id: `p-${Date.now()}-${i}`,
            name: cols[nameIdx] || '',
            email: cols[emailIdx] || '',
            teamName: teamIdx >= 0 ? cols[teamIdx] || '' : '',
            isWinner: false,
            status: 'pending' as const,
          };
        }).filter((p) => p.name && p.email);

        addParticipants(newParticipants);
        toast.success(`${newParticipants.length} participants added`);
      };
      reader.readAsText(file);
    },
    [addParticipants]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.name.endsWith('.csv')) handleFile(file);
      else toast.error('Please upload a CSV file');
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group"
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleChange}
        className="hidden"
        id="csv-upload"
      />
      <label htmlFor="csv-upload" className="cursor-pointer">
        <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
        <p className="text-sm text-muted-foreground font-body">
          Drop CSV file or <span className="text-primary underline">browse</span>
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1 font-body">
          Columns: Name, Email, Team (optional)
        </p>
      </label>
    </div>
  );
};

export default CSVUpload;
