import { useStore } from '@/store/useStore';
import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';

export default function App() {
  const isLoggedIn = useStore(s => s.isLoggedIn);

  return isLoggedIn ? <Dashboard /> : <LoginPage />;
}
