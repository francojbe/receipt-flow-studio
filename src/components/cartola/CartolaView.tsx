import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Download } from 'lucide-react';
import { fetchCartolaFromSupabase } from '@/services/cartolaService';
import { type CartolaData } from '@/services/api';
import { formatCurrency, getCurrentMonth, convertToCSV, downloadCSV, formatMonthYear } from '@/utils/formatters';
import { supabase } from '@/integrations/supabase/client';

export function CartolaView() {
  const { user } = useAuth();
  const [monthInput, setMonthInput] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(true);
  const [cartolaData, setCartolaData] = useState<CartolaData[]>([]);

  const loadCartola = async (month: string) => {
    if (!month || !user) return;

    setLoading(true);

    try {
      const [year, monthNum] = month.split('-');
      const data = await fetchCartolaFromSupabase(year, monthNum, user.id);
      setCartolaData(data);
    } catch (error) {
      console.error('Cartola Error:', error);
      setCartolaData([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load current month on mount
  useEffect(() => {
    if (user) {
      loadCartola(monthInput);
    }
  }, [user]);

  const handleMonthChange = (value: string) => {
    setMonthInput(value);
    loadCartola(value);
  };

  const handleDownload = () => {
    if (cartolaData.length === 0) return;
    const csv = convertToCSV(cartolaData as Record<string, unknown>[]);
    downloadCSV(csv, `cartola_${monthInput}.csv`);
  };

  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const checkSubscription = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single();
        setSubscriptionStatus(data?.subscription_status || null);
      };
      checkSubscription();
    }
  }, [user]);

  if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trial') {
    return (
      <section className="flex flex-col h-full pt-2 animate-fade-in items-center justify-center">
        <div className="ios-card p-6 text-center max-w-sm mx-4">
          <h2 className="text-xl font-bold mb-2">Suscripción Requerida</h2>
          <p className="text-muted-foreground mb-4">
            Debes tener una suscripción activa para ver tu Cartola y descargar reportes.
          </p>
          <a
            href="/"
            className="inline-block bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow hover:bg-primary/90 transition-colors"
          >
            Ir a Suscribirse
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col h-full pt-2 animate-fade-in">
      {/* Month Filter */}
      <div className="ios-card p-2 mb-4 relative">
        <div className="flex items-center justify-between px-3 gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex-shrink-0">
            Periodo
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground text-right p-2 capitalize pointer-events-none">
              {formatMonthYear(monthInput)}
            </div>
          </div>
        </div>
        <input
          type="month"
          value={monthInput}
          onChange={(e) => handleMonthChange(e.target.value)}
          onClick={(e) => {
            try {
              // Explicitly show picker on click for better UX
              if ('showPicker' in e.currentTarget) {
                (e.currentTarget as any).showPicker();
              }
            } catch (error) {
              // Fallback or ignore if not supported
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>

      {/* Table */}
      <div className="flex-1 ios-card overflow-hidden flex flex-col relative">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 sticky top-0">
              <tr>
                <th className="px-5 py-3 font-semibold">Fecha</th>
                <th className="px-5 py-3 font-semibold">Detalle</th>
                <th className="px-5 py-3 text-right font-semibold">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center">
                    <div className="flex justify-center">
                      <div className="loader" />
                    </div>
                  </td>
                </tr>
              ) : cartolaData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-muted-foreground text-xs">
                    Sin movimientos.
                  </td>
                </tr>
              ) : (
                cartolaData.map((row, index) => {
                  const fecha = row.fecha || row.date || '--';
                  const desc = row.comercio || row.descripcion || 'Venta';
                  const monto = row.monto || row.amount || 0;

                  return (
                    <tr key={index} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-5 py-3 whitespace-nowrap text-xs font-medium text-muted-foreground">
                        {fecha}
                      </td>
                      <td className="px-5 py-3 text-xs font-medium text-foreground truncate max-w-[140px]">
                        {desc}
                      </td>
                      <td className="px-5 py-3 text-right text-xs font-bold text-emerald">
                        {formatCurrency(monto)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Loader Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-card/60 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="loader" />
          </div>
        )}
      </div>

      {/* Download Button */}
      <div className="mt-4 pb-4">
        <button
          onClick={handleDownload}
          disabled={cartolaData.length === 0}
          className="w-full bg-foreground hover:bg-foreground/90 disabled:bg-muted disabled:cursor-not-allowed text-background font-semibold py-4 rounded-full shadow-ios-lg transition-all flex items-center justify-center gap-2 text-sm press-effect"
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </button>
      </div>
    </section>
  );
}
