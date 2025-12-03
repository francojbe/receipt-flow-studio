import { supabase } from '@/integrations/supabase/client';
import { CartolaData } from './api';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export async function fetchCartolaFromSupabase(year: string, month: string, userId: string): Promise<CartolaData[]> {
    const dateObj = new Date(parseInt(year), parseInt(month) - 1);
    const monthStart = startOfMonth(dateObj);
    const monthEnd = endOfMonth(dateObj);

    const { data, error } = await supabase
        .from('gastos' as any)
        .select('*')
        .eq('user_id', userId)
        .gte('fecha_gasto', format(monthStart, 'yyyy-MM-dd'))
        .lte('fecha_gasto', format(monthEnd, 'yyyy-MM-dd'))
        .order('fecha_gasto', { ascending: false });

    if (error) throw error;

    return (data || []).map((item: any) => ({
        fecha: item.fecha_gasto,
        comercio: item.nombre_comercio || 'Sin nombre',
        descripcion: item.medio_pago || '',
        monto: Number(item.monto_total),
        // Add other fields if necessary to match CartolaData
    }));
}
