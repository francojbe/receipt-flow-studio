import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { ChartDataPoint } from '@/services/api';

interface TrendChartProps {
  data: ChartDataPoint[];
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="ios-card p-6">
      <h3 className="text-sm font-semibold text-white mb-4">Tendencia</h3>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(211, 100%, 50%)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="hsl(211, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="dia"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(214, 32%, 91%)',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              }}
              formatter={(value: number) => [
                new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value),
                'Ventas',
              ]}
            />
            <Area
              type="monotone"
              dataKey="monto"
              stroke="hsl(211, 100%, 50%)"
              strokeWidth={2}
              fill="url(#colorMonto)"
              dot={false}
              activeDot={{ r: 6, stroke: 'hsl(211, 100%, 50%)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
