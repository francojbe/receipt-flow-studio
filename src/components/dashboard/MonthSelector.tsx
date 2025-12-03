import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonthLabel } from '@/utils/formatters';

interface MonthSelectorProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
}

export function MonthSelector({ currentDate, onPrevious, onNext }: MonthSelectorProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex items-center bg-card rounded-full shadow-sm border border-border/60 p-1 px-2">
        <button
          onClick={onPrevious}
          className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="px-4 text-center min-w-[120px]">
          <span className="text-sm font-semibold text-foreground capitalize">
            {formatMonthLabel(currentDate)}
          </span>
        </div>

        <button
          onClick={onNext}
          className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
