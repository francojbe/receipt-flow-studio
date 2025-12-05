import { useEffect, useState } from 'react';
import { Wallet, CalendarDays, CalendarRange, CloudLightning } from 'lucide-react';
import { MonthSelector } from './MonthSelector';
import { StatCard } from './StatCard';
import { TrendChart } from './TrendChart';
import { ActivityList } from './ActivityList';
import { SubscriptionButton } from '../subscription/SubscriptionButton';
import { useAppState } from '@/hooks/useAppState';
import { fetchDashboardFromSupabase } from '@/services/dashboardService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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

  const { user } = useAuth();

  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [mensual, setMensual] = useState(0);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<number | null>(null);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoadState('loading');

    try {
      const now = new Date();
      const isCurrentMonthView =
        currentDashboardDate.getMonth() === now.getMonth() &&
        currentDashboardDate.getFullYear() === now.getFullYear();

      const year = currentDashboardDate.getFullYear();
      const month = String(currentDashboardDate.getMonth() + 1).padStart(2, '0');

      const data = await fetchDashboardFromSupabase(year, month, user.id);
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
    if (user) {
      loadDashboardData();

      const checkSubscription = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('subscription_status, trial_end_date')
          .eq('id', user.id)
          .single();

        if (data) {
          let status = data.subscription_status;

          if (status === 'trial' && data.trial_end_date) {
            const endDate = new Date(data.trial_end_date);
            const now = new Date();
            const diffTime = endDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 0) {
              // Trial expired locally
              status = 'inactive';
              // Update DB to reflect expired status
              await supabase.from('profiles').update({ subscription_status: 'inactive' }).eq('id', user.id);
            } else {
              setTrialDaysRemaining(diffDays);
            }
          }

          setSubscriptionStatus(status);
        }
      };
      checkSubscription();
    }
  }, [currentDashboardDate, user]);

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

      {subscriptionStatus === 'trial' && trialDaysRemaining !== null && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudLightning className="w-4 h-4 text-primary fill-current" />
            <span className="text-xs font-semibold text-primary">
              Prueba Gratuita
            </span>
          </div>
          <span className="text-xs font-bold text-foreground">
            {trialDaysRemaining} días restantes
          </span>
        </div>
      )}

      {(subscriptionStatus !== 'active' && subscriptionStatus !== 'trial') && (
        <div className="px-1">
          <SubscriptionButton />
        </div>
      )}

      {/* Monthly Total - Large Card */}
      <div className={subscriptionStatus !== 'active' && subscriptionStatus !== 'trial' ? 'blur-sm pointer-events-none select-none opacity-50' : ''}>
        <StatCard
          title="Acumulado Mes"
          value={mensual}
          icon={<Wallet className="w-4 h-4" />}
          iconBgColor="bg-primary/10"
          iconTextColor="text-primary"
          size="large"
        />

        {/* Today and Week Grid */}
        <div className="grid grid-cols-2 gap-4 mt-5">
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
        <div className="mt-5">
          <TrendChart data={cachedChartData} />
        </div>

        {/* Activity List */}
        <div className="mt-5">
          <ActivityList movements={cachedRecentMovements.slice(0, 5)} />
        </div>
      </div>
    </section>
  );
}
