import { ReactNode, useState, useEffect } from 'react';
import { FileText, PieChart, List, LogOut, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppState, ViewType } from '@/hooks/useAppState';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { ModeToggle } from '../mode-toggle';
import { SideMenu } from './SideMenu';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from '@/integrations/supabase/client';

interface HeaderConfig {
  title: string;
  icon: ReactNode;
}

const headerConfigs: Record<ViewType, HeaderConfig> = {
  scanner: {
    title: 'Registrar Boleta',
    icon: <FileText className="w-5 h-5" />,
  },
  dashboard: {
    title: 'Reporte de Ventas',
    icon: <PieChart className="w-5 h-5" />,
  },
  cartola: {
    title: 'Cartola Histórica',
    icon: <List className="w-5 h-5" />,
  },
};

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { currentView, setCurrentView } = useAppState();
  const config = headerConfigs[currentView];
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [displayName, setDisplayName] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('nombre')
        .eq('id', user.id)
        .single();

      if (data?.nombre) {
        setDisplayName(data.nombre);
      } else {
        setDisplayName(user.email?.split('@')[0] || 'Usuario');
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <main className="w-full max-w-md sm:rounded-[3rem] sm:shadow-2xl overflow-hidden h-screen sm:h-[850px] flex flex-col relative border border-gray-100 bg-white/30 backdrop-blur-lg">
      {/* Background Image with Effects */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/register-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for translucency and shine */}
        <div className="absolute inset-0 bg-white/40 bg-gradient-to-br from-white/50 to-transparent backdrop-brightness-110" />
      </div>

      {/* Header with Glassmorphism */}
      <header className="absolute top-0 w-full z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
              <AvatarImage src="" />
              <AvatarFallback className="bg-brand-lime text-brand-dark font-bold">
                {displayName ? displayName[0].toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-lg font-bold text-brand-dark tracking-tight">
              {currentView === 'scanner' ? (
                <span>Hola, <span className="capitalize">{displayName}</span></span>
              ) : (
                config.title
              )}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <SideMenu />
          </div>
        </div>
      </header>

      {/* Spacer for sticky header */}
      <div className="h-24 flex-shrink-0 bg-transparent" />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-6 pb-32">
        {children}
      </div>

      {/* Bottom Navigation Dock */}
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </main>
  );
}

interface BottomNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const navItems: { view: ViewType; icon: ReactNode; label: string }[] = [
    { view: 'scanner', icon: <PlusCircle className="w-6 h-6" />, label: 'Registrar' },
    { view: 'dashboard', icon: <PieChart className="w-6 h-6" />, label: 'Reporte' },
    { view: 'cartola', icon: <List className="w-6 h-6" />, label: 'Cartola' },
  ];

  return (
    <nav className="absolute bottom-8 left-6 right-6 bg-white/80 backdrop-blur-md border border-white/40 rounded-full shadow-2xl flex justify-between items-center p-2 z-50">
      {navItems.map(({ view, icon, label }) => {
        const isActive = currentView === view;
        return (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={cn(
              'flex items-center justify-center gap-2 px-6 py-3.5 rounded-full transition-all duration-300',
              isActive
                ? 'bg-brand-lime text-brand-dark font-bold shadow-sm'
                : 'text-gray-500 hover:text-brand-dark'
            )}
          >
            {icon}
            {isActive && (
              <span className="text-xs animate-fade-in whitespace-nowrap hidden sm:inline-block">
                {label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
