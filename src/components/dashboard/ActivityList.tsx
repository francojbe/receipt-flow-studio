import { FileText, CreditCard, Banknote, Building2 } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters';
import type { Movement } from '@/services/api';
interface ActivityListProps {
  movements: Movement[];
}
export function ActivityList({
  movements
}: ActivityListProps) {
  const getIconConfig = (tipo?: string) => {
    const typeStr = (tipo || '').toLowerCase();
    if (typeStr.includes('credito')) {
      return {
        icon: <CreditCard className="w-4 h-4" />,
        bgColor: 'bg-primary/10',
        textColor: 'text-primary'
      };
    }
    if (typeStr.includes('efectivo')) {
      return {
        icon: <Banknote className="w-4 h-4" />,
        bgColor: 'bg-emerald/10',
        textColor: 'text-emerald'
      };
    }
    if (typeStr.includes('debito')) {
      return {
        icon: <Building2 className="w-4 h-4" />,
        bgColor: 'bg-indigo/10',
        textColor: 'text-indigo'
      };
    }
    return {
      icon: <FileText className="w-4 h-4" />,
      bgColor: 'bg-secondary',
      textColor: 'text-muted-foreground'
    };
  };
  return <div className="ios-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary/50 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-foreground">Actividad Reciente</h3>
        <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald/20 text-emerald rounded-full">
          Mes en curso
        </span>
      </div>

      <div className="divide-y divide-border">
        {movements.length === 0 ? <div className="p-6 text-center text-muted-foreground text-xs">
            Sin registros recientes.
          </div> : movements.map((mov, index) => {
        const iconConfig = getIconConfig(mov.tipo);
        const displayDate = formatDate(mov.fecha);
        const displayTime = formatTime(mov.fecha);
        return <div key={index} className="px-6 py-4 flex justify-between items-center hover:bg-secondary/50 transition-colors group">
                <div className="flex items-center gap-3 w-2/3">
                  <div className={`w-10 h-10 flex-shrink-0 rounded-full ${iconConfig.bgColor} ${iconConfig.textColor} flex items-center justify-center`}>
                    {iconConfig.icon}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-foreground truncate" title={mov.comercio}>
                      {mov.comercio}
                    </p>
                    <p className="text-[10px] text-muted-foreground flex gap-2">
                      <span>{displayDate}</span>
                      {displayTime && <>
                          <span className="text-border">|</span>
                          
                        </>}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald w-1/3 text-right">
                  +{formatCurrency(mov.monto)}
                </span>
              </div>;
      })}
      </div>
    </div>;
}