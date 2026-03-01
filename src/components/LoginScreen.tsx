import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import vionLogo from '@/assets/vion-logo.png';
import { Lock } from 'lucide-react';

const LoginScreen = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'vionlab2026') {
      setAuthenticated(true);
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-10">
          <img src={vionLogo} alt="VION" className="w-24 h-24 mx-auto mb-6 rounded-xl" />
          <h1 className="text-3xl font-display font-bold text-gold-gradient mb-2">
            The Lab
          </h1>
          <p className="text-muted-foreground font-body text-sm">
            Reward System — Admin Access
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground text-xs uppercase tracking-wider font-body">
              Admin Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password"
                className="pl-10 bg-secondary border-border focus:ring-primary font-body"
              />
            </div>
            {error && <p className="text-destructive text-xs font-body">{error}</p>}
          </div>
          <Button type="submit" className="w-full bg-gold-gradient font-body font-semibold tracking-wide">
            Access Dashboard
          </Button>
        </form>

        <p className="text-center text-muted-foreground text-xs mt-8 font-body">
          © 2026 VION Events. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
