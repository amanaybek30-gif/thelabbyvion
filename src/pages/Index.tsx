import { useAppStore } from '@/lib/store';
import LoginScreen from '@/components/LoginScreen';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Dashboard /> : <LoginScreen />;
};

export default Index;
