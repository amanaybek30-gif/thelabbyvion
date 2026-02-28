import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const AddParticipantForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState('');
  const addParticipants = useAppStore((s) => s.addParticipants);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    addParticipants([
      {
        id: `p-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        teamName: team.trim(),
        isWinner: false,
        status: 'pending',
      },
    ]);
    setName('');
    setEmail('');
    setTeam('');
    toast.success('Participant added');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <div className="flex-1">
        <Label className="sr-only">Name</Label>
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary border-border font-body text-sm" />
      </div>
      <div className="flex-1">
        <Label className="sr-only">Email</Label>
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary border-border font-body text-sm" />
      </div>
      <div className="flex-1">
        <Label className="sr-only">Team</Label>
        <Input placeholder="Team (optional)" value={team} onChange={(e) => setTeam(e.target.value)} className="bg-secondary border-border font-body text-sm" />
      </div>
      <Button type="submit" className="bg-gold-gradient font-body text-sm shrink-0">
        <UserPlus className="w-4 h-4 mr-1" />
        Add
      </Button>
    </form>
  );
};

export default AddParticipantForm;
