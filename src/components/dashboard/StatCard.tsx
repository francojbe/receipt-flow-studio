import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  badge?: string | ReactNode;
  showPulse?: boolean;
  size?: 'default' | 'large';
  comparison?: number;
}

export function StatCard({
  title,
  value,
  icon,
  iconBgColor,
  iconTextColor,
  badge,
  showPulse,
  size = 'default',
  comparison,
}: StatCardProps) {
  const isLarge = size === 'large';

  return (
    <div className={cn('ios-card p-5 flex flex-col justify-between', isLarge && 'p-6')}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm',
              iconBgColor,
              iconTextColor
            )}
          >
            {icon}
          </div>
          {isLarge && (
            <span className="text-sm font-medium text-white/60 uppercase tracking-wider">
              {title}
            </span>
          )}
        </div>
        {showPulse && <span className={cn('pulse-dot', iconBgColor.replace('/10', ''))} />}
      </div>

      <div className={isLarge ? '' : 'mt-2'}>
        {!isLarge && (
          <span className="text-xs font-semibold text-white/60 uppercase">{title}</span>
        )}
        <h3
          className={cn(
            'font-bold text-white tracking-tight',
            isLarge ? 'text-4xl' : 'text-xl mt-0.5'
          )}
        >
          {formatCurrency(value)}
        </h3>
        {isLarge && (
          <span className="text-sm text-white/50 mt-1 font-medium">CLP Total</span>
        )}
      </div>

      {comparison !== undefined && (
        <ComparisonBadge value={comparison} />
      )}

      {badge && typeof badge === 'string' && (
        <div className="mt-2 text-[10px] font-medium px-2 py-1 bg-white/10 rounded-lg w-fit text-white/80">
          {badge}
        </div>
      )}
    </div>
  );
}

function ComparisonBadge({ value }: { value: number }) {
  if (value > 0) {
    return (
      <div className="mt-2 text-[10px] font-medium px-2 py-1 rounded-lg bg-success/10 text-success w-fit flex items-center gap-1">
        <TrendingUp className="w-3 h-3" />
        +{formatCurrency(value)}
      </div>
    );
  }

  if (value < 0) {
    return (
      <div className="mt-2 text-[10px] font-medium px-2 py-1 rounded-lg bg-destructive/10 text-destructive w-fit flex items-center gap-1">
        <TrendingDown className="w-3 h-3" />
        {formatCurrency(Math.abs(value))}
      </div>
    );
  }

  return (
    <div className="mt-2 text-[10px] font-medium px-2 py-1 rounded-lg bg-secondary text-muted-foreground w-fit flex items-center gap-1">
      <Minus className="w-3 h-3" />
      0%
    </div>
  );
}
