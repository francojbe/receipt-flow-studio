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
    return {
      icon: getTypeIcon(tipo),
      bgColor: 'bg-white/10',
      textColor: 'text-white'
    };
  };

  const getTypeIcon = (tipo?: string) => {
    const typeStr = (tipo || '').toLowerCase();
    if (typeStr.includes('credito')) return <CreditCard className="w-4 h-4" />;
    if (typeStr.includes('efectivo')) return <Banknote className="w-4 h-4" />;
    if (typeStr.includes('debito')) return <Building2 className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };
  return <div className="ios-card overflow-hidden">
    <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
      <h3 className="text-sm font-semibold text-white">Actividad Reciente</h3>
      <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald/20 text-emerald-300 rounded-full">
        Mes en curso
      </span>
    </div>

    <div className="divide-y divide-white/10">
      {movements.length === 0 ? <div className="p-6 text-center text-white/50 text-xs">
        Sin registros recientes.
      </div> : movements.map((mov, index) => {
        const iconConfig = getIconConfig(mov.tipo);
        const displayDate = formatDate(mov.fecha);
        const displayTime = formatTime(mov.fecha);
        return <div key={index} className="px-6 py-4 flex justify-between items-center hover:bg-white/5 transition-colors group">
          <div className="flex items-center gap-3 w-2/3">
            <div className={`w-10 h-10 flex-shrink-0 rounded-full ${iconConfig.bgColor} ${iconConfig.textColor} flex items-center justify-center backdrop-blur-sm`}>
              {iconConfig.icon}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate" title={mov.comercio}>
                {mov.comercio}
              </p>
              <p className="text-[10px] text-white/60 flex gap-2">
                <span>{displayDate}</span>
                {displayTime && <>


                </>}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 w-1/3 text-right">
            +{formatCurrency(mov.monto)}
          </span>
        </div>;
      })}
    </div>
  </div>;
}