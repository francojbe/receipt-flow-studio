import { AppShell } from '@/components/layout/AppShell';
import { ScannerView } from '@/components/scanner/ScannerView';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { CartolaView } from '@/components/cartola/CartolaView';
import { useAppState } from '@/hooks/useAppState';

const Index = () => {
  const { currentView } = useAppState();

  return (
    <div className="min-h-screen flex items-center justify-center sm:p-4">
      <AppShell>
        {currentView === 'scanner' && <ScannerView />}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'cartola' && <CartolaView />}
      </AppShell>
    </div>
  );
};

export default Index;
