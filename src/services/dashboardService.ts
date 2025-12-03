import { supabase } from '@/integrations/supabase/client';
import { DashboardData, Movement, ChartDataPoint } from './api';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, subDays, format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Define the interface matching your 'gastos' table
interface Gasto {
    id: number;
    created_at: string;
    fecha_gasto: string; // date
    monto_total: number;
    nombre_comercio: string | null;
    medio_pago: string | null;
    rut_emisor: string | null;
    user_id: string;
    type: string | null; // Added via migration
}

export async function fetchDashboardFromSupabase(year: number, month: string, userId: string): Promise<DashboardData> {
    // Construct date ranges
    const dateObj = new Date(year, parseInt(month) - 1);
    const monthStart = startOfMonth(dateObj);
    const monthEnd = endOfMonth(dateObj);

    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
    const yesterday = subDays(today, 1);

    // 1. Fetch Selected Month Data
    const { data: monthDataRaw, error: monthError } = await supabase
        .from('gastos' as any)
        .select('*')
        .eq('user_id', userId)
        .gte('fecha_gasto', format(monthStart, 'yyyy-MM-dd'))
        .lte('fecha_gasto', format(monthEnd, 'yyyy-MM-dd'))
        .order('fecha_gasto', { ascending: false });

    if (monthError) throw monthError;
    const monthData = monthDataRaw as unknown as Gasto[];

    // 2. Fetch "Real Time" Data (Today, Yesterday, Week)
    const { data: realtimeDataRaw, error: rtError } = await supabase
        .from('gastos' as any)
        .select('*')
        .eq('user_id', userId)
        .gte('fecha_gasto', format(subDays(startOfCurrentWeek, 1), 'yyyy-MM-dd'))
        .lte('fecha_gasto', format(today, 'yyyy-MM-dd'));

    if (rtError) throw rtError;
    const realtimeData = realtimeDataRaw as unknown as Gasto[];

    // --- Calculations ---

    // 1. Monthly Total
    const monthlyTotal = monthData?.reduce((sum, t) => sum + Number(t.monto_total), 0) || 0;

    // 2. Daily Total (Today)
    const dailyTotal = realtimeData
        ?.filter(t => isSameDay(parseISO(t.fecha_gasto), today))
        .reduce((sum, t) => sum + Number(t.monto_total), 0) || 0;

    // 3. Yesterday Total
    const yesterdayTotal = realtimeData
        ?.filter(t => isSameDay(parseISO(t.fecha_gasto), yesterday))
        .reduce((sum, t) => sum + Number(t.monto_total), 0) || 0;

    // 4. Weekly Total
    const weeklyTotal = realtimeData
        ?.filter(t => {
            const d = parseISO(t.fecha_gasto);
            return d >= startOfCurrentWeek && d <= endOfCurrentWeek;
        })
        .reduce((sum, t) => sum + Number(t.monto_total), 0) || 0;

    // 5. Recent Movements (List)
    const ultimos_movimientos: Movement[] = monthData?.map(t => ({
        fecha: t.fecha_gasto,
        comercio: t.nombre_comercio || 'Sin nombre',
        monto: Number(t.monto_total),
        tipo: t.type || 'expense',
        descripcion: t.medio_pago || '' // Using medio_pago as description/subtitle
    })) || [];

    // 6. Chart Data (Group by day)
    const chartMap = new Map<string, number>();
    let iterDate = monthStart;
    while (iterDate <= monthEnd) {
        chartMap.set(format(iterDate, 'yyyy-MM-dd'), 0);
        iterDate = new Date(iterDate.setDate(iterDate.getDate() + 1));
    }

    monthData?.forEach(t => {
        const current = chartMap.get(t.fecha_gasto) || 0;
        chartMap.set(t.fecha_gasto, current + Number(t.monto_total));
    });

    const grafico: ChartDataPoint[] = Array.from(chartMap.entries()).map(([dateStr, amount]) => ({
        dia: format(parseISO(dateStr), 'd', { locale: es }),
        monto: amount
    }));

    return {
        kpis: {
            diario: dailyTotal,
            semanal: weeklyTotal,
            mensual: monthlyTotal,
            comparativa_ayer: yesterdayTotal
        },
        ultimos_movimientos,
        grafico
    };
}
