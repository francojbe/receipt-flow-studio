import { ReactNode } from 'react';
import { FileText, PieChart, List, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppState, ViewType } from '@/hooks/useAppState';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { ModeToggle } from '../mode-toggle';

interface HeaderConfig {
  title: string;
  subtitle: string;
  icon: ReactNode;
}

const headerConfigs: Record<ViewType, HeaderConfig> = {
  scanner: {
    title: 'Registrar Boleta',
    subtitle: 'Gestión de Ingresos',
    icon: <FileText className="w-5 h-5" />,
  },
  dashboard: {
    title: 'Reporte de Ventas',
    subtitle: 'Métricas de Rendimiento',
    icon: <PieChart className="w-5 h-5" />,
  },
  cartola: {
    title: 'Cartola Histórica',
    subtitle: 'Detalle de Movimientos',
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
  const username = user?.email?.split('@')[0];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <main className="w-full max-w-md bg-background sm:bg-card sm:rounded-4xl sm:shadow-ios-lg overflow-hidden h-screen sm:h-[850px] flex flex-col relative border border-border/50">
      {/* Header with Glassmorphism */}
      <header className="absolute top-0 w-full z-20 glass border-b border-border/50 transition-all duration-300">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
              {config.subtitle}
            </p>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {config.title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {username && (
              <span className="text-sm font-medium text-muted-foreground capitalize">
                {username}
              </span>
            )}
            <ModeToggle />
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shadow-sm"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for sticky header */}
      <div className="h-24 flex-shrink-0 bg-transparent" />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative px-6 pb-24">
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
    { view: 'scanner', icon: <PlusCircleIcon />, label: 'Registrar' },
    { view: 'dashboard', icon: <PieChart className="w-5 h-5" />, label: 'Reporte' },
    { view: 'cartola', icon: <List className="w-5 h-5" />, label: 'Cartola' },
  ];

  return (
    <nav className="absolute bottom-6 left-6 right-6 h-16 glass border border-border/20 rounded-full shadow-dock flex justify-around items-center px-2 z-50">
      {navItems.map(({ view, icon, label }) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className={cn(
            'flex flex-col items-center justify-center w-full h-full rounded-full transition-all',
            currentView === view
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground/70'
          )}
        >
          {icon}
          <span className="text-[10px] font-medium mt-0.5">{label}</span>
        </button>
      ))}
    </nav>
  );
}

function PlusCircleIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
  );
}
