import { useEffect, useState } from 'react';
import { Wallet, CalendarDays, CalendarRange, CloudLightning } from 'lucide-react';
import { MonthSelector } from './MonthSelector';
import { StatCard } from './StatCard';
import { TrendChart } from './TrendChart';
import { ActivityList } from './ActivityList';
import { useAppState } from '@/hooks/useAppState';
import { fetchDashboard } from '@/services/api';

type LoadState = 'loading' | 'success' | 'error';

export function DashboardView() {
  const {
    currentDashboardDate,
    changeMonth,
    cachedRealTimeData,
    setCachedRealTimeData,
    cachedRecentMovements,
    setCachedRecentMovements,
    cachedChartData,
    setCachedChartData,
  } = useAppState();

  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [mensual, setMensual] = useState(0);

  const loadDashboardData = async () => {
    setLoadState('loading');

    try {
      const now = new Date();
      const isCurrentMonthView =
        currentDashboardDate.getMonth() === now.getMonth() &&
        currentDashboardDate.getFullYear() === now.getFullYear();

      const year = currentDashboardDate.getFullYear();
      const month = String(currentDashboardDate.getMonth() + 1).padStart(2, '0');

      const data = await fetchDashboard(year, month);
      const kpis = data.kpis;

      // Cache real-time data for current month
      if (isCurrentMonthView || !cachedRealTimeData) {
        setCachedRealTimeData({
          diario: kpis.diario || 0,
          semanal: kpis.semanal || 0,
          comparativa: kpis.comparativa_ayer || 0,
        });

        // Sort movements and cache
        const movements = [...(data.ultimos_movimientos || [])];
        movements.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        setCachedRecentMovements(movements);
      }

      setMensual(kpis.mensual || 0);
      setCachedChartData(data.grafico || []);
      setLoadState('success');
    } catch (error) {
      console.error('Dashboard Error:', error);
      setLoadState('error');
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentDashboardDate]);

  if (loadState === 'loading') {
    return (
      <section className="flex flex-col h-full pt-2 animate-fade-in">
        <MonthSelector
          currentDate={currentDashboardDate}
          onPrevious={() => changeMonth(-1)}
          onNext={() => changeMonth(1)}
        />
        <div className="flex-1 flex flex-col items-center justify-center h-60">
          <div className="loader mb-2" />
          <p className="text-muted-foreground text-xs font-medium">Actualizando...</p>
        </div>
      </section>
    );
  }

  if (loadState === 'error') {
    return (
      <section className="flex flex-col h-full pt-2 animate-fade-in">
        <MonthSelector
          currentDate={currentDashboardDate}
          onPrevious={() => changeMonth(-1)}
          onNext={() => changeMonth(1)}
        />
        <div className="flex-col items-center justify-center h-60 text-center ios-card p-6 mt-5 flex">
          <CloudLightning className="w-8 h-8 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground text-sm mb-4">No se pudieron cargar los datos.</p>
          <button
            onClick={loadDashboardData}
            className="text-primary text-sm font-semibold"
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col pt-2 space-y-5 animate-fade-in">
      <MonthSelector
        currentDate={currentDashboardDate}
        onPrevious={() => changeMonth(-1)}
        onNext={() => changeMonth(1)}
      />

      {/* Monthly Total - Large Card */}
      <StatCard
        title="Acumulado Mes"
        value={mensual}
        icon={<Wallet className="w-4 h-4" />}
        iconBgColor="bg-primary/10"
        iconTextColor="text-primary"
        size="large"
      />

      {/* Today and Week Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Hoy"
          value={cachedRealTimeData?.diario || 0}
          icon={<CalendarDays className="w-4 h-4" />}
          iconBgColor="bg-emerald/10"
          iconTextColor="text-emerald"
          showPulse
          comparison={cachedRealTimeData?.comparativa}
        />
        <StatCard
          title="Semana"
          value={cachedRealTimeData?.semanal || 0}
          icon={<CalendarRange className="w-4 h-4" />}
          iconBgColor="bg-purple/10"
          iconTextColor="text-purple"
          showPulse
          badge="En curso"
        />
      </div>

      {/* Trend Chart */}
      <TrendChart data={cachedChartData} />

      {/* Activity List */}
      <ActivityList movements={cachedRecentMovements} />
    </section>
  );
}
